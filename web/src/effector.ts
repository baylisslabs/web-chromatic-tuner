
import { State } from "../../iso/state";
import { IAction } from "../../iso/actions/defs";
import { Definitions } from "../../iso/actions/app";

import * as screenfull from "screenfull";

export function effectorMiddleware({ getState }) {
  return next => action => {

    const state = getState() as State;
    const nextAction = effector(state,action);
    if(nextAction) {
        return next(action);
    }
  }
}

/* example: will become a mapped function */
export function effector(state: State, action: IAction<Definitions>): IAction<Definitions> {
    if(action.type == "toggleFullScreen") {
        if(screenfull.enabled) {
            screenfull.toggle();
        }
        return undefined;
    }
    return action;
}