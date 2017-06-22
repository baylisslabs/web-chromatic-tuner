


export function square(src: number[]) {
    const dest = new Array<number>(src.length);
    for(let i=0;i<src.length;++i) {
        dest[i] = src[i]*src[i];
    }
    return dest;
}

export function sum(src: number[]) {
    let accum = 0;
    for(let i=0;i<src.length;++i) {
        accum += src[i];
    }
    return accum;
}

export function cube(src: number[]) {
    const dest = new Array<number>(src.length);
    for(let i=0;i<src.length;++i) {
        dest[i] = src[i]*src[i]*src[i];
    }
    return dest;
}

export function to4th(src: number[]) {
    const dest = new Array<number>(src.length);
    for(let i=0;i<src.length;++i) {
        const sqr = src[i]*src[i];
        dest[i] = sqr*sqr;
    }
    return dest;
}

export function product(a: number[], b: number[]) {
    const dest = new Array<number>(a.length);
    for(let i=0;i<a.length;++i) {
        dest[i] = a[i]*b[i];
    }
    return dest;
}

export function cubeSum(src: number[]) {
    let accum = 0;
    for(let i=0;i<src.length;++i) {
        accum += src[i]*src[i]*src[i];
    }
    return accum;
}

export function to4thSum(src: number[]) {
    let accum = 0;
    for(let i=0;i<src.length;++i) {
        const sqr = src[i]*src[i];
        accum += sqr*sqr;
    }
    return accum;
}

export function productSum(a: number[], b: number[]) {
    let accum = 0;
    for(let i=0;i<a.length;++i) {
        accum += a[i]*b[i];
    }
    return accum;
}