import * as m from "mithril";
import { State } from "../state";
import { MidiNote } from "../audio/midiNote";
import { PitchDetectorResult } from "../audio/pitchDetector";
import { Point2 } from "../numerics/point2";

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

function pointToString(point: Point2) {
    if(point) {
        return `(${point.x},${point.y})`;
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

export const App = (getState: () => State) => ({
    view: () => {
        const props = mapStateToProps(getState());
        return (
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
        )
    }
});

