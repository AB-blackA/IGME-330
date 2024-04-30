/* Author: Professor Andrew Wheeland (note from student Andrew Black, I just followed his tutorial!)
 * Since: unknown, utilized by Andrew Black 4/24/24
 * File: ajax.js
 * Purpose: ajax.js is responsible for parsing json data relating to geomap data.
 * NOTE: Nearly all comments by Professor Wheeland himself - Andrew Black's are denoted 
 */

/* downloadFile: sets an XML request to parse data from a passed in url. For this application, it's geomap data
 * params: url - the url in which to download the data from to be parsed. callbackRef - a callback that utilizes the parsed json string from the url
 * NOTE: this commented block was written by Andrew Black 
*/


export const downloadFile = (url, callbackRef) => {
	const xhr = new XMLHttpRequest();
		// 1. set `onerror` handler
	xhr.onerror = (e) => console.log("error");
	
	// 2. set `onload` handler
	xhr.onload = (e) => {
		const headers = e.target.getAllResponseHeaders();
		const jsonString = e.target.response;
		console.log(`headers = ${headers}`);
		console.log(`jsonString = ${jsonString}`);
		callbackRef(jsonString);
	}; // end xhr.onload
	
	// 3. open the connection using the HTTP GET method
	xhr.open("GET",url);
	
	// 4. we could send request headers here if we wanted to
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
	
	// 5. finally, send the request
	xhr.send();
};