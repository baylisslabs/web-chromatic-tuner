

import { ActionCreators } from "./defs";
import { PitchDetectorResult } from "../audio/pitchDetector";

export interface Definitions {
    audioStatusAction: {
        active: boolean
    };
    pitchDetectAction: {
        result: PitchDetectorResult
    };
}

export const actions = ActionCreators<Definitions>(
    "audioStatusAction",
    "pitchDetectAction"
);