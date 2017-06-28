import * as m from "mithril";
import { Store } from "redux";
import { getStore } from "./store";
import { State } from "../../iso/state";
import { App } from "../../iso/components/app";
import { updateAudioStatus } from "../../iso/actions/app";
import { pitchDetectEvent } from "../../iso/actions/app";
let revManifest = require("../../rev/js/rev-manifest.json");

const worker = new Worker(`js/${revManifest["worker.bundle.js"]}`);

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

worker.onmessage = (e) => {
    requestAnimationFrame(()=>{
        store.dispatch(pitchDetectEvent(e.data));
    });
};

/* audio test */
navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(stream=>{
        store.dispatch(updateAudioStatus(true));
        const context = new AudioContext();

        const input = context.createMediaStreamSource(stream);

        const analyser = context.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0;
        const dataArray = new Float32Array(analyser.fftSize);
        const minIntervalMs = 200;
        console.log(analyser.fftSize);

        input.connect(analyser);

        const timer = setInterval(()=>{

            analyser.getFloatTimeDomainData(dataArray);
            //console.log("tx message");
            worker.postMessage({
                dataArray: dataArray,
                sampleRate: context.sampleRate
            });
        }, minIntervalMs);
    });
