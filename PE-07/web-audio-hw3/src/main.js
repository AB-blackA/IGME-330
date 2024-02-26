/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// params for drawing on canvas
const drawParams = {
  showGradient: true,
  showBars: true,
  showCircles: true,
  showNoise: false,
  showInvert: false,
  showEmboss: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/New Adventure Theme.mp3",
  sound2: "media/Peanuts Theme.mp3",
  sound3: "media/The Picard Song.mp3"
});

function init() {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);

  //ensure intial state of dropdown is per assignment instructions, new adventure theme
  document.querySelector("#trackSelect").value = "media/New Adventure Theme.mp3";

  //ensure initial state of cb's are what the assignment asks for
  document.querySelector("#cb-noise").checked = drawParams.showNoise;
  document.querySelector("#cb-bars").checked = drawParams.showBars;
  document.querySelector("#cb-circles").checked = drawParams.showCircles;
  document.querySelector("#cb-gradient").checked = drawParams.showGradient;
  document.querySelector("#cb-invert").checked = drawParams.showInvert;
  document.querySelector("#cb-emboss").checked = drawParams.showEmboss;
  
  loop();
}

function setupUI(canvasElement) {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);

  };

  // B - hookup for play button
  const playButton = document.querySelector("#playButton");

  // add .onclick event to button
  playButton.onclick = e => {

    //check if context is in suspended state (Autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }

    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

    // if track is currently paused, play it
    if (e.target.dataset.playing == "no") {

      audio.playCurrentSound();
      //css will set state to "Pause"
      e.target.dataset.playing = "yes";

      // else if track IS playing, pause it!
    } else {
      audio.pauseCurrentSound();

      //css will set state to "Play"
      e.target.dataset.playing = "no";
    }

  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");


  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match that of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set the value of label to match inital value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // E - setup checkboxes
  // set onclicks of our checkboxes to modify values of drawParams object

  
  document.querySelector("#cb-bars").onclick = function (e) {
    drawParams.showBars = e.target.checked;
  };

  document.querySelector("#cb-circles").onclick = function (e) {
    drawParams.showCircles = e.target.checked;
  };
  
  document.querySelector("#cb-gradient").onclick = function (e) {
    drawParams.showGradient = e.target.checked;
  };

  document.querySelector("#cb-noise").onclick = function (e) {
    drawParams.showNoise = e.target.checked;
  };
  
  document.querySelector("#cb-emboss").onclick = function (e) {
    drawParams.showEmboss = e.target.checked;
  };
  
  document.querySelector("#cb-invert").onclick = function (e) {
    drawParams.showInvert = e.target.checked;
  };
} // end setupUI

function loop() {
  requestAnimationFrame(loop);
  canvas.draw(drawParams);
}
export { init };