
import { Vector, scale, subtractWithScale } from "./vector";
import { argMax } from "./reduce";

export class Matrix {
    private readonly _rows: Vector[];

    constructor(rows: Vector[]) {
        this._rows = rows;
    }

    swapRows(i1: number, i2: number) {
        if(i1!=i2) {
            var c = this._rows[i1];
            this._rows[i1] = this._rows[i2];
            this._rows[i2] = c;
        }
    }

    row(i: number): Vector {
        return this._rows[i];
    }

    col(j: number): Vector {
        const colv = new Array<number>(this._rows.length);
        for(let i=0;i<colv.length;++i) {
            colv[i] = this._rows[i][j];
        }
        return colv;
    }

    doGaussianElimination() {
        const nrows = this._rows.length;
        for(let k=0;k<nrows;++k)
        {
            const i_max = argMax(k,nrows,i=>Math.abs(this._rows[i][k]));
            this.swapRows(k,i_max);
            const a = this._rows[k][k];
            if (a == 0.0) {
                return false;
            }
            scale(this._rows[k],1.0/a);
            for(let i=k+1;i<this._rows.length;++i) {
                subtractWithScale(this._rows[i],this._rows[k],this._rows[i][k]);
            }
        }
        return true;
    }

    doGaussJordan()
    {
        if(this.doGaussianElimination())
        {
            for(let k=this._rows.length-1;k>0;--k) {
                for(let i=k-1;i>=0;--i) {
                    subtractWithScale(this._rows[i],this._rows[k],this._rows[i][k]);
                }
            }
            return true;
        }
        return false;
    }
}
