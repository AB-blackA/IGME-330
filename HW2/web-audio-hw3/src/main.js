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
  showEmboss: false,
  showLowshelf: false,
  showHighshelf: false,
  selectFrequency: true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/New Adventure Theme.mp3",
  sound2: "media/Peanuts Theme.mp3",
  sound3: "media/The Picard Song.mp3"
});

let trackNames;
let trackLocations;






const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);

  loadXmlXHR();

  loop();
};

const loadXmlXHR = () => {
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();

  xhr.onload = (e) => {
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);
    const json = JSON.parse(xhr.responseText);

    document.querySelector("title").textContent = json.Title;

    const trackLocations = json['Track Locations'];
    const trackNames = json['Tracks'];

    updateTrackArrays(trackLocations, trackNames);

    //ensure intial state of dropdown is per assignment instructions, new adventure theme
    document.querySelector("#track-select").value = trackLocations[0];

    const paramsTruthTable = json['Params Truth Table'];

    paramsTruthTable.forEach(entry => {
      // Split the entry by ':' to separate parameter name and value
      const [paramName, paramValue] = entry.split(':');
      // Trim whitespaces from parameter name and value
      const trimmedParamName = paramName.trim();
      const trimmedParamValue = paramValue.trim();
      // Convert paramValue to boolean if it's 'true' or 'false', otherwise keep it as string
      drawParams[trimmedParamName] = (trimmedParamValue === 'true' || trimmedParamValue === 'false') ? (trimmedParamValue === 'true') : trimmedParamValue;
    });

    // Set the checked property of checkboxes based on drawParams values
    document.querySelector("#cb-noise").checked = drawParams.showNoise;
    document.querySelector("#cb-bars").checked = drawParams.showBars;
    document.querySelector("#cb-circles").checked = drawParams.showCircles;
    document.querySelector("#cb-gradient").checked = drawParams.showGradient;
    document.querySelector("#cb-invert").checked = drawParams.showInvert;
    document.querySelector("#cb-emboss").checked = drawParams.showEmboss;
    document.querySelector("#cb-lowshelf").checked = drawParams.showLowshelf;
    document.querySelector("#cb-highshelf").checked = drawParams.showHighshelf;

  }

  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET", url);
  xhr.send();

}

const updateTrackArrays = (locations, names) => {
  trackLocations = locations;
  trackNames = names;
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // B - hookup for play button
  const playButton = document.querySelector("#play-button");

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
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");


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
  let trackSelect = document.querySelector("#track-select");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  let visualizerSelect = document.querySelector("#visualizer-select");

  visualizerSelect.onchange = e => {
    drawParams.selectFrequency = !drawParams.selectFrequency;
  }

  // E - setup checkboxes
  // set onclicks of our checkboxes to modify values of drawParams object


  document.querySelector("#cb-bars").onclick = e => {
    drawParams.showBars = e.target.checked;
  };

  document.querySelector("#cb-circles").onclick = e => {
    drawParams.showCircles = e.target.checked;
  };

  document.querySelector("#cb-gradient").onclick = e => {
    drawParams.showGradient = e.target.checked;
  };

  document.querySelector("#cb-noise").onclick = e => {
    drawParams.showNoise = e.target.checked;
  };

  document.querySelector("#cb-emboss").onclick = e => {
    drawParams.showEmboss = e.target.checked;
  };

  document.querySelector("#cb-invert").onclick = e => {
    drawParams.showInvert = e.target.checked;
  };

  document.querySelector("#cb-lowshelf").onclick = e => {
    drawParams.showLowshelf = e.target.checked;
    audio.toggleLowshelf(drawParams.showLowshelf);
  };

  document.querySelector("#cb-highshelf").onclick = e => {
    drawParams.showHighshelf = e.target.checked;
    audio.toggleHighshelf(drawParams.showHighshelf);
  };
}; // end setupUI

const loop = () => {
  setTimeout(loop);
  canvas.draw(drawParams);
};

export { init };
