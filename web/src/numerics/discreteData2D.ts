
import { Point2D, Point2DVector } from "./point2D";


export function minimaBetweenZeroCrossing(points: Point2DVector, threshold: number, zero_level: number) : Point2DVector {
    let mins = new Point2DVector(points.length); /* todo: optimise length */
    let last = points.length ? points.get(0) : null;
    let down: Point2D = null;
    let up: Point2D = null;
    let local_min: Point2D = null;

    for (let i=1; i<points.length; ++i) {
        const p = points.get(i);

        if (p.y < last.y) {
            down = p;
            up = null;
        } else if (p.y > last.y) {
            up = last;
        }

        if (up != null && down != null) {
            if (down.y < threshold) {
                if(local_min==null||local_min.y > down.y) {
                    local_min = { x:(down.x + up.x) / 2, y: down.y };
                }
            }
            down = null;
            up = null;
        }

        if (p.y >= zero_level) {
            if(local_min!=null) {
                mins.push(local_min);
            }
            local_min = null;
        }

        last = p;
    }

    if(local_min!=null) {
        mins.push(local_min);
    }

    return mins;
}
