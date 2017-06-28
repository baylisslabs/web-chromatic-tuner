
import { Point2, Point2Vector } from "./point2";

export function minimaBetweenZeroCrossing(points: Point2Vector, threshold: number, zero_level: number) : Point2Vector {
    let mins = new Point2Vector(points.length); /* todo: optimise length */
    let last = points.length ? points.get(0) : undefined;
    let down: Point2;
    let up: Point2;
    let local_min: Point2;

    for (let i=1; i<points.length; ++i) {
        const p = points.get(i);

        if (p.y < last.y) {
            down = p;
            up = undefined;
        } else if (p.y > last.y) {
            up = last;
        }

        if (up && down) {
            if (down.y < threshold) {
                if(!local_min||local_min.y > down.y) {
                    local_min = { x:(down.x + up.x) / 2, y: down.y };
                }
            }
            down = undefined;
            up = undefined;
        }

        if (p.y >= zero_level) {
            if(local_min) {
                mins.push(local_min);
            }
            local_min = undefined;
        }

        last = p;
    }

    if(local_min) {
        mins.push(local_min);
    }

    return mins;
}
