
import { Action, ActionType } from "../actions/types";
import { AudioStatusAction } from "../actions/types";
import { PitchDetectAction } from "../actions/types";
import { AppState } from "../state";

export function appReducer(state = new AppState(), action: Action) {
    switch(action.type) {
        //case ActionType.UPDATE_TIME: return updateTime(state,action);
        case ActionType.AUDIO_STATUS: return audioStatus(state,action);
        case ActionType.PITCH_DETECT: return pitchDetect(state,action);
        default: return state;
    }
}

function audioStatus(state: AppState, action: AudioStatusAction) {
    return AppState.clone(state,{
        audioActive: action.active
     });
}

function pitchDetect(state: AppState, action: PitchDetectAction) {
    return AppState.clone(state,{
        pitchData: action.data
     });
}

