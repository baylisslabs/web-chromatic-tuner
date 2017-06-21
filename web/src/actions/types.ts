

import { Enum } from "typescript-string-enums";
import { PitchDetectorResult } from "../audio/pitchDetector";

export const ActionType = Enum(
    //"UPDATE_TIME",
    "AUDIO_STATUS",
    "PITCH_DETECT"
);

export type ActionType = Enum<typeof ActionType>;

export interface ActionThunk<T extends { type: ActionType }> {
    (dispatch: (action: T) => void): void;
}

export type Action =
    PitchDetectAction
    | AudioStatusAction;

/*export interface TimeAction {
    readonly type: typeof ActionType.UPDATE_TIME;
    readonly timeStamp: number;
}*/

export interface AudioStatusAction {
    readonly type: typeof ActionType.AUDIO_STATUS;
    readonly active: boolean;
    readonly sampleRate: number;
}

export interface PitchDetectAction {
    readonly type: typeof ActionType.PITCH_DETECT;
    readonly data: PitchDetectorResult;
}



