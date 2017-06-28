

export class Quadratic {
    readonly a: number;
    readonly b: number;
    readonly c: number;

    constructor(a: number, b: number, c:number) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static fromVector(v: number[]) {
        return new Quadratic(v[2],v[1],v[0]);
    }

    discriminant() {
        return this.b*this.b - 4.0*this.a*this.c;
    }

    axisOfSym() {
         if (this.a != 0) {
             return -this.b / (2.0 * this.a);
         }
    }

    vertex() {
        if (this.a!=0) {
            return {
                x: -this.b / (2.0 * this.a),
                y: (this.b*this.b - 4.0*this.a*this.c)/(4.0*this.a)
            };
        }
    }
}