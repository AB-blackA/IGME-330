import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = [];

//hold the current id of selected park, should it be favorited
let selectedParkId = null;

// favorite/unfavorite button references
let favoriteButton;
let unfavoriteButton;


// II. Functions
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

	refreshFavorites();

}

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
}

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
		document.getElementById(id).click();

	};
	a.innerHTML = `
    <span class="panel-icon">
        <i class="fas fa-map-pin"></i>
    </span>
    ${feature.properties.title}
    `;

	return a;
};

const addFavorite = (id) => {

	if (id !== null && !favoriteIds.includes(id)) {
		favoriteIds.push(id);
		
	}


	//reload the details, which affects the favorite/unfavorite buttons
	showFeatureDetails(id);
}

const removeFavorite = (id) => {

	if (favoriteIds.includes(id)) {
		const index = favoriteIds.indexOf(id);
		if (index !== -1) {
			favoriteIds.splice(index, 1);
		}
	}


	//reload the details, which affects the favorite/unfavorite buttons
	showFeatureDetails(id);
}

const getNameById = (id) => {
	
    const park = geojson.features.find(feature => feature.id === id);
	return park.properties.title;
}

const getFeatureById = (id) => {

	return geojson.features.find(feature => feature.id == id);
}

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	selectedParkId = id;

	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `
		<p><strong>Address: </strong>${feature.properties.address}</p>
		<p><strong>Phone: </strong>${feature.properties.phone}</p>
		<p><strong>Website: </strong><a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
		`;
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

	if (isFavorite(id)) {
		favoriteButton.disabled = true;
		unfavoriteButton.disabled = false;
	} else {
		unfavoriteButton.disabled = true;
		favoriteButton.disabled = false;
	}
}

const isFavorite = (id) => {

	return favoriteIds.includes(id);

}

const init = () => {

	favoriteIds = storage.readFromLocalStorage("favoriteIds");

	//failsafe if json doesn't work or somehow we are saving things as not an array
	//in localstorage
	if (!Array.isArray(favoriteIds))  {
		favoriteIds = [];
	}

	console.log(favoriteIds);

	favoriteButton = document.querySelector("#btn-fav");
	unfavoriteButton = document.querySelector("#btn-unfav");
	favoriteButton.disabled = true;
	unfavoriteButton.disabled = true;

	favoriteButton.addEventListener("click", () => {

		//add to array
		addFavorite(selectedParkId);

		refreshFavorites();

		//add to storage
		storage.writeToLocalStorage("favoriteIds", favoriteIds);

	});

	unfavoriteButton.addEventListener("click", () => {

		removeFavorite(selectedParkId);

		refreshFavorites();


		//add to storage
		storage.writeToLocalStorage("favoriteIds", favoriteIds);


	})

	
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

init();
