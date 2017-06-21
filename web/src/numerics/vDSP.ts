


export function vmul (
    input_1: Float32Array, /* input vector 1 */
    stride_1: number, /* address stride for input vector 1 */
    input_2: Float32Array, /* input vector 2 */
    stride_2: number, /* address stride for input vector 2 */
    result: Float32Array, /* output vector */
    strideResult: number, /* address stride for output vector */
    size: number /* real output count */)
{
    let a=0,b=0,c=0;

    for(let i=0;i<size;++i)
    {
        result[c] = input_1[a]*input_2[b];
        a += stride_1;
        b += stride_2;
        c += strideResult;
    }
}

export function vsq(
    input_1: Float32Array, /* input vector 1 */
    stride_1: number, /* address stride for input vector 1 */
    result: Float32Array, /* output vector */
    strideResult: number, /* address stride for output vector */
    size: number /* real output count */)
{
    let a=0;
    let c = 0;
    for(let i=0;i<size;++i)
    {
        result[c] = input_1[a]*input_1[a];
        a += stride_1;
        c += strideResult;
    }
}

export function sve(
    input_1: Float32Array, /* input vector 1 */
    stride_1: number, /* address stride for input vector 1 */
    size: number)
{
    let a=0;
    let result = 0;
    for(let i=0;i<size;++i)
    {
        result += input_1[a];
        a += stride_1;
    }
    return result;
}


