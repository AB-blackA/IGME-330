/* Author: Andrew Black, with Tutorials from Professor Andrew Wheeland
 * Since: 2/26/24
 * File: Main.js
 * Purpose: main.js is primarily responsible for hooking up the UI to the rest of the application.
 * it also sets up the main event loop and does any initializations needed
 */


import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as utils from './utils.js';

// params for drawing on canvas. note that default values are fine here, but they're being loaded in via JSON later
// so im mostly leaving them as null to prove I know my JSON
const drawParams = {
  showGradient: null,
  showBars: null,
  showCircles: null,
  showTriangles: null,
  showSquares: null,
  showNoise: null,
  showInvert: null,
  showEmboss: null,
  showLowshelf: null,
  showHighshelf: null,
  selectFrequency: null
};

//these are arrays
//they keep track of the trackNames and their data locations via a JSON file later
let trackNames;
let trackLocations;

//var for the starting selection of the visualizer options (wavelength or frequency)
//loaded in via json
let startingVisualizerSelection;

//var for the title of our application
//loaded in via json
let title;

/* Init: does setup work for the rest of the program, notably instantiating setup for the canvas element, setting up the audio,
 * loading in the JSON file, and starting a loop for our canvas
 */
const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

  //call our load json with a callback, firing the rest of the code (to ensure all the data in the json is loaded in before being used)
  loadXmlXHR(() => {
    //load in audio
    audio.setupWebaudio(trackLocations[0]);
    //hookup <canvas> element
    let canvasElement = document.querySelector("canvas"); 
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    
    // Ensure intial state of dropdown is per assignment instructions, new adventure theme
    document.querySelector("#track-select").value = trackLocations[0];

    //set default visualizer
    document.querySelector("#visualizer-select").value = startingVisualizerSelection;
    //set title 
    
    document.querySelector("title").textContent = title;
    //start loop
    loop();
  });
};

/* loadXMLXHR: loads in JSON file containg data relevant to application (tracks, title of application, default values for checkboxes)
 * Params: callback: function to be called back, in this case the rest of init
*/
const loadXmlXHR = (callback) => {
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();

  //call the XMLHttpRequest onload event to get started
  xhr.onload = (e) => {
    //log for debugging
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);

    //load in json
    const json = JSON.parse(xhr.responseText);


    //grab the json data for our arrays
    trackLocations = json['Track Locations']; 
    trackNames = json['Tracks'];

    //get our truth table for our params, which holds the values for our checkboxes
    const paramsTruthTable = json['Params Truth Table'];

    paramsTruthTable.forEach(string => {
      // split the strings by ':' to separate parameter name and value
      const [paramName, paramValue] = string.split(':');

      // trim whitespaces from parameter name and value
      const trimmedParamName = paramName.trim();
      const trimmedParamValue = paramValue.trim();

      // convert each trimmed param value (by name, which is accurate with the json) to its true/false value
      drawParams[trimmedParamName] = (trimmedParamValue === 'true' || trimmedParamValue === 'false') ? (trimmedParamValue === 'true') : trimmedParamValue;
    });

    //set other vars equal to JSON values
    startingVisualizerSelection = json['Starting Visualizer State'];
    title = json['Title'];

    // Set the checked property of checkboxes based on drawParams values
    document.querySelector("#cb-noise").checked = drawParams.showNoise;
    document.querySelector("#cb-bars").checked = drawParams.showBars;
    document.querySelector("#cb-circles").checked = drawParams.showCircles;
    document.querySelector("#cb-triangles").checked = drawParams.showTriangles;
    document.querySelector("#cb-squares").checked = drawParams.showSquares;
    document.querySelector("#cb-gradient").checked = drawParams.showGradient;
    document.querySelector("#cb-invert").checked = drawParams.showInvert;
    document.querySelector("#cb-emboss").checked = drawParams.showEmboss;
    document.querySelector("#cb-lowshelf").checked = drawParams.showLowshelf;
    document.querySelector("#cb-highshelf").checked = drawParams.showHighshelf;

    // Execute the callback function
    callback();
  }

  //more debugging and necessary xml code
  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET", url);
  xhr.send();
}


/* SetupUI: sets up the UI elements for our Canvas. 
 * Params: canvasElement: the HTML canvas element
 * NOTE: any commenting with a letter (e.g., // A) is courtesy of Andrew Wheeland
 */
const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");

  // add .onclick event to  fullscreen button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");

    //first use of an imported method, utils.goFullScreen makes the screen go... full
    utils.goFullscreen(canvasElement);
  };

  // B - hookup for play button
  const playButton = document.querySelector("#play-button");

  // add .onclick event to play button
  playButton.onclick = e => {

    //check if context is in suspended state (Autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }

    //debug information
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

    //if track is currently paused, play it
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
    //set the gain
    audio.setVolume(e.target.value);
    //update value of label to match that of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set the value of label to match inital value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#track-select");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // hookup the visualizer selector, which in short changes the visuals based on how the data from audio is read
  let visualizerSelect = document.querySelector("#visualizer-select");

  //set the onclick to change the value of the selectFrequency
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

  document.querySelector("#cb-triangles").onclick = e => {
    drawParams.showTriangles = e.target.checked;
  };

  document.querySelector("#cb-squares").onclick = e => {
    drawParams.showSquares = e.target.checked;
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
}; 

/* Loop: this function calls a continuous loop that is responsible for our visualizer continuing to update
 * note that the setTimeOut function prevents the canvas from updating more than 60 FPS.
 * canvas.draw() is an external function that starts the drawing process, and takes in all those params
 * we grabbed from the JSON file
 */
const loop = () => {
  setTimeout(loop);
  canvas.draw(drawParams);
};


init();