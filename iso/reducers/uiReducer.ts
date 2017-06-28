import { Action, ActionType } from "../actions/types";

import { UiState } from "../state";

export function uiReducer(state = new UiState(), action: Action) {
    switch(action.type) {
        default: return state;
    }
}
