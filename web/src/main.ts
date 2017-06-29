import * as m from "mithril";
import { Store } from "redux";
import { getStore } from "./store";
import { State } from "../../iso/state";
import { App } from "../../iso/components/app";
import { actions } from "../../iso/actions/app";
const revManifest = require("../../rev/js/rev-manifest.json");
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
        store.dispatch(actions.pitchDetectAction({ result: e.data }));
    });
};

/* audio test */
navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(stream=>{
        store.dispatch(actions.audioStatusAction({ active: true}));
        const context = new AudioContext();

        const input = context.createMediaStreamSource(stream);

        const analyser = context.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0;
        const dataArray = new Float32Array(analyser.fftSize);
        const minIntervalMs = 200;

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
