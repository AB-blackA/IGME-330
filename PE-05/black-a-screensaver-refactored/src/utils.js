/* Author: Andrew Black, Since 2/6/24
 * Purpose: utils.js consists of helper functions for randomization of color (for Canvas shapes) and numbers (mostly ints)
 */

/* Method: getRandomColor
 * Purpose: return a randomized rbga value for our shapes to use
 * Returns: string
 */
export const getRandomColor = () => {


    /* Method: getByte
     * Purpose: returns a random byte value (between 55 and 255)
     * Returns: byte
     */
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }


    //return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
}


/* Method: getRandomInt
* Purpose: return a randomized int 
* Params: min - int, max - int
* Returns: int
*/
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}