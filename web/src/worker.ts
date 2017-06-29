
import { PitchDetector } from "../../iso/audio/pitchDetector";
import { PitchDetectorParams } from "../../iso/audio/pitchDetector";

const pdParams = new PitchDetectorParams();
const pitchDetector = new PitchDetector(pdParams,(result)=>{
        (postMessage as any)(result);
});

onmessage = (e) => {
    //console.log("rx message");
    pitchDetector.processLinearPcm(
        e.data.dataArray,
        e.data.sampleRate);
};
