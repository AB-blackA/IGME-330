/* Author: Andrew Black, Professor Andrew Wheeland (who supplied a tutorial to get started)
 * Since: unknown, utilized and modified by Andrew Black 4/24/24
 * File: main.js
 * Purpose: main.js is responsible for managing various functions accross multiple files (see: imports) to create a running
 * web page that displays data regarding NYS Parks and supplies user friendly features for learning more about said parks.
 * Utilizes localstorage and FireBase for data.
 * NOTE: Comments made by Andrew Black denoted with a ~AB, rest made by Professor Wheeland in his tutorials
 */

import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";
import * as parkview from "./park-viewer.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];

// variable to hold json data related to the parks
//~AB
let geojson;

// an array that holds the id (tracable information) of favorited parks made by the user. This array is filled with localstorage later on in the application
//~AB
let favoriteIds = [];

//hold the current id of selected park, should it be favorited
//~AB
let selectedParkId = null;

// favorite/unfavorite button references
//~AB
let favoriteButton;
let unfavoriteButton;


// II. Functions

/* setupUI: method creates useful UI functionality regarding the geomap, that is loaded in via our init function
 * All functionality is mostly related to buttons defined in index.html. called from init
 *~AB
 */
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	}

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	}

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	}

	//find buttons relating to favorite/unfavorite and set some properties and onclicks
	//~AB
	favoriteButton = document.querySelector("#btn-fav");
	unfavoriteButton = document.querySelector("#btn-unfav");
	favoriteButton.disabled = true;
	unfavoriteButton.disabled = true;

	//onclicks related to adding/removing from favoriteIds array, and updating the UI to reflect (via refreshFavorites)
	//~AB
	favoriteButton.addEventListener("click", () => {

		//add to array
		//~AB
		addFavorite(selectedParkId);

		//update UI to reflect
		//~AB
		refreshFavorites();

		//add to storage
		//~AB
		storage.writeToLocalStorage("favoriteIds", favoriteIds);

	});

	unfavoriteButton.addEventListener("click", () => {

		//remove from array
		//~AB
		removeFavorite(selectedParkId);

		refreshFavorites();


		//"add" to storage (rewrites entire array to localstorage, thus "erasing" the park)
		//~AB
		storage.writeToLocalStorage("favoriteIds", favoriteIds);


	})

	//as this function is called from init, it's a good time to refresh our favorite parks for our users.
	//i.e., load in from localstorage and display necessary data
	//~AB
	refreshFavorites();

}

/* refreshFavorites: this function updates the favorites-list in index.html to contain clickable refrences to favorited
 * parks by the user. It's "refreshed" whenever favorites is updated or the page is loaded in
 *~AB
 */
const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";

	//recall favoriteIds is an array - it stores park id's
	//~AB
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
}

/* createFavoriteElement: this function creates an html element that holds data related to a park, any that are favorited by the
 * user utilizes this function. By create, we mean make a clickable panel with an onclick feature that is easily accessible 
 * regardless of where the user is on the map.
 * Params: id - a tracable id of the park that is favorited, which can be utilizes to gather more information via json data
 * Returns: elementNode - HTML object created
 * ~AB
 */
const createFavoriteElement = (id) => {

	//a feature is data in the json, calling this function loads in the entire feature by referencing the id
	//feature then contains information such as park name, address, etc.
	//~AB
	const feature = getFeatureById(id);

	//create a new element
	//~AB
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;

	//add an onclick. Clicking the created panel zooms you in on the park, then also calls that park's markers (see: map.js, addMarker)
	//to display the pop up (which holds information about the park)
	//~AB
	a.onclick = () => {
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
		document.getElementById(id).click();
	};

	//set panel html and text
	//~AB
	a.innerHTML = `
    <span class="panel-icon">
        <i class="fas fa-map-pin"></i>
    </span>
    ${feature.properties.title}
    `;

	return a;
};

/* addFavorite: adds the currently selected park id to favorites, in both the proper place in index.html and firebase
 * Params: id - the id of the park, as defined in the json data
 * ~AB
 */
