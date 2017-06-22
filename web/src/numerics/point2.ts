
export interface Point2 {
    readonly x: number;
    readonly y: number;
}

export class Point2Vector {
    length: number;
    private readonly capacity: number;
    private readonly x_values: number[];
    private readonly y_values: number[];
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

    push(p :Point2) {
        this.x_values[this.length] = p.x;
        this.y_values[this.length] = p.y;
        this.length++;
    }

    get(i: number): Point2 {
        return {
            x: this.x_values[i],
            y: this.y_values[i]
        };
    }

    xvals = () => this.x_values.slice(0,this.length);
    yvals = () => this.y_values.slice(0,this.length);
}