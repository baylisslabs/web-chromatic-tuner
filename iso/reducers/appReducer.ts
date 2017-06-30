
import { State } from "../state";
import { IAction, ReducerRegistry } from "../actions/defs";
import { Definitions } from "../actions/app";

const arr = new ReducerRegistry<State,Definitions>();

arr.for.audioStatusAction = (state, data) => {
    return State.clone(state,{
        audioActive: data.active
    });
};

arr.for.pitchDetectAction = (state, data) => {
    return State.clone(state,{
        pitchData: data.result
    });
}

export function appReducer(state = new State(), action: IAction<Definitions>) {
    if(process.env.NODE_ENV==="development") {
        console.log(action);
    }
    return arr.reduce(state,action);
}

