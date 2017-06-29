

type Reducer<S,T,K extends keyof T> = (state: S, data:T[K]) => S;

type ActionReducerMap<S,T> = {
    [K in keyof T]?: Reducer<S,T,K>;
}

export type ActionBase<T> = {
    type: keyof T;
    data: any;
}

export class ReducerRegistry<S,T> {
    public for: ActionReducerMap<S,T> = {};
    public reduce(state: S, action: ActionBase<T>) {
        if (action.type in this.for) {
            const f = this.for[action.type];
            if (f) {
                return f(state,action.data);
            }
        }
        return state;
    }
}

export const _action = <T>() => {
    return <K extends keyof T>(type: K) => (data: T[K]) => ({ type, data });
};

