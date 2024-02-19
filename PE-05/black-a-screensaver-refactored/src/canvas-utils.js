
/* Author: Andrew Black, Since 2/6/24
 * Purpose: canvas-utils.js consists of canvas helper functions that deal with the creation of shapes 
 */

//default values can be overwritten!

/* Method: drawRectangle
 * Purpose: draws rectangle to screen based on incoming params using the Canvas
 * Params: ctx - canvas.context, x - x position of rectangle, y - y position of rectangle, width - width of rectangle, height - height of rectangle
 * fillStyle - fill color of rectangle (default BLACK), lineWidth - width of the "outline" of rectangle (default NONE), strokeStyle - color of the "outline" (default BLACK)
 */
export const drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {


    //create a save for our style so nothing accidentally gets overwritten to a different shape upon creation
    ctx.save();

    //set fill style to default or param
    ctx.fillStyle = fillStyle;

    //begin path allows us to start the creation of the rect, then we create it. 
    ctx.beginPath();
    ctx.rect(x, y, width, height);

    //color the fill with the context's fillStyle
    ctx.fill();

    //set the lineWidth and strokeStyle, if there is an outline
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;

        //strokes the line and fills all in one!
        ctx.stroke();
    }

    //closePath "finalizes" the rectangle, adding it to canvas
    ctx.closePath();

    //restore our save
    ctx.restore();


}

/* Method: drawArc
 * Purpose: draws arcs to screen based on incoming params using the Canvas
 * Params: ctx - canvas.context, x - x position of arc, y - y position of arc, radius - radius of the arc
 * fillStyle - fill color of arc (default BLACK), lineWidth - width of the "outline" of rectangle (default NONE), strokeStyle - color of the "outline" (default BLACK)
 * startAngle - determines starting point of angle creation (default ZERO), endAngle - determines ending point of angle creation. In this program, it's eighter PI or 2*PI,
 * for a semi-circle or a full circle respectively
 */
export const drawArc = (ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2) => {


    //create a save for our style so nothing accidentally gets overwritten to a different shape upon creation
    ctx.save();

    //set fill style to default or param
    ctx.fillStyle = fillStyle;

    //begin path allows us to start the creation of the arc, then we create it. 
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);

    //color the fill with the context's fillStyle
    ctx.fill();

    //set the lineWidth and strokeStyle, if there is an outline
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }


    //closePath "finalizes" the rectangle, adding it to canvas
    ctx.closePath();

    //restore our save
    ctx.restore();


}

/* Method: drawLine
 * Purpose: draws lines to screen based on incoming params using the Canvas
 * Params: ctx - canvas.context, x1 - starting x position of line, y1 - starting y position of line,
 * x2 - ending x position of line, y2 - ending y position of line,
 * lineWidth - width of the "outline" of rectangle (default 1), strokeStyle - color of the line (default BLACK)
 */
export const drawLine = (ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") => {

    //create a save for our style so nothing accidentally gets overwritten to a different shape upon creation
    ctx.save();

    //begin path allows us to start the creation of the line
    ctx.beginPath();

    //define start of line
    ctx.moveTo(x1, y1);
    //define end point of line
    ctx.lineTo(x2, y2);

     //set the lineWidth and strokeStyle. there is no maybe for a line, it's always done
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();

    //closePath "finalizes" the rectangle, adding it to canvas
    ctx.closePath();

    //restore our save
    ctx.restore();
}