/* Author: Professor Andrew Wheeland (note from student Andrew Black, I just followed his tutorial!)
 * Since: unknown, utilized by Andrew Black 4/24/24
 * File: map.js
 * Purpose: map.js is responsible for a myriad of functions related to the map displayed on the main html page.
 * This includes defining the data for our parks and setting some pop-up boxes with information about the park
 * NOTE: most comments are by Professor Wheeland himself. Any comments by Andrew Black will be denoted with a ~AB at the end
 */

// I. Variables & constants
const accessToken = 'pk.eyJ1IjoiYWNiNzA4NiIsImEiOiJjbHVrMDRyejIwM2hsMmttbDM0dzNhZjAyIn0.Apls0ta6B4m6t86DuSGTxQ';
let map;

// An example of how our GeoJSON is formatted
// This will be replaced by the GeoJSON loaded from parks.geojson
let geojson = {
	type: "FeatureCollection",
	features: [{
		"type": "Feature",
		"id": "p79",
		"properties": {
			"title": "Letchworth State Park",
			"description": "Letchworth State Park, renowned as the \"Grand Canyon of the East,\".",
			"url": "https://parks.ny.gov/parks/letchworth",
			"address": "1 Letchworth State Park, Castile, NY 14427",
			"phone": "(585) 493-3600"
		},
		"geometry": {
			"coordinates": [
				-78.051170,
				42.570148
			],
			"type": "Point"
		}
	}]
};

// II. "private" - will not be exported

/* initMap: creates the map from Mapbox, to be used on index.html
 * Params: center: data defining the center of the map, or the "load-in point"
 * ~AB
 */
const initMap = (center) => {
	mapboxgl.accessToken = accessToken;

	//creation of the map. note that container is specific to a map object and the zoom was defined from the tutorial
	//~AB
	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11",
		center: center,
		zoom: 5.2
	});
	map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
	

	// test
	/* const clickHandler = (id) => alert(`${id} was clicked!`);
	addMarker(geojson.features[0], "poi", clickHandler); */
};

/* addMarker: creates an interactible marker for each Park we have defined, and adds it to the map (via a div)
 * Params: feature - feature is defined in the json, it's essentially a point of data relating to a park.
 * className - css defining features of the marker; clickHandler - the defined onclick event which occurs upon clicking the marker
 * ~AB
 */
const addMarker = (feature, className, clickHandler) => {

	// A. Create a map marker using feature (i.e., "Park") data
	// - the marker is a <div>
	// - <div> className will be 'poi' - see default-styles.css to see the details
	// - note that we give the <div> the idea of the "feature"

	const el = document.createElement('div');
	el.className = className;
	el.id = feature.id;

	// B. This is the HTML for the popup
	const html = `
	<b>${feature.properties.title}</b>
	<p>${feature.properties.address}</p>
	<p><strong>Phone: </strong>${feature.properties.phone}</p>
	`;

	// C. Make the marker, add a popup, and add to map
	// https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
	// https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
	const marker = new mapboxgl.Marker(el)
		.setLngLat(feature.geometry.coordinates)
		.setPopup(new mapboxgl.Popup({ offset: 10 })
		.setHTML(html))
		.addTo(map);

	// D. Call this method when marker is clicked on
	el.addEventListener("click", () => clickHandler(marker._element.id));

	return marker; // Return the marker for further manipulation if needed
}

// III. "public" - will be exported

/* flyTo: function that changes the viewpoint of the map to the passed in parameter
 * Params: center - the point to "zoom in on" (DEFAULT: 0,0)
 * ~AB
 */
const flyTo = (center = [0, 0]) => {
	//https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto
	map.flyTo({ center: center });
};

/* setZoomLevel: function that changes the zoom of the currently defined point of view on the map
 * Params: value - the defined zoom in value (DEFAULT: 0)
 * ~AB
 */
const setZoomLevel = (value = 0) => {
	// https://docs.mapbox.com/help/glossary/zoom-level/
	map.setZoom(value);
};

/* setZoomLevel: function that changes the pitch and bearing (angle, essentially) of the currently defined point of view on the map
 * Params: pitch - the verticle angle of the map view (DEFAULT: 0); bearing - the horizontal angle of the map view (DEFAULT: 0)
 * ~AB
 */
const setPitchAndBearing = (pitch = 0, bearing = 0) => {
	// https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
	// https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
	map.setPitch(pitch);
	map.setBearing(bearing);
};

/* setZoomLevel: helper function that calls addMarker - to be called when main.js is ready to utilize it
 * Params: json - the json data that contains park information; clickHandler - the onclick event that each marker will utilize
 * ~AB
 */
const addMarkersToMap = (json, clickHandler) => {
	geojson = json; // replace the default hard-coded JSON data

	// loop through the features array and for each one add a marker to the map
	for (const feature of geojson.features) {
		addMarker(feature, "poi", clickHandler);
	}
}


export { initMap, flyTo, setZoomLevel, setPitchAndBearing, addMarkersToMap };
