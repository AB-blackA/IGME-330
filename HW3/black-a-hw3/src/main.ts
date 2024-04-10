/* Author: Andrew Black, with Tutorials from Professor Andrew Wheeland
 * Since: 2/26/24
 * File: Main.ts
 * Purpose: main.ts is primarily responsible for hooking up the UI to the rest of the application.
 * it also sets up the main event loop and does any initializations needed
 */

import * as audio from './audio';
import * as canvas from './canvas';
import * as utils from './utils';

// Interface for draw parameters
interface DrawParams {
  showGradient: boolean | null;
  showBars: boolean | null;
  showCircles: boolean | null;
  showTriangles: boolean | null;
  showSquares: boolean | null;
  showNoise: boolean | null;
  showInvert: boolean | null;
  showEmboss: boolean | null;
  showLowshelf: boolean | null;
  showHighshelf: boolean | null;
  selectFrequency: boolean | null;
}

// Define the type for drawParams
interface DrawParams {
  showGradient: boolean | null;
  showBars: boolean | null;
  showCircles: boolean | null;
  showTriangles: boolean | null;
  showSquares: boolean | null;
  showNoise: boolean | null;
  showInvert: boolean | null;
  showEmboss: boolean | null;
  showLowshelf: boolean | null;
  showHighshelf: boolean | null;
  selectFrequency: boolean | null;
}

// Params for drawing on canvas
const drawParams: DrawParams = {
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

// Arrays to keep track of trackNames and their data locations via a JSON file later
let trackNames: string[];
let trackLocations: string[];

// Variable for the starting selection of the visualizer options (wavelength or frequency) loaded in via json
let startingVisualizerSelection: string;

// Variable for the title of our application loaded in via json
let title: string;

/* Init: does setup work for the rest of the program, notably instantiating setup for the canvas element, setting up the audio,
 * loading in the JSON file, and starting a loop for our canvas
 */
const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

  // Call our load json with a callback, firing the rest of the code (to ensure all the data in the json is loaded in before being used)
  loadXmlXHR(() => {
    // Load in audio
    audio.setupWebaudio(trackLocations[0]);
    // Hook up <canvas> element
    let canvasElement = document.querySelector("canvas"); 
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    
    // Ensure initial state of dropdown is per assignment instructions, new adventure theme
    (document.querySelector("#track-select") as HTMLSelectElement).value = trackLocations[0];

    // Set default visualizer
    (document.querySelector("#visualizer-select") as HTMLSelectElement).value = startingVisualizerSelection;
    // Set title 
    document.querySelector("title")!.textContent = title;
    // Start loop
    loop();
  });
};

