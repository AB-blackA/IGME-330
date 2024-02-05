/* Method: randomElement
 * Params: array (any array)
 * Returns: int (index of random array element)
 * Purpose: returns a random index from a passed array
 */

export const randomElement = (array) => { 
    
    return Math.floor(Math.random() * array.length);
}