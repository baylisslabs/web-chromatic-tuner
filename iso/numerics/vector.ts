

export type Vector = Array<number>;

export function scale(a: Vector, k: number) {
    for(let i=0;i<a.length;++i) {
        a[i] *= k;
    }
}

export function subtract(a: Vector, b: Vector) {
    for(let i=0;i<a.length;++i) {
        a[i] -= b[i];
    }
}

export function subtractWithScale(a: Vector, b: Vector, k: number) {
    for(let i=0;i<a.length;++i) {
        a[i] -= b[i]*k;
    }
}