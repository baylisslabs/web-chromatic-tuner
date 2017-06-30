
import { PitchDetectorResult } from "./audio/pitchDetector";

export class State {
    readonly audioActive: boolean = false;
    readonly pitchData: PitchDetectorResult;
    readonly toggleFullscreen: boolean = false;

    static clone(source:State, modifers: Partial<State>) {
        return {...source, ...modifers};
    }
}
