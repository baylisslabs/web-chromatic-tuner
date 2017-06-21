
import { Point2D } from "./point2D";


export function minimaBetweenZeroCrossing(points: Point2D[], threshold: number, zero_level: number) : Point2D[]
{
    let mins: Point2D[] = [];
    let last = points[0];
    let down: Point2D = null;
    let up: Point2D = null;
    let local_min: Point2D = null;

    for (let i=1; i<points.length; ++i) {
        const p = points[i];

        if (p.y < last.y) {
            down = p;
            up = null;
        } else if (p.y > last.y) {
            up = last;
        }

        if (up != null && down != null) {
            if (down.y < threshold) {
                if(local_min==null||local_min.y > down.y) {
                    local_min = new Point2D((down.x + up.x) / 2, down.y);
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
