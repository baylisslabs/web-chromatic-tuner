
export interface Point2D {
    readonly x: number;
    readonly y: number;
}

export class Point2DVector {
    length: number;
    readonly capacity: number;
    private x_values: number[];
    private y_values: number[];
    /* or interleaved for cache-coherence */

    constructor(capacity: number) {
        this.length = 0;
        this.x_values = new Array<number>(capacity);
        this.y_values = new Array<number>(capacity);
    }

    pushxy(x: number, y:number) {
        this.x_values[this.length] = x;
        this.y_values[this.length] = y;
        this.length++;
    }

    push(p :Point2D) {
        this.x_values[this.length] = p.x;
        this.y_values[this.length] = p.y;
        this.length++;
    }

    get(i: number): Point2D {
        return {
            x: this.x_values[i],
            y: this.y_values[i]
        };
    }
}