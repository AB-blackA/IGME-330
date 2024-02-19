import {getRandomColor, getRandomInt} from "./utils.js";
import {drawRectangle, drawArc, drawLine} from "./canvas-utils.js";

/* Author: Andrew Black, Since 2/6/24
 * Purpose: main.js is central js file for creation of randomized shapes in JS's Canvas displayed in a webpage 
 */

//canvas variables to be set later
let canvas;
let ctx;

//var that keeps track of pause state for the creation of shapes
let paused = false;


//vars that allows user to pause creation of shapes
let createRectangles = true;
let createArcs = true;
let createLines = true;

//canvas dimension limit, aka, floor
const floor = 0;


/* Method: Init
 * Purpose: Starter function that calls necessary data/instantiations for program to function
 * mostly in this case loads the canvas and creates default image, as well as check some default states of the html 
 */
const init = () => {

    //check page has loaded in
    console.log("page loaded!");


    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");


    // B - the `ctx` variable points at a "2D drawing context". ctx = context
    ctx = canvas.getContext("2d");


    //noticed reloading the pages sometimes left check boxes out of sync with starting state, so these lines
    //of code fixes that to always default it to checked
    document.querySelector("#cb-rectangles").checked = true;
    document.querySelector("#cb-arcs").checked = true;
    document.querySelector("#cb-lines").checked = true;


    /* Method: drawDefaultImage
     * Purpose: calls helper methods to create a default image before the creation of random shapes
     * In this instance, the default image is a flag like shape with a happy face in the middle
     * Creation of shapes not necessarily arbitrary (created via guide), but mostly unrelated to main program. i.e., dont worry about the order
     * NOTE: there's plenty of magic numbers here, but again, the creation of the default image is pretty arbitrary. 
     */
    const drawDefaultImage = () => {

        //drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black")
        drawRectangle(ctx, 20, 20, 600, 440, "red", undefined, undefined);
        drawRectangle(ctx, 120, 120, 400, 300, "red", 3, "blue");


        //drawLine(ctx, x1, y1, x2, y2, fillStyle = "black", lineWidth = 1, strokeStyle = "black")
        drawLine(ctx, 20, 20, 620, 460, 20, "green");
        drawLine(ctx, 620, 20, 20, 460, 20, "green");

        //circle, to be a happy face (:))


        //drawArc(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black",startAngle = 0, endAngle = Math.PI * 2)
        drawArc(ctx, 320, 240, 50, "yellow", 5, "magenta", 0, Math.PI * 2);
        drawArc(ctx, 320, 240, 30, "pink", 5, "red", 0, Math.PI);
        drawArc(ctx, 300, 220, 10, "white", 3, "brown", 0, Math.PI * 2);
        drawArc(ctx, 340, 220, 10, "white", 3, "brown", 0, Math.PI * 2);

        drawLine(ctx, 20, 180, 620, 180, 20, "pink");
    }



    //draw the default images (from previous iterations of this assignment)
    drawDefaultImage();

    //call setupUI helper function
    setupUI();

    //drawing random rectangles
    update();

}


/* Method: update
 * Purpose: "loop" function that continiously calls itself to call helper functions to create shapes adnaseum 
 */
const update = () => {


    //check if paused; if so, don't draw rects.
    //this solves the "Speed up issue" also
    if (!paused) {

        //based on variables set by checkboxes in html, determine which shapes to draw
        if (createRectangles) drawRandomRect();
        if (createArcs) drawRandomArc();
        if (createLines) drawRandomLine();

    }
    //continuosly request this method to be called so we get out confetti of shapes 
    requestAnimationFrame(update);


}


/* Method: drawRandomRect
 * Purpose: creates random rectangles around an area. uses prior functions getRandomInt and getRandomColor to determine placement and color of rectangle
 * Note that this method really just calls the "drawRectangle" method with randomized parameters and doesn't do the "hard work"
 */
const drawRandomRect = () => {

    //values for randomized min/maxes of position and stroke
    const minXY = 10;
    const maxXY = 90;
    const minStroke = 2;
    const maxStroke = 12;

    // params: drawRectangle(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black")
    //cut y directions in half as fulfillment to part 3 of assignment
    drawRectangle(ctx, getRandomInt(floor, canvas.width / 2), getRandomInt(floor, canvas.height / 2), getRandomInt(minXY, maxXY), getRandomInt(minXY, maxXY), getRandomColor(), getRandomInt(minStroke, maxStroke), getRandomColor());


}

