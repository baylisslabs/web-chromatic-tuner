
import { State } from "../../iso/state";
import { IAction } from "../../iso/actions/defs";
import { Definitions } from "../../iso/actions/app";
//import { getDispatcher } from "./dispatcher";

import * as screenfull from "screenfull";
import { audioControl } from "./audioControl";

//const dispatch = getDispatcher();

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
    } else if (action.type == "startAudio") {
        audioControl.start();
        return undefined;
    } else if (action.type == "stopAudio") {
        audioControl.stop();
        return undefined;
    }

    return action;
}