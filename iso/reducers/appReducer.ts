
import {
    ActionBase,
    ReducerRegistry
} from "../actions/defs";

import {
    Definitions
} from "../actions/app";


import { State } from "../state";

const arr = new ReducerRegistry<State,Definitions>();

export function appReducer(state = new State(), action: ActionBase<Definitions>) {
    if(process.env.NODE_ENV==="development") {
        console.log(action);
    }
    return arr.reduce(state,action);
}

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

