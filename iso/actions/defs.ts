

type Reducer<S,T,K extends keyof T> = (state: S, data:T[K]) => S;

type ActionReducerMap<S,T> = {
    [K in keyof T]?: Reducer<S,T,K>;
}

type _ActionConstructorMap<T> = {
    [K in keyof T]: (data: T[K]) => { type: K, data: T[K] };
}

type _ActionDispatcherMap<T> = {
    [K in keyof T]: (data: T[K]) => void;
}

export type ActionConstructorMap<T> = Readonly<_ActionConstructorMap<T>>;

export type ActionDispatcherMap<T> = Readonly<_ActionDispatcherMap<T>>;

export type IAction<T> = {
    type: keyof T;
    data?: any;
}

function actionCtor<T>() {
    return <K extends keyof T>(type: K) => (data: T[K]) => ({ type, data });
}

function actionDispatcher<T>(func: (action: IAction<T>) => void) {
    return <K extends keyof T>(type: K) => (data: T[K]) => func({ type, data });
}

export class ReducerRegistry<S,T> {
    public for: ActionReducerMap<S,T> = {};
    public reduce(state: S, action: IAction<T>) {
        if (this.for.hasOwnProperty(action.type)) {
            const f = this.for[action.type];
            if (f) {
                return f(state,action.data);
            }
        }
        return state;
    }
}

export function ActionCreators<T>(keys: (keyof T)[]): ActionConstructorMap<T> {
    let result = {} as _ActionConstructorMap<T>;
    let ctor = actionCtor<T>();
    for(const k of keys) {
        result[k] = ctor(k);
    }
    return result;
}

export function ActionDispatchers<T>(func: (action: IAction<T>) => void, keys: (keyof T)[]): ActionDispatcherMap<T> {
    let result = {} as _ActionDispatcherMap<T>;
    let ctor = actionDispatcher<T>(func);
    for(const k of keys) {
        result[k] = ctor(k);
    }
    return result;
}
