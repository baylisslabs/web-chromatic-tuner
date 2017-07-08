
import { State } from "../../iso/state";
import { IAction } from "../../iso/actions/defs";
import { Definitions } from "../../iso/actions/app";
//import { getDispatcher } from "./dispatcher";

//const dispatch = getDispatcher();

export function analyticsMiddleware({ getState }) {
  return next => action => {

    const state = getState() as State;
    const nextAction = recordAnalyics(state,action);
    if(nextAction) {
        return next(action);
    }
  }
}

/* example: will become a mapped function */
export function recordAnalyics(state: State, action: IAction<Definitions>): IAction<Definitions> {
    if(action.type == "toggleFullScreen") {
        trackEvent(action.type);
    } else if (action.type == "startAudio") {
        trackEvent(action.type);
    } else if (action.type == "stopAudio") {
        trackEvent(action.type);
    } else if (action.type == "audioStatusAction") {
        trackNonInteractive(action.type,`${action.data.active}`);
    }

    return action;
}

function trackEvent(action: string, label?: string) {
    if(ga) {
        ga("send",{
            hitType: "event",
            eventCategory: "WebChromaticTuner",
            eventAction: action,
            eventLabel: label
        });
    }
}

function trackNonInteractive(action: string, label?: string) {
    if(ga) {
        ga("send",{
            hitType: "event",
            eventCategory: "WebChromaticTuner",
            eventAction: action,
            eventLabel: label,
            nonInteraction: true
        });
    }
}