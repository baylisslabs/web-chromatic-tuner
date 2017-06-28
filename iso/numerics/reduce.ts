

export function argMax(begin: number, end: number,func: (index: number)=>number)
{
    let max_i = begin;
    let max_f_i = func(begin);
    for(let i=begin+1;i<end;++i)
    {
        var f_i = func(i);
        if(f_i>max_f_i) {
            max_f_i = f_i;
            max_i = i;
        }
    }
    return max_i;
}
