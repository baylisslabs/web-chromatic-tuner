

import { ActionCreators, ActionDispatchers, IAction } from "./defs";
import { PitchDetectorResult } from "../audio/pitchDetector";

export interface Definitions {
    audioStatusAction: {
        active: boolean
    };
    pitchDetectAction: {
        result: PitchDetectorResult
    };
    toggleFullScreen: {
    }
}

const keys: (keyof Definitions)[] = [
    "audioStatusAction",
    "pitchDetectAction",
    "toggleFullScreen"
];

export const actions = ActionCreators<Definitions>(keys);

export function createDispatchers(func: (action: IAction<Definitions>) => void) {
    return ActionDispatchers(func,keys);
}