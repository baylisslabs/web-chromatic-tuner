
import { Action, ActionType } from "../actions/types";
import { DomainState } from "../state";

export function domainReducer(state = new DomainState(), action: Action) {
    switch(action.type) {
        //case ActionType.FETCH: return fetch(state,action);
        default: return state;
    }
}

