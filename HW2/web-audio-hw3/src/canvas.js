/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

class Triangle {

    x;
    y;
    length = 10;

    setStartPoint(canvasWidth, canvasHeight) {
        this.x = canvasWidth * 1 / 5;
        this.y = canvasHeight * 2 / 5;
    }

    update(byteData, fillStyle) {

        byteData *= 3 / 10;

        this.length = 10 + byteData;
        this.draw(fillStyle);
    }

    draw(fillStyle) {

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.moveTo(this.x, this.y + this.length);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.lineTo(this.x - this.length, this.y);
        ctx.fill();
        ctx.restore();

    }
}

class Square {

    x;
    y;
    length = 10;

    setStartPoint(canvasWidth, canvasHeight) {
        this.x = canvasWidth * 4 / 5;
        this.y = canvasHeight * 2 / 5;
    }

    update(byteData, fillStyle) {


        byteData *= 3 / 10;

        this.length = byteData;
        this.draw(fillStyle);

    }

    draw(fillStyle) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.rect(this.x - this.length / 2, this.y - this.length / 2, this.length, this.length);
        ctx.fill();
        ctx.restore();
    }

}



let canvasTriangle = new Triangle();
let canvasSquare = new Square();

const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: .8, color: "black" }, { percent: 1, color: "white" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    //send our canvas data to our classes
    canvasTriangle.setStartPoint(canvasWidth, canvasHeight);
    canvasSquare.setStartPoint(canvasWidth, canvasHeight);
};

const draw = (params = {}) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 

    //check if the user has selected to visualize via frequency. if not, they MUST have chosen wavelength
    //so get data via one of those two 
    if (params.selectFrequency) {
        analyserNode.getByteFrequencyData(audioData);
    } else {
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }
    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    
    //call our objects to update them with the byte data 

    for (let i = 0; i < audioData.length; i++) {

        let fillStyle = `rgba(${i}, ${i}, ${i}, 0.5)`;
        canvasTriangle.update(audioData[i], fillStyle);
        canvasSquare.update(audioData[i], fillStyle);
    }
    // 4 - draw bars

    if (params.showLowshelf) {

        let barSpacing = 1;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 400;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(227, 174, 50,0.50)';
        ctx.strokeStyle = 'rgba(0,0,0,0.50)';
        //loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();



    }

    if (params.showHighshelf) {

        let barSpacing = 6;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 400;
        let topSpacing = -600;

        ctx.save();
        ctx.fillStyle = 'rgba(200,255,255,0.50)';
        ctx.strokeStyle = 'rgba(0,0,0,0.50)';
        //loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();


    }
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.50)';
        ctx.strokeStyle = 'rgba(0,0,0,0.50)';
        //loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = .5;
        for (let i = 0; i < audioData.length; i++) {

            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            // redish circles
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // blueish circles, bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // yellow-ish circles, smaller
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //restore path
            ctx.restore();
        }
        ctx.restore();
    }




    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;


    // emboss?
    if (params.showEmboss) {
        //note we are stepping through *each* sub-pixel
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; //skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {



        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < .05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel

            // zero out the red and green and blue channels
            // data[i] = data[i + 1] = data[i + 2] = 0;
            // data[i] = 255;// make the red channel 100% red

            // per assignment, changing the "noise" to be a different color than red
            // currently shows yellow
            // zero out the red and green and blue channels
            data[i] = data[i + 1] = data[i + 2] = 0;

            //create a yellow color for the noise
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 205;
        } // end if

        // invert?
        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red; //set red
            data[i + 1] = 255 - green; // set green
            data[i + 2] = 255 - blue //set blue
            //data[i+3] is the alpha, but we're leaving that alone
        }


    } // end for


    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
};

export { setupCanvas, draw };
