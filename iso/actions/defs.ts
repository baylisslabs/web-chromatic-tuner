

type Reducer<S,T,K extends keyof T> = (state: S, data:T[K]) => S;

type ActionReducerMap<S,T> = {
    [K in keyof T]?: Reducer<S,T,K>;
}

type ActionConstructorMap<T> = {
    [K in keyof T]: (data: T[K]) => { type: K, data: T[K] };
}

function actionCtor<T>() {
    return <K extends keyof T>(type: K) => (data: T[K]) => ({ type, data });
}

export type ActionBase<T> = {
    type: keyof T;
    data: any;
}

export class ReducerRegistry<S,T> {
    public for: ActionReducerMap<S,T> = {};
    public reduce(state: S, action: ActionBase<T>) {
        if (this.for.hasOwnProperty(action.type)) {
            const f = this.for[action.type];
            if (f) {
                return f(state,action.data);
            }
        }
        return state;
    }
}

export function ActionCreators<T>(...keys: (keyof T)[]) {
    let result = {} as ActionConstructorMap<T>;
    let ctor = actionCtor<T>();
    for(const k of keys) {
        result[k] = ctor(k);
    }
    return result;
}
