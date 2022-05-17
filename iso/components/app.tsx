import * as m from "mithril";
import { State } from "../state";
import { ActionDispatcherMap } from "../actions/defs";
import { Definitions } from "../actions/app";
import { MidiNote } from "../audio/midiNote";
import { PitchDetectorResult } from "../audio/pitchDetector";
import { Point2 } from "../numerics/point2";
import classes from "../styles/main.map";

const { grid } = classes;

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

const _App = (
    { pitchData, audioActive, buildVersion }: State,
    { toggleFullScreen, startAudio, stopAudio }: ActionDispatcherMap<Definitions>
) => (
    <div class="inner">
        {audioActive ?
            <h1 id='text04'>Now, play a note...</h1> :
            <h1 id='text04'>Welcome. Enable audio to begin...</h1>
        }
        {audioActive && pitchData ?
            <h1 id="text04">{f0HzToNote(pitchData.f_0_Hz)}</h1> :
            <p id="text01">Proof of concept for an online guitar tuner for mobile, tablet or desktop that uses your microphone.
                Its written in Typescript, and uses Mithril, Redux and Web Workers.
            </p>
        }
        <ul id="buttons03" class="buttons">
            <li><a role='button' href='javascript:' class='button n01' onmousedown={()=>toggleFullScreen({})}>Toggle Fullscreen</a></li>
            <li><a role='button' href='javascript:' class='button n01' onmousedown={()=>startAudio({})}>Enable Audio</a></li>
            <li><a role='button' href='javascript:' class='button n01' onmousedown={()=>stopAudio({})}>Disable Audio</a></li>
        </ul>
        <ul>
            <li id="text01">Active: <span>{audioActive ? "Yes":"No"}</span></li>
            <li id="text01">Build: <span>{buildVersion}</span><br/></li>
        </ul>
        {audioActive && pitchData ?
            <ul>
                <li id="text01">f_0_Hz: <span>{pitchData.f_0_Hz}</span> Hz</li>
                <li id="text01">Sampling Rate: <span>{pitchData.samplingRate}</span> Hz</li>
                <li id="text01">Seq#: <span>{pitchData.seq}</span></li>
                <li id="text01">Signal Rx: <span>{pitchData.squelch ? "Yes":"No"}</span></li>
                <li id="text01">Signal Rms2: <span>{pitchData.rmsSquared}</span></li>
                <li id="text01">Time(ms): <span>{pitchData.processingTimeMs}</span></li>
            </ul> : ""
        }
    </div>
);

export const App = {
    view: ({attrs}) => {
        return _App(attrs.state, attrs.dispatch);
    }
};