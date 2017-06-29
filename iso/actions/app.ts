

import { _action } from "./defs";
import { PitchDetectorResult } from "../audio/pitchDetector";

/* maybe interface or type ?? */
export type Definitions {
    audioStatusAction: {
        active: boolean
    };
    pitchDetectAction: {
        result: PitchDetectorResult
    };
}

/* todo: derive this object */
export const audioStatusAction = _action<Definitions>()("audioStatusAction");
export const pitchDetectAction = _action<Definitions>()("pitchDetectAction");

