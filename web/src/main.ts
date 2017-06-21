
import { mount } from "./components/app";
import { getStore } from "./store";
import { updateAudioStatus } from "./actions/app";
import { pitchDetectEvent } from "./actions/app";
import { PitchDetector } from "./audio/pitchDetector";
import { PitchDetectorParams } from "./audio/pitchDetector";

const store = getStore();

if(process.env.NODE_ENV==="development") {
    store.subscribe(()=> {
        console.log(JSON.stringify(store.getState()));
    });
}

mount(document.getElementById("app"), store);

/* audio test */
navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(stream=>{
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
        store.dispatch(updateAudioStatus(true,context.sampleRate));
    });
