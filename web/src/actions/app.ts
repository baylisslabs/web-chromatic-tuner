
import { ActionType, ActionThunk } from "./types";
import { AudioStatusAction } from "./types";
import { PitchDetectAction } from "./types";
import { PitchDetectorResult } from "../audio/pitchDetector";

export function updateAudioStatus(active: boolean, sampleRate: number): AudioStatusAction {
    return {
        type: ActionType.AUDIO_STATUS,
        active,
        sampleRate
    };
}

export function pitchDetectEvent(data: PitchDetectorResult): PitchDetectAction {
    return {
        type: ActionType.PITCH_DETECT,
        data
    };
}