/* loadXMLXHR: loads in JSON file containing data relevant to application (tracks, title of application, default values for checkboxes)
 * Params: callback: function to be called back, in this case the rest of init
*/
const loadXmlXHR = (callback: () => void) => {
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();

  // Call the XMLHttpRequest onload event to get started
  xhr.onload = (e) => {
    // Log for debugging
    console.log(`In onload - HTTP Status Code = ${(e.target as XMLHttpRequest).status}`);


    // Load in json
    const json = JSON.parse(xhr.responseText);

    // Grab the json data for our arrays
    trackLocations = json['Track Locations']; 
    trackNames = json['Tracks'];

    // Get our truth table for our params, which holds the values for our checkboxes
    const paramsTruthTable = json['Params Truth Table'];

    paramsTruthTable.forEach((string: string) => {
      // Split the strings by ':' to separate parameter name and value
      const [paramName, paramValue] = string.split(':');

      // Trim whitespaces from parameter name and value
      const trimmedParamName = paramName.trim();
      const trimmedParamValue = paramValue.trim();

      // Convert each trimmed param value (by name, which is accurate with the json) to its true/false value
      (drawParams as any)[trimmedParamName] = (trimmedParamValue === 'true' || trimmedParamValue === 'false') ? (trimmedParamValue === 'true') : trimmedParamValue;
    });

    // Set other vars equal to JSON values
    startingVisualizerSelection = json['Starting Visualizer State'];
    title = json['Title'];

    // Set the checked property of checkboxes based on drawParams values
    (document.querySelector("#cb-noise") as HTMLInputElement).checked = drawParams.showNoise as boolean;
    (document.querySelector("#cb-bars") as HTMLInputElement).checked = drawParams.showBars as boolean;
    (document.querySelector("#cb-circles") as HTMLInputElement).checked = drawParams.showCircles as boolean;
    (document.querySelector("#cb-triangles") as HTMLInputElement).checked = drawParams.showTriangles as boolean;
    (document.querySelector("#cb-squares") as HTMLInputElement).checked = drawParams.showSquares as boolean;
    (document.querySelector("#cb-gradient") as HTMLInputElement).checked = drawParams.showGradient as boolean;
    (document.querySelector("#cb-invert") as HTMLInputElement).checked = drawParams.showInvert as boolean;
    (document.querySelector("#cb-emboss") as HTMLInputElement).checked = drawParams.showEmboss as boolean;
    (document.querySelector("#cb-lowshelf") as HTMLInputElement).checked = drawParams.showLowshelf as boolean;
    (document.querySelector("#cb-highshelf") as HTMLInputElement).checked = drawParams.showHighshelf as boolean;

    // Execute the callback function
    callback();
  };

  // More debugging and necessary xml code
  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${(e.target as XMLHttpRequest).status}`);

  xhr.open("GET", url);
  xhr.send();
};

/* SetupUI: sets up the UI elements for our Canvas. 
 * Params: canvasElement: the HTML canvas element
 * NOTE: any commenting with a letter (e.g., // A) is courtesy of Andrew Wheeland
 */
const setupUI = (canvasElement: HTMLCanvasElement | null) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button") as HTMLButtonElement;

  // Add .onclick event to  fullscreen button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");

    // First use of an imported method, utils.goFullScreen makes the screen go... full
    utils.goFullscreen(canvasElement!);
  };

  // B - hookup for play button
  const playButton = document.querySelector("#play-button") as HTMLButtonElement;

  // Add .onclick event to play button
  playButton.onclick = e => {

    // Check if context is in suspended state (Autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }

    // Debug information
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

    // If track is currently paused, play it
    if (playButton.dataset.playing == "no") {

      audio.playCurrentSound();

      // CSS will set state to "Pause"
      playButton.dataset.playing = "yes";

      // Else if track IS playing, pause it!
    } else {
      audio.pauseCurrentSound();

      // CSS will set state to "Play"
      playButton.dataset.playing = "no";
    }
  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volume-slider") as HTMLInputElement;
  let volumeLabel = document.querySelector("#volume-label");

    // Add .oninput event to slider
  volumeSlider.oninput = e => {
    // Set the gain
    audio.setVolume(Number((e.target as HTMLInputElement).value));
    // Update value of label to match that of slider
    volumeLabel.innerHTML = Math.round((Number((e.target as HTMLInputElement).value) / 2 * 100)).toString();

  };
  // Set the value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#track-select") as HTMLSelectElement;
  // Add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile((e.target as HTMLSelectElement).value);
    // Pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // Hookup the visualizer selector, which in short changes the visuals based on how the data from audio is read
  let visualizerSelect = document.querySelector("#visualizer-select") as HTMLSelectElement;

  // Set the onclick to change the value of the selectFrequency
  visualizerSelect.onchange = e => {
    drawParams.selectFrequency = !drawParams.selectFrequency;
  };

  // E - setup checkboxes
  // Set onclicks of our checkboxes to modify values of drawParams object
  (document.querySelector("#cb-bars") as HTMLInputElement).onclick = e => {
    drawParams.showBars = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-circles") as HTMLInputElement).onclick = e => {
    drawParams.showCircles = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-triangles") as HTMLInputElement).onclick = e => {
    drawParams.showTriangles = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-squares") as HTMLInputElement).onclick = e => {
    drawParams.showSquares = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-gradient") as HTMLInputElement).onclick = e => {
    drawParams.showGradient = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-noise") as HTMLInputElement).onclick = e => {
    drawParams.showNoise = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-emboss") as HTMLInputElement).onclick = e => {
    drawParams.showEmboss = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-invert") as HTMLInputElement).onclick = e => {
    drawParams.showInvert = (e.target as HTMLInputElement).checked;
  };

  (document.querySelector("#cb-lowshelf") as HTMLInputElement).onclick = e => {
    drawParams.showLowshelf = (e.target as HTMLInputElement).checked;
    audio.toggleLowshelf(drawParams.showLowshelf);
  };

  (document.querySelector("#cb-highshelf") as HTMLInputElement).onclick = e => {
    drawParams.showHighshelf = (e.target as HTMLInputElement).checked;
    audio.toggleHighshelf(drawParams.showHighshelf);
  };
}; 

/* Loop: this function calls a continuous loop that is responsible for our visualizer continuing to update
 * Note that the setTimeout function prevents the canvas from updating more than 60 FPS.
 * canvas.draw() is an external function that starts the drawing process, and takes in all those params
 * we grabbed from the JSON file
 */
const loop = () => {
  setTimeout(loop);
  canvas.draw(drawParams);
};

init();