/* Method: drawRandomArc
 * Purpose: creates random arcs (circles only in this case) around an area. uses prior functions getRandomInt and getRandomColor to determine placement and color of arc
 * Note that this method really just calls the "drawArc" method with randomized parameters and doesn't do the "hard work"
 */
const drawRandomArc = () => {

    //variables for creation of radius, stroke, and end angle
    //start angle always 0 for consistency
    //end angle ensures creation of circle and not an unclosed circle
    const startAngle = 0;
    const endAngle = 2;
    const minRadius = 10;
    const maxRadius = 70;
    const minStroke = 2;
    const maxStroke = 12;

    //drawArc(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black",startAngle = 0, endAngle = Math.PI * 2)
    drawArc(ctx, getRandomInt(floor, canvas.width), getRandomInt(floor, canvas.height), getRandomInt(minRadius, maxRadius), getRandomColor(), getRandomInt(minStroke, maxStroke), getRandomColor(), startAngle, endAngle * Math.PI);
}

/* Method: drawRandomArc
 * Purpose: creates random lines around an area. uses prior functions getRandomInt and getRandomColor to determine placement and color of line
 * Note that this method really just calls the "drawLine" method with randomized parameters and doesn't do the "hard work"
 */
const drawRandomLine = () => {

    //const for min/max of stroke
    //note that the line placement is entirely based upon constraints of canvas height and width, so no extra consts here
    const minStroke = 1;
    const maxStroke = 12;

    //drawLine(ctx, x1, y1, x2, y2, fillStyle = "black", lineWidth = 1, strokeStyle = "black")
    drawLine(ctx, getRandomInt(floor, canvas.width), getRandomInt(floor, canvas.height), getRandomInt(floor, canvas.width), getRandomInt(floor, canvas.height), getRandomInt(minStroke, maxStroke), getRandomColor());
}


//utility helper events

/* Method: canvasClicked
 * Purpose: called when the user clicks the canvas, this method "spraypaints" circles to the canvas depending on mouse position
 * Params: e - mouse click event
 */
const canvasClicked = (e) => {

    //im not entirely sure how getBoundingClientRect works, but in essence it grabs the params of the rectangle (our canvas) our user clicked on
    let rect = e.target.getBoundingClientRect();

    //determines users placement of mouse position (x and y) based on the mouse click events x and y positions, minus the bounding rectangles position
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;

    //log for data testing
    console.log(mouseX, mouseY);

    //constants for limits of our arcs we're about to create
    const minXYVariance = -100;
    const maxXYVariance = 100;
    const minRadius = 20;
    const maxRadius = 70;

    //loop that calls drawArc ten times based on the x and y values we just found
    for (let i = 0; i < 10; i++) {

        //determine some random values for our arcs, then pass them into drawArc
        let x = getRandomInt(minXYVariance, maxXYVariance) + mouseX;
        let y = getRandomInt(minXYVariance, maxXYVariance) + mouseY;
        let radius = getRandomInt(minRadius, maxRadius);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, color);


    }
}


/* Method: setupUI
 * Purpose: sets some states of HTML elements necessary for the login in our program to work
 * of especial note, set our buttons to enable pause/play of drawing shapes via functions
 */
const setupUI = () => {

    //set onclicks of our play/pause buttons to change variables of paused bool
    document.querySelector("#btn-pause").onclick = function () {
        paused = true;
    };
    document.querySelector("#btn-play").onclick = function () {
        paused = false;
    };

    //set onclick function of canvas to pre-defined method canvasClicked
    canvas.onclick = canvasClicked;

    //set onlick of shape checkboxes to changed variables of our "createShape" bools
    document.querySelector("#cb-rectangles").onclick = function (e) {
        createRectangles = e.target.checked;
    }
    document.querySelector("#cb-arcs").onclick = function (e) {
        createArcs = e.target.checked;
    }
    document.querySelector("#cb-lines").onclick = function (e) {
        createLines = e.target.checked;
    }

    //set onclick of clear screen button to create a clear rectangle that covers the entire canvas.
    //notably, this doesn't really clear all previous shapes but gives the illusion of such
    document.querySelector("#btn-clear").onclick = function () {

        //first params, 0,0, are top left of our canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


init();