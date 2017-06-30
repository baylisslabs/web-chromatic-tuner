import * as m from "mithril";
import { Store } from "redux";
import { getStore } from "./store";
import { getDispatcher } from "./dispatcher";
import { State } from "../../iso/state";
import { App } from "../../iso/components/app";
import { actions } from "../../iso/actions/app";
const revManifest = require("../../rev/js/rev-manifest.json");
const worker = new Worker(`js/${revManifest["worker.bundle.js"]}`);

const store = getStore();
const dispatch = getDispatcher();

renderApp();

store.subscribe(()=> {
    if(process.env.NODE_ENV==="development") {
        console.log(JSON.stringify(store.getState()));
    };
    requestAnimationFrame(renderApp);
});

worker.onmessage = (e) => {
    dispatch.pitchDetectAction({ result: e.data });
};

/* audio test */
navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(stream=>{
        dispatch.audioStatusAction({ active: true});
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

function renderApp() {
    m.render(document.getElementById("app"),m(App(store.getState(),dispatch)));
}
