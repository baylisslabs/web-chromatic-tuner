import * as m from "mithril";
import { State } from "../state";
import { MidiNote } from "../audio/midiNote";
import { PitchDetectorResult } from "../audio/pitchDetector";
import { Point2 } from "../numerics/point2";

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

function toggleFullScreen() {

}

const _App = ({ pitchData, audioActive}: State) => (
    <div>
        <h1>Hello!</h1>
        <button onclick={toggleFullScreen} >Toggle Fullscreen</button><br/>
        Active: <span>{audioActive ? "Yes":"No"}</span><br/>
        {pitchData &&
            <div>
                f_0_Hz: <span>{pitchData.f_0_Hz}</span> Hz<br/>
                note: <span>{f0HzToNote(pitchData.f_0_Hz)}</span><br/>
                bestMinima: <span>{pointToString(pitchData.selectedMinima)}</span><br/>
                Sampling Rate: <span>{pitchData.samplingRate}</span> Hz<br/>
                Seq#: <span>{pitchData.seq}</span><br/>
                Signal Rx: <span>{pitchData.squelch ? "Yes":"No"}</span><br/>
                Signal Rms2: <span>{pitchData.rmsSquared}</span><br/>
                Time(ms): <span>{pitchData.processingTimeMs}</span><br/>
            </div>
        }
    </div>
);

export const App = (getState: () => State) => ({
    view: () => {
        return _App(getState());
    }
});