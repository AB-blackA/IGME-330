/* Author: Professor Andrew Wheeland (note from student Andrew Black, I just followed his tutorial!)
 * Since: unknown, utilized by Andrew Black 2/26/24
 * File: Audio.js
 * Purpose: audio.js is all about using AudioContext to work with audio for our canvas and web page
 */

// NOTE: any comments that start with a number (e.g., // 1) are courtesy of Andrew Wheeland (some others, too!)

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**

let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph

let element, sourceNode, analyserNode, gainNode, biquadFilter, lowShelfBiquadFilter;

// 3 - here we are faking an enumeration

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data

let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**

/* SetupWebAudio: does the necessary setups for our audio to work on our webpage
 * Params: filePath: the filePath of the audio we will use
*/
const setupWebaudio = (filePath) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();

    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.
    
    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;


    // 8 - create a biquadFilter (for bass and treble)
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";

    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "lowshelf";
    // 1000 hertz
    /* biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(20, audioCtx.currentTime); */

    // 9 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);



};

/* LoadSoundFile: sets the source of our Audio element to the filepath
 * Params: filePath: filePath of audio file
*/ 
const loadSoundFile = (filePath) => {
    element.src = filePath;
};

/* PlayCurrentSound: plays the audio element
*/
const playCurrentSound = () => {
    element.play();
};

/* PauseCurrentSound: pauses the audio element
*/
const pauseCurrentSound = () => {
    element.pause();
};

/* SetVolume: sets the volume output of the Audio based on the user's desired choice (Via slider in HTML)
 * Params: value: string that determines the output percentage
 */
const setVolume = (value) => {

    // make sure that it's a Number rather than a String
    value = Number(value);

    gainNode.gain.value = value;

};

/* ToggleHighShelf: method that changes the treble of the audio output
 * Params: highShelf: bool 
 */
const toggleHighshelf = (highshelf) => {
    if (highshelf) {
        biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        biquadFilter.gain.setValueAtTime(-25, audioCtx.currentTime);
    } else {
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

/* ToggleLowShelf: method that changes the bass of the audio output
 * Params: lowShelf: bool 
 */
const toggleLowshelf = (lowshelf) => {
    if (lowshelf) {
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}


export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleHighshelf, toggleLowshelf };
