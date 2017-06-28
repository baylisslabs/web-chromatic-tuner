import * as m from "mithril";
import { Store } from "redux";
import { getStore } from "./store";
import { State } from "../../iso/state";
import { App } from "../../iso/components/app";
import { updateAudioStatus } from "../../iso/actions/app";
import { pitchDetectEvent } from "../../iso/actions/app";
import { PitchDetector } from "../../iso/audio/pitchDetector";
import { PitchDetectorParams } from "../../iso/audio/pitchDetector";

const store = getStore();

function mount(element: HTMLElement, store: Store<State>) {
    m.render(element,m(App(()=>store.getState())));
}

mount(document.getElementById("app"), store);

store.subscribe(()=> {
    if(process.env.NODE_ENV==="development") {
        console.log(JSON.stringify(store.getState()));
    };
    mount(document.getElementById("app"), store);
});

/* audio test */
navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(stream=>{
        store.dispatch(updateAudioStatus(true));
        const context = new AudioContext();
        const input = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(4096,1,1);
        const pdParams = new PitchDetectorParams();
        const pitchDetector = new PitchDetector(pdParams,(result)=>{
            //console.log(seq,result);
            store.dispatch(pitchDetectEvent(result));
        })

        input.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = audioEvent => {
            if(audioEvent.inputBuffer.numberOfChannels>0) {
                pitchDetector.processLinearPcm(
                    audioEvent.inputBuffer.getChannelData(0),
                    audioEvent.inputBuffer.sampleRate);
            }
        };
    });
