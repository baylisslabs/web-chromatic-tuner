

import { minimaBetweenZeroCrossing } from "../numerics/discreteData2D";
import { Point2D } from "../numerics/point2D";
import * as vDSP from "../numerics/vDSP";

export interface PitchDetectorResult
{
    readonly seq: number;
    readonly f_0_Hz : number;
    readonly q_Hz : number;
    readonly samplingRate: number;
    //public DiscreteData2D CorrelationData { get; set; }
    readonly selectedMinima: Point2D;
    readonly processingTimeMs: number
    //public DiscreteData2D LeastSquaresData { get; set; }
    // public QuadraticD? LeastSquaresParabola { get; set; }
    readonly timeStamp: number;
    readonly squelch: boolean;
    readonly rmsSquared: number;
}

export class PitchDetectorParams
{
    readonly _limit_data_len = 3600;  // limits sdf sample length for for coarse detection only
    readonly _first_lag = 10;
    readonly _last_lag = 1800;
    readonly _step_lag = 1;
    readonly _refine_lag_window = 8;
    readonly _refine_step_lag = 1;
    readonly _global_thresh = 0.2;
    readonly _local_thresh = 0.05;
    readonly _squelch_open = 10;
    readonly _squelch_close = 2;
}

export class PitchDetector {
    private readonly _params: PitchDetectorParams;
    private readonly _resultHandler: (result: PitchDetectorResult) => void;

    private _resultSeq: number;
    private _squelch: boolean;
    private _min_avg_pwr2: number;
    private _rmsSquared: number;

    constructor(params: PitchDetectorParams, resultHandler: (result: PitchDetectorResult) => void) {
        this._params = params;
        this._resultHandler = resultHandler;
        this._resultSeq = 0;
        this._squelch = false;
        this._min_avg_pwr2 = Number.MAX_VALUE;
        this._rmsSquared = 0;
    }

    processLinearPcm(pcmData: Float32Array, sampleRate: number) {
        if(pcmData.length >= this._params._last_lag && pcmData.length >= this._params._limit_data_len) {
            let f_0_Hz = 0;
            const t0 = performance.now();

            const sliceBegin = (pcmData.length-this._params._limit_data_len)/2;

            const sdf_result = this.normalised_square_differences(
                this._params._first_lag,
                this._params._last_lag,
                this._params._step_lag,
                pcmData.slice(sliceBegin,sliceBegin+this._params._limit_data_len)
            );

            let mins = minimaBetweenZeroCrossing(sdf_result, this._params._global_thresh,1.0);
            let best_min = this.bestMinimum (mins, this._params._local_thresh);

            /* todo: refine and curve fit */

            if(best_min) {
                const refine_first_lag = Math.max(1,best_min.x - this._params._refine_lag_window / 2);
                const refine_last_lag = Math.min(pcmData.length/2-1,refine_first_lag + this._params._refine_lag_window - 1);
                const refined_sdf_result = this.normalised_square_differences(
                    refine_first_lag,
                    refine_last_lag,
                    this._params._refine_step_lag,
                    pcmData);

                /* todo: curve fit this one */
                mins = minimaBetweenZeroCrossing(refined_sdf_result, this._params._global_thresh,1.0);
                best_min = this.bestMinimum (mins, this._params._local_thresh);

                if(best_min) {
                    var delay = best_min.x;
                    if(delay >= this._params._first_lag && delay <= this._params._last_lag) {
                        f_0_Hz = sampleRate / delay;
                        /*result.Q_Hz = quad_out.HasValue?0.0:(sampleRate / (delay + _params._step_lag)) - result.F_0_Hz;
                        result.LeastSquaresData = refined_sdf_result;
                        result.LeastSquaresParabola = quad_out;*/
                    }
                }
            }


            const result = {
                seq: this._resultSeq++,
                f_0_Hz: f_0_Hz,
                q_Hz: 0,
                samplingRate: sampleRate,
                selectedMinima: best_min,
                processingTimeMs: performance.now() - t0,
                timeStamp: Date.now(),
                squelch: this._squelch,
                rmsSquared: this._rmsSquared
            };

            this._resultHandler(result);
        }
    }

/* assumes mins ordered */
    private bestMinimum(ordered_mins: Point2D[], local_thresh: number): Point2D
    {
        if (ordered_mins.length!=0) {
            let best_min = ordered_mins[0];
            for(let min of ordered_mins) {
                if(min.y < best_min.y) {
                    best_min = min;
                }
            }
            for(let min of ordered_mins) {
                if(min.x >= best_min.x) {
                    break;
                }
                if(min.y-local_thresh < best_min.y) {
                    best_min = min;
                    break;
                }
            }
            return best_min;
        }
        return null;
    }

    private normalised_square_differences(first: number, last: number, step: number, data: Float32Array) {
        const len = data.length;
        const n = (last-first+1)/step;
        const result = Array<Point2D>(n);
        const cms = new Float32Array(len);
        const acf = new Float32Array(len);

        this.cumulative_squares(cms,data,len);

        if(this.update_squelch(cms[cms.length-1]/len)) {
            let delay = first;
            for(let i=0;i<n;i++) {
                result[i] = new Point2D(delay,this.normalised_square_difference_single(delay,data,data,cms,acf,len));
                delay += step;
    		}
            return result;
        }
        else {
            return [] as Array<Point2D>;
        }
    }


    private cumulative_squares(result: Float32Array, data: Float32Array, len: number) {
        vDSP.vsq(data,1,result,1,len);
        /* todo: vector op */
        for(let i=1;i<len;++i) {
            result[i] += result[i-1];
        }
    }

    private normalised_square_difference_single(delay: number, data: Float32Array, data2: Float32Array, cms: Float32Array, acf: Float32Array, len: number)
    {
        const end = (len - delay);
        const sum_m = cms[end-1] + cms[len-1] - cms[delay-1];

        for(let i=0,j=delay;i<end;++i,++j)
        {
            acf[i] = data[i]*data2[j];
        }

        const sum_acf = vDSP.sve(acf,1,end);
        return (-sum_acf-sum_acf) / sum_m + 1.0;
    }


    private update_squelch(rms_squared: number) {
        this._rmsSquared = rms_squared;
        if (rms_squared < this._min_avg_pwr2) {
            this._min_avg_pwr2 = rms_squared;
        }

        if(this._squelch && rms_squared < (this._min_avg_pwr2*this._params._squelch_close)) {
            this._squelch = false;
        }
        else if(!this._squelch && rms_squared > (this._min_avg_pwr2*this._params._squelch_open)) {
            this._squelch = true;
        }
        return this._squelch;
    }
}
