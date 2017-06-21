
import { State } from "../state";

import { appReducer } from "./appReducer";
import { domainReducer } from "./domainReducer";
import { uiReducer } from "./uiReducer";

//import { Action as ReduxAction } from "redux";
import { Action, ActionType } from "../actions/types";

export function rootReducer(state = new State(), action: Action) {
    if(process.env.NODE_ENV==="development") {
        console.log(action);
    }
    return {
        app: appReducer(state.app, action),
        domain: domainReducer(state.domain, action),
        ui: uiReducer(state.ui, action),
    }
}
