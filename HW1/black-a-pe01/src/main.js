import { randomElement } from "./utils.js";

let words1 = [];
let words2 = [];
let words3 = [];

//returns a random word from the array
const getRandomBabble = (array) => {

    //random
    //const randomBabble = Math.floor(Math.random() * array.length);
    const randomBabble = randomElement(array);

    return array[randomBabble];

}

//modifies the html element "output"
const outputTechnoBabble = (numBabble) => {

    let babbleCount = 0;
    let output = "";

    while (babbleCount < numBabble) {

        output += `${getRandomBabble(words1)} ${getRandomBabble(words2)} ${getRandomBabble(words3)} \n`
        babbleCount++;

    }

    document.querySelector("#output").innerText = output;

}

const loadBabbleData = (callback, callbackParam) => {

    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {

        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        const text = e.target.responseText;
        const json = JSON.parse(text);

        words1 = json.words1;
        words2 = json.words2;
        words3 = json.words3;

        callback(callbackParam);


    };

    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();

}


const init = () => {

    loadBabbleData(outputTechnoBabble, 1);

}

init();

export {outputTechnoBabble};