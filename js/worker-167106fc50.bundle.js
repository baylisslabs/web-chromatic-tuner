(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitchDetector = exports.PitchDetectorParams = void 0;
var discreteData2_1 = require("../numerics/discreteData2");
var point2_1 = require("../numerics/point2");
var leastSquares_1 = require("../numerics/leastSquares");
var PitchDetectorParams = /** @class */ (function () {
    function PitchDetectorParams() {
        this._limit_data_len = 3600; // limits sdf sample length for for coarse detection only
        this._first_lag = 10;
        this._last_lag = 1800;
        this._step_lag = 2;
        this._refine_lag_window = 8;
        this._refine_step_lag = 1;
        this._global_thresh = 0.2;
        this._local_thresh = 0.05;
        this._squelch_open = 10;
        this._squelch_close = 2;
    }
    return PitchDetectorParams;
}());
exports.PitchDetectorParams = PitchDetectorParams;
var PitchDetector = /** @class */ (function () {
    function PitchDetector(params, resultHandler) {
        this._params = params;
        this._resultHandler = resultHandler;
        this._resultSeq = 0;
        this._squelch = false;
        this._min_avg_pwr2 = Number.MAX_VALUE;
        this._rmsSquared = 0;
    }
    PitchDetector.prototype.processLinearPcm = function (pcmData, sampleRate) {
        if (pcmData.length >= this._params._last_lag && pcmData.length >= this._params._limit_data_len) {
            pcmData = pcmData.slice(0, this._params._limit_data_len);
            var f_0_Hz = 0;
            var quadraticFit = void 0;
            var t0 = performance.now();
            var sdf_result = this.normalised_square_differences(this._params._first_lag, this._params._last_lag, this._params._step_lag, pcmData);
            var mins = (0, discreteData2_1.minimaBetweenZeroCrossing)(sdf_result, this._params._global_thresh, 1.0);
            var best_min = this.bestMinimum(mins, this._params._local_thresh);
            if (best_min) {
                var refine_first_lag = Math.max(1, best_min.x - this._params._refine_lag_window / 2);
                var refine_last_lag = Math.min(pcmData.length / 2 - 1, refine_first_lag + this._params._refine_lag_window - 1);
                var refined_sdf_result = this.normalised_square_differences(refine_first_lag, refine_last_lag, this._params._refine_step_lag, pcmData);
                quadraticFit = this.refineByLeastSquares(refined_sdf_result);
                best_min = quadraticFit ? quadraticFit.vertex() : undefined;
                if (best_min) {
                    var delay = best_min.x;
                    if (delay >= this._params._first_lag && delay <= this._params._last_lag) {
                        f_0_Hz = sampleRate / delay;
                    }
                }
            }
            var result = {
                seq: this._resultSeq++,
                f_0_Hz: f_0_Hz,
                q_Hz: undefined,
                samplingRate: sampleRate,
                selectedMinima: best_min,
                //correlationData: sdf_result,
                //leastSquaresData : refined_sdf_result,
                leastSquaresParabola: quadraticFit,
                processingTimeMs: performance.now() - t0,
                timeStamp: Date.now(),
                squelch: this._squelch,
                rmsSquared: this._rmsSquared
            };
            this._resultHandler(result);
        }
    };
    PitchDetector.prototype.refineByLeastSquares = function (sdf) {
        var lsd = new leastSquares_1.LeastSquares(sdf);
        return lsd.parabola2();
    };
    /* assumes mins ordered */
    PitchDetector.prototype.bestMinimum = function (ordered_mins, local_thresh) {
        if (ordered_mins.length != 0) {
            var best_min = ordered_mins.get(0);
            for (var i = 0; i < ordered_mins.length; ++i) {
                var min = ordered_mins.get(i);
                if (min.y < best_min.y) {
                    best_min = min;
                }
            }
            for (var i = 0; i < ordered_mins.length; ++i) {
                var min = ordered_mins.get(i);
                if (min.x >= best_min.x) {
                    break;
                }
                if (min.y - local_thresh < best_min.y) {
                    best_min = min;
                    break;
                }
            }
            return best_min;
        }
        return null;
    };
    PitchDetector.prototype.normalised_square_differences = function (first, last, step, data) {
        var len = data.length;
        var cms = new Float32Array(len);
        var n = Math.floor((last - first + 1) / step);
        var result = new point2_1.Point2Vector(n);
        this.cumulative_squares(cms, data, len);
        if (this.update_squelch(cms[cms.length - 1] / len)) {
            var delay = first;
            for (var i = 0; i < n; i++) {
                result.pushxy(delay, this.normalised_square_difference_single(delay, data, data, cms, len));
                delay += step;
            }
        }
        return result;
    };
    PitchDetector.prototype.cumulative_squares = function (result, data, len) {
        var accum = 0;
        for (var i = 0; i < len; ++i) {
            accum = result[i] = data[i] * data[i] + accum;
        }
    };
    PitchDetector.prototype.normalised_square_difference_single = function (delay, data, data2, cms, len) {
        var end = (len - delay);
        var sum_m = cms[end - 1] + cms[len - 1] - cms[delay - 1];
        var sum_acf = 0;
        for (var i = 0, j = delay; i < end; ++i, ++j) {
            sum_acf += data[i] * data2[j];
        }
        return (-sum_acf - sum_acf) / sum_m + 1.0;
    };
    PitchDetector.prototype.update_squelch = function (rms_squared) {
        this._rmsSquared = rms_squared;
        if (rms_squared < this._min_avg_pwr2) {
            this._min_avg_pwr2 = rms_squared;
        }
        if (this._squelch && rms_squared < (this._min_avg_pwr2 * this._params._squelch_close)) {
            this._squelch = false;
        }
        else if (!this._squelch && rms_squared > (this._min_avg_pwr2 * this._params._squelch_open)) {
            this._squelch = true;
        }
        return this._squelch;
    };
    return PitchDetector;
}());
exports.PitchDetector = PitchDetector;

},{"../numerics/discreteData2":3,"../numerics/leastSquares":4,"../numerics/point2":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSum = exports.to4thSum = exports.cubeSum = exports.product = exports.to4th = exports.cube = exports.sum = exports.square = void 0;
function square(src) {
    var dest = new Array(src.length);
    for (var i = 0; i < src.length; ++i) {
        dest[i] = src[i] * src[i];
    }
    return dest;
}
exports.square = square;
function sum(src) {
    var accum = 0;
    for (var i = 0; i < src.length; ++i) {
        accum += src[i];
    }
    return accum;
}
exports.sum = sum;
function cube(src) {
    var dest = new Array(src.length);
    for (var i = 0; i < src.length; ++i) {
        dest[i] = src[i] * src[i] * src[i];
    }
    return dest;
}
exports.cube = cube;
function to4th(src) {
    var dest = new Array(src.length);
    for (var i = 0; i < src.length; ++i) {
        var sqr = src[i] * src[i];
        dest[i] = sqr * sqr;
    }
    return dest;
}
exports.to4th = to4th;
function product(a, b) {
    var dest = new Array(a.length);
    for (var i = 0; i < a.length; ++i) {
        dest[i] = a[i] * b[i];
    }
    return dest;
}
exports.product = product;
function cubeSum(src) {
    var accum = 0;
    for (var i = 0; i < src.length; ++i) {
        accum += src[i] * src[i] * src[i];
    }
    return accum;
}
exports.cubeSum = cubeSum;
function to4thSum(src) {
    var accum = 0;
    for (var i = 0; i < src.length; ++i) {
        var sqr = src[i] * src[i];
        accum += sqr * sqr;
    }
    return accum;
}
exports.to4thSum = to4thSum;
function productSum(a, b) {
    var accum = 0;
    for (var i = 0; i < a.length; ++i) {
        accum += a[i] * b[i];
    }
    return accum;
}
exports.productSum = productSum;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimaBetweenZeroCrossing = void 0;
var point2_1 = require("./point2");
function minimaBetweenZeroCrossing(points, threshold, zero_level) {
    var mins = new point2_1.Point2Vector(points.length); /* todo: optimise length */
    var last = points.length ? points.get(0) : undefined;
    var down;
    var up;
    var local_min;
    for (var i = 1; i < points.length; ++i) {
        var p = points.get(i);
        if (p.y < last.y) {
            down = p;
            up = undefined;
        }
        else if (p.y > last.y) {
            up = last;
        }
        if (up && down) {
            if (down.y < threshold) {
                if (!local_min || local_min.y > down.y) {
                    local_min = { x: (down.x + up.x) / 2, y: down.y };
                }
            }
            down = undefined;
            up = undefined;
        }
        if (p.y >= zero_level) {
            if (local_min) {
                mins.push(local_min);
            }
            local_min = undefined;
        }
        last = p;
    }
    if (local_min) {
        mins.push(local_min);
    }
    return mins;
}
exports.minimaBetweenZeroCrossing = minimaBetweenZeroCrossing;

},{"./point2":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeastSquares = void 0;
var quadratic_1 = require("./quadratic");
var matrix_1 = require("./matrix");
var arrayExt = require("./arrayExtensions");
var LeastSquares = /** @class */ (function () {
    function LeastSquares(points) {
        this._points = points;
    }
    LeastSquares.prototype.parabola2 = function () {
        var nvals = this._points.length;
        var xvals = this._points.xvals();
        var yvals = this._points.yvals();
        var xvals2 = arrayExt.square(xvals);
        var sx = arrayExt.sum(xvals);
        var sx2 = arrayExt.sum(xvals2);
        var sx3 = arrayExt.cubeSum(xvals);
        var sx4 = arrayExt.to4thSum(xvals);
        var augm = new matrix_1.Matrix([
            [nvals, sx, sx2, arrayExt.sum(yvals)],
            [sx, sx2, sx3, arrayExt.productSum(yvals, xvals)],
            [sx2, sx3, sx4, arrayExt.productSum(yvals, xvals2)]
        ]);
        if (augm.doGaussJordan()) {
            return quadratic_1.Quadratic.fromVector(augm.col(3));
        }
    };
    return LeastSquares;
}());
exports.LeastSquares = LeastSquares;

},{"./arrayExtensions":2,"./matrix":5,"./quadratic":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
var vector_1 = require("./vector");
var reduce_1 = require("./reduce");
var Matrix = /** @class */ (function () {
    function Matrix(rows) {
        this._rows = rows;
    }
    Matrix.prototype.swapRows = function (i1, i2) {
        if (i1 != i2) {
            var c = this._rows[i1];
            this._rows[i1] = this._rows[i2];
            this._rows[i2] = c;
        }
    };
    Matrix.prototype.row = function (i) {
        return this._rows[i];
    };
    Matrix.prototype.col = function (j) {
        var colv = new Array(this._rows.length);
        for (var i = 0; i < colv.length; ++i) {
            colv[i] = this._rows[i][j];
        }
        return colv;
    };
    Matrix.prototype.doGaussianElimination = function () {
        var _this = this;
        var nrows = this._rows.length;
        var _loop_1 = function (k) {
            var i_max = (0, reduce_1.argMax)(k, nrows, function (i) { return Math.abs(_this._rows[i][k]); });
            this_1.swapRows(k, i_max);
            var a = this_1._rows[k][k];
            if (a == 0.0) {
                return { value: false };
            }
            (0, vector_1.scale)(this_1._rows[k], 1.0 / a);
            for (var i = k + 1; i < this_1._rows.length; ++i) {
                (0, vector_1.subtractWithScale)(this_1._rows[i], this_1._rows[k], this_1._rows[i][k]);
            }
        };
        var this_1 = this;
        for (var k = 0; k < nrows; ++k) {
            var state_1 = _loop_1(k);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    };
    Matrix.prototype.doGaussJordan = function () {
        if (this.doGaussianElimination()) {
            for (var k = this._rows.length - 1; k > 0; --k) {
                for (var i = k - 1; i >= 0; --i) {
                    (0, vector_1.subtractWithScale)(this._rows[i], this._rows[k], this._rows[i][k]);
                }
            }
            return true;
        }
        return false;
    };
    return Matrix;
}());
exports.Matrix = Matrix;

},{"./reduce":8,"./vector":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point2Vector = void 0;
var Point2Vector = /** @class */ (function () {
    /* or interleaved for cache-coherence */
    function Point2Vector(capacity) {
        var _this = this;
        this.xvals = function () { return _this.x_values.slice(0, _this.length); };
        this.yvals = function () { return _this.y_values.slice(0, _this.length); };
        this.length = 0;
        this.x_values = new Array(capacity);
        this.y_values = new Array(capacity);
    }
    Point2Vector.prototype.pushxy = function (x, y) {
        this.x_values[this.length] = x;
        this.y_values[this.length] = y;
        this.length++;
    };
    Point2Vector.prototype.push = function (p) {
        this.x_values[this.length] = p.x;
        this.y_values[this.length] = p.y;
        this.length++;
    };
    Point2Vector.prototype.get = function (i) {
        return {
            x: this.x_values[i],
            y: this.y_values[i]
        };
    };
    return Point2Vector;
}());
exports.Point2Vector = Point2Vector;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quadratic = void 0;
var Quadratic = /** @class */ (function () {
    function Quadratic(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    Quadratic.fromVector = function (v) {
        return new Quadratic(v[2], v[1], v[0]);
    };
    Quadratic.prototype.discriminant = function () {
        return this.b * this.b - 4.0 * this.a * this.c;
    };
    Quadratic.prototype.axisOfSym = function () {
        if (this.a != 0) {
            return -this.b / (2.0 * this.a);
        }
    };
    Quadratic.prototype.vertex = function () {
        if (this.a != 0) {
            return {
                x: -this.b / (2.0 * this.a),
                y: (this.b * this.b - 4.0 * this.a * this.c) / (4.0 * this.a)
            };
        }
    };
    return Quadratic;
}());
exports.Quadratic = Quadratic;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argMax = void 0;
function argMax(begin, end, func) {
    var max_i = begin;
    var max_f_i = func(begin);
    for (var i = begin + 1; i < end; ++i) {
        var f_i = func(i);
        if (f_i > max_f_i) {
            max_f_i = f_i;
            max_i = i;
        }
    }
    return max_i;
}
exports.argMax = argMax;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtractWithScale = exports.subtract = exports.scale = void 0;
function scale(a, k) {
    for (var i = 0; i < a.length; ++i) {
        a[i] *= k;
    }
}
exports.scale = scale;
function subtract(a, b) {
    for (var i = 0; i < a.length; ++i) {
        a[i] -= b[i];
    }
}
exports.subtract = subtract;
function subtractWithScale(a, b, k) {
    for (var i = 0; i < a.length; ++i) {
        a[i] -= b[i] * k;
    }
}
exports.subtractWithScale = subtractWithScale;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pitchDetector_1 = require("../../iso/audio/pitchDetector");
var pitchDetector_2 = require("../../iso/audio/pitchDetector");
var pdParams = new pitchDetector_2.PitchDetectorParams();
var pitchDetector = new pitchDetector_1.PitchDetector(pdParams, function (result) {
    postMessage(result);
});
onmessage = function (e) {
    //console.log("rx message");
    pitchDetector.processLinearPcm(e.data.dataArray, e.data.sampleRate);
};

},{"../../iso/audio/pitchDetector":1}]},{},[10]);
