import { randomElement } from "./utils.js";

/* Author: Andrew Black, with helper code/tutorials from Professor Wheeland 
 * Since: 2/3/24
 * Purpose: JS file to work in tandem with HTML to allow output of "Techno Babble" to web page.
 */

/* arrays for holding words from technobabble json file */

let words1 = [];
let words2 = [];
let words3 = [];

/* Method: getRandomBabble
 * Params: array (takes an above word array)
 * Returns: string (from array param)
 * Purpose: returns an element from a word array (i.e., a string, or random babble)
 */
const getRandomBabble = (array) => {

    //random
    //const randomBabble = Math.floor(Math.random() * array.length);
    const randomBabble = randomElement(array);

    return array[randomBabble];

}

/* Method: outputTechnoBabble
 * Params: numBabble (int for how many lines of babble we want)
 * Purpose: modifies the html element "output" to display technobabble
 */
const outputTechnoBabble = (numBabble) => {

    //counter for upcoming loop
    let babbleCount = 0;

    //declare output string
    let output = "";

    //add to output until numBabble count is reached
    while (babbleCount < numBabble) {

        //babble added via the getRandomBabble function, passing in our array of words
        output += `${getRandomBabble(words1)} ${getRandomBabble(words2)} ${getRandomBabble(words3)} \n`
        babbleCount++;

    }

    document.querySelector("#output").innerText = output;

}

/* Method: loadBabbleData
 * Params: callback (callback function called upon running of this function), callbackParam (int needed for callback function to function)
 * callback function in this case is outputTechnoBabble, which allows our webpage to load with babble already displayed
 * Purpose: loads in the json data from our file and converts its data into string arrays, setting them to our empty arrays declared at top of page
 */
const loadBabbleData = (callback, callbackParam) => {

    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {

        //show if succesfull
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        const text = e.target.responseText;
        const json = JSON.parse(text);

        //load arrays. note that words1, 2, 3 are all also the name of our arrays in our json file
        words1 = json.words1;
        words2 = json.words2;
        words3 = json.words3;

        //callback displays an initial load of babble for the user
        callback(callbackParam);


    };

    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();

}

/* Method: init
 * Purpose: calls any initial functions for the program to work as intended
 * in this case, calls loadBabbleData to load in json data, and in turn loads in outputTechnoBabble to display some starting babble
 */
const init = () => {

    loadBabbleData(outputTechnoBabble, 1);

}

//call init to start
init();

//export function for HTML use (button.onclick calls this)
export {outputTechnoBabble};