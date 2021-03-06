
import { Quadratic } from "./quadratic";
import { Matrix } from "./matrix";
import { Point2, Point2Vector } from "./point2";
import * as arrayExt from "./arrayExtensions";

export class LeastSquares {
    private readonly _points: Point2Vector;

    constructor(points: Point2Vector) {
        this._points = points;
    }

    parabola2() : Quadratic {
        const nvals = this._points.length;
        const xvals = this._points.xvals();
        const yvals = this._points.yvals();

        const xvals2  = arrayExt.square(xvals);
        const sx = arrayExt.sum(xvals);
        const sx2 = arrayExt.sum(xvals2);
        const sx3 = arrayExt.cubeSum(xvals);
        const sx4 = arrayExt.to4thSum(xvals);

        const augm = new Matrix([
            [nvals,sx,sx2,arrayExt.sum(yvals)],
            [sx,sx2,sx3,arrayExt.productSum(yvals,xvals)],
            [sx2,sx3,sx4,arrayExt.productSum(yvals,xvals2)]
        ]);

        if(augm.doGaussJordan())
        {
            return Quadratic.fromVector(augm.col(3));
        }
    }
}

