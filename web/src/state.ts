
import { PitchDetectorResult } from "./audio/pitchDetector";

export class State {
    readonly app: AppState;
    readonly domain: DomainState;
    readonly ui: UiState;

    static clone(source:State, modifers: Partial<State>) {
        return {...source, ...modifers};
    }
}

export class AppState {

    readonly audioActive: boolean;
    readonly pitchData: PitchDetectorResult;

    static clone(source:AppState, modifers: Partial<AppState>) {
        return {...source, ...modifers};
    }
}

export class DomainState {

    static clone(source:DomainState, modifers: Partial<DomainState>) {
        return {...source, ...modifers};
    }
}

export class UiState {

    static clone(source:UiState, modifers: Partial<UiState>) {
        return {...source, ...modifers};
    }
}
