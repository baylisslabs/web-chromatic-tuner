
const sharp_lookup = ["C","C\u266f","D","D\u266f","E","F","F\u266f","G","G\u266f","A","A\u266f","B"];
const flat_lookup = ["C","D\u266d","D","E\u266d","E","F","G\u266d","G","A\u266d","A","B\u266d","B"];


export class MidiNote {
    static readonly A4_STANDARD_HZ = 440;
    static readonly SEMI_TONES_PER_OCTAVE = 12;

    private readonly _noteNumber: number;

    constructor(noteNumber: number) {
        this._noteNumber = noteNumber;
    }

    static fromHz(hz, a4hz = MidiNote.A4_STANDARD_HZ) {
        const note = _note_from_freq_even_temp(hz,a4hz);
        return new MidiNote(note);
    }

    pitchBendCents() {
        return Math.round((this._noteNumber - this._nearestNoteNumber())*100.0);
    }

    pitchBendFraction() {
        return this._noteNumber - this._nearestNoteNumber();
    }

    sharpName() {
        return this.name(sharp_lookup);
    }

    flatName() {
        return this.name(flat_lookup);
    }

    nearestNote() {
        return new MidiNote(this._nearestNoteNumber());
    }

    name(lookup: string[])
    {
        var st = this.semiTone();
        if (st < lookup.length) {
            return lookup[st];
        }
        return undefined;
    }

    octave() {
        return (this._nearestNoteNumber() / MidiNote.SEMI_TONES_PER_OCTAVE) - 1;
    }

    semiTone() {
        return (this._nearestNoteNumber() % MidiNote.SEMI_TONES_PER_OCTAVE);
    }

    _nearestNoteNumber() {
        return Math.round(this._noteNumber);
    }
}

const _LOG_BASE_2 = Math.log(2);

function _note_from_freq_even_temp(hz: number, a4Hz: number) {
    return 69.0+12.0*Math.log(hz/a4Hz)/_LOG_BASE_2;
}

function _freq_from_note_even_temp(noteNumber: number, a4Hz: number) {
    return Math.pow(2.0,(noteNumber-69.0)/12.0)*a4Hz;
}
