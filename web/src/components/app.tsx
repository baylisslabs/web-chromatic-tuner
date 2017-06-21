import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { Store } from "redux";
import { State } from "../state";

import { MidiNote } from "../audio/midiNote";
import { PitchDetectorResult } from "../audio/pitchDetector";
import { Point2D } from "../numerics/point2D";

interface AppProps {
    audioActive: boolean;
    pitchData: PitchDetectorResult;
}

function mapStateToProps(state: State) : AppProps {
    return {
        audioActive: state.app.audioActive,
        pitchData: state.app.pitchData
    };
}

function pointToString(point: Point2D) {
    if(point) {
        return `(${point.x},${point.y})`
    }
    return "null";
}

function f0HzToNote(hz: number) {
    if(hz) {
        const note = MidiNote.fromHz(hz);
        return `${note.sharpName()},${note.pitchBendCents()}`;
    }
    return "---";
}

const App = connect(mapStateToProps)((props: AppProps) => (
    <div>
        <h1>Hello!</h1>
        Active: <span>{props.audioActive ? "Yes":"No"}</span><br/>
        {props.pitchData &&
            <div>
                f_0_Hz: <span>{props.pitchData.f_0_Hz}</span> Hz<br/>
                note: <span>{f0HzToNote(props.pitchData.f_0_Hz)}</span><br/>
                bestMinima: <span>{pointToString(props.pitchData.selectedMinima)}</span><br/>
                Sampling Rate: <span>{props.pitchData.samplingRate}</span> Hz<br/>
                Seq#: <span>{props.pitchData.seq}</span><br/>
                Signal Rx: <span>{props.pitchData.squelch ? "Yes":"No"}</span><br/>
                Signal Rms2: <span>{props.pitchData.rmsSquared}</span><br/>
                Time(ms): <span>{props.pitchData.processingTimeMs}</span><br/>
            </div>
        }
     </div>
));

export function mount(element: HTMLElement, store: Store<State>) {
    ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>), element);
}