const addFavorite = (id) => {

	//if statement ensures id isn't null (if page just loaded in, for example) and our favoriteIds array doesn't already contain it
	//~AB
	if (id !== null && !favoriteIds.includes(id)) {

		//add to array, and write the data to firebase (see: park-viewer.js)
		//~AB
		favoriteIds.push(id);

		//writeFavNameData(name, id, incrementer)
		parkview.writeFavNameData(getNameById(id), id, 1);
	}


	//reload the details, which affects the favorite/unfavorite panels
	//~AB
	showFeatureDetails(id);
}

/* removeFavorite: removes the currently selected park id to favorites, in both the proper place in index.html and firebase
 * Params: id - the id of the park, as defined in the json data
 * ~AB
 */
const removeFavorite = (id) => {

	//if statement ensures id isn't null (if page just loaded in, for example) and our favoriteIds array already contains it
	//~AB
	if (id !== null && favoriteIds.includes(id)) {

		//find our favorites in the index and remove it.
		//~AB
		const index = favoriteIds.indexOf(id);
		if (index !== -1) {
			favoriteIds.splice(index, 1);
		}

		//update firebase
		//~AB
		//writeFavNameData(name, id, incrementer)
		parkview.writeFavNameData(getNameById(id), id, -1);
	}


	//reload the details, which affects the favorite/unfavorite panels
	showFeatureDetails(id);
}

/* getNameById: returns the name of the park via the feature properties in the json file, by referencing the id of the park in question
 * returns: string - name of the park
 * ~AB
*/
const getNameById = (id) => {

	const park = geojson.features.find(feature => feature.id === id);
	return park.properties.title;
}

/* getNameById: returns the feature of the park in the json as referenced by the park id
 * returns: array - containing multiple feature objects related to park data
 * ~AB
*/
const getFeatureById = (id) => {

	return geojson.features.find(feature => feature.id == id);
}

/* showFeatureDetails: displays data to details sections of index.html regarding the feature property of a specific park, referenced in the json by id
 * always shows the currently selected park via the marker last clicked by the user
 * Params: id - the id of the park in which the feature is referenced by
 * ~AB
 */
const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	selectedParkId = id;

	//grab the entire feature array and utilize it to create text in index.html in the details' panels
	//~AB
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `
		<p><strong>Address: </strong>${feature.properties.address}</p>
		<p><strong>Phone: </strong>${feature.properties.phone}</p>
		<p><strong>Website: </strong><a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
		`;
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

	//then, based on whether or not the current park is favorited/unfavorited by the user, disable the corresponding buttons
	//so they can't "double down" on their favorites or unfavorite something that isn't favorited
	//~AB
	if (isFavorite(id)) {
		favoriteButton.disabled = true;
		unfavoriteButton.disabled = false;
	} else {
		unfavoriteButton.disabled = true;
		favoriteButton.disabled = false;
	}
}

/* isFavorite: method that determines if the favoriteIds array contains the id of the currently selected park
 * Params: id - id of the current park
 * Returns: bool - status of inclusion
 * ~AB
 */
const isFavorite = (id) => {

	return favoriteIds.includes(id);

}

/* init: function that is first called to perform mandatory actions for the application to run smoothly. This includes
 * checking up on localstorage and initalization favoriteIds, setting up the mapbox, and setting up UI functionality
 * ~AB
 */
const init = () => {

	favoriteIds = storage.readFromLocalStorage("favoriteIds");

	//failsafe if json doesn't work or somehow we are saving things as not an array
	//in localstorage
	if (!Array.isArray(favoriteIds)) {
		favoriteIds = [];
	}

	console.log(favoriteIds);

	//initaite the map with a view of NYS
	//~AB
	map.initMap(lnglatNYS);

	//download the json data utilizing functionality from ajax.js
	//"str" is a callback function that utilizes the parsed json to utilize more functionality in map.js (Adding markers)
	//then, setup UI for index.html
	//~AB
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

init();
