/* Method: randomElement
 * Params: array (any array)
 * Purpose: return a random index of the array based on its size
 */

export function randomElement(array) { 
    
    return Math.floor(Math.random() * array.length);
}
