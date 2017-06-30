
import { getDispatcher } from "./dispatcher";

const revManifest = require("../../rev/js/rev-manifest.json");
const worker = new Worker(`js/${revManifest["worker.bundle.js"]}`);
const dispatch = getDispatcher();

worker.onmessage = (e) => {
    dispatch.pitchDetectAction({ result: e.data });
};

class _AudioControl {
    mediaStream: MediaStream;
    audioContext: AudioContext;
    input: MediaStreamAudioSourceNode;
    timerId: any;
    dataArray = new Float32Array(4096);
    analyser: AnalyserNode;
    minIntervalMs = 200;

    start() {
        if(!this.mediaStream) {
            /* audio test */
            navigator.mediaDevices
                .getUserMedia({ audio: true, video: false })
                .then(stream=>{
                    if(!this.mediaStream) {
                        this.mediaStream = stream;
                        this.audioContext = new AudioContext();
                        this.input = this.audioContext.createMediaStreamSource(this.mediaStream);

                        this.analyser = this.audioContext.createAnalyser();
                        this.analyser.fftSize = this.dataArray.length;
                        this.analyser.smoothingTimeConstant = 0;
                        this.input.connect(this.analyser);
                        this.timerId = setInterval(this.onTick.bind(this), this.minIntervalMs);

                        dispatch.audioStatusAction({ active: true });
                    }
                });
        }
    }

    stop() {
        if(this.mediaStream) {
            clearInterval(this.timerId);
            this.timerId = null;
            this.input.disconnect();
            this.audioContext.close();
            this.mediaStream.getAudioTracks().forEach(track=>track.stop());
            //this.mediaStream.stop();
            this.analyser = null;
            this.input = null;
            this.audioContext = null;
            this.mediaStream = null;
              dispatch.audioStatusAction({ active: false });
        }
    }

    onTick() {
        if(this.timerId) {
            this.analyser.getFloatTimeDomainData(this.dataArray);
            //console.log("tx message");
            worker.postMessage({
                dataArray: this.dataArray,
                sampleRate: this.audioContext.sampleRate
            });
        }
    }
}

export const audioControl = new _AudioControl();
