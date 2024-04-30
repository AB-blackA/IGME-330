/* Author: Andrew Black, Professor Andrew Wheeland (who supplied a tutorial to get started)
 * Since: unknown, utilized and modified by Andrew Black 4/24/24
 * File: park-viewer.js
 * Purpose: park-viewer.js is responsible for handling Firebase data to be utilized for an "admin page" that contains data regarding favorited parks
 * by users. This includes interacting with favorite-parks-viwer.html (the admin site) to manage the ui to show the data, and writing/reading data
 * from firebase
 * NOTE: most comments are by Professor Wheeland himself. Any comments by Andrew Black will be denoted with a ~AB at the end
 */


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment, get, update } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";





// web app's Firebase configuration
//~AB

const firebaseConfig = {

    apiKey: "AIzaSyDH0sgwZlsUBhHf_KoopBaRzh4ajOBlulQ",

    authDomain: "park-favorites-884a9.firebaseapp.com",

    databaseURL: "https://park-favorites-884a9-default-rtdb.firebaseio.com",

    projectId: "park-favorites-884a9",

    storageBucket: "park-favorites-884a9.appspot.com",

    messagingSenderId: "397898364701",

    appId: "1:397898364701:web:4d54424431f4df2a7613f4"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

//

/* writeFavNameData: method writes data regarding favorited parks to firebase, then updates the UI to reflect
 * Params: name - the name of the park; id - the id of the park; incrementer - score in which to reflect the favorited position of the park
 * in short, a favorite is +1 score, an unfavorite is -1.
 * ~AB
 */

// This is the "harder" way and not necessary for incrementing a counter
// But this code is useful if you want to `get()` a value just once
// and/or do "batch" updates of non-numeric values with `update()`
const writeFavNameData = (name, parkId, incrementer) => {

    //get our database and references to our favorites data, then the name of the favorite
    //~AB
    const db = getDatabase();
    const favRef = ref(db, 'favorites/' + name);

    // does it already exist?
    // get will just look once
    get(favRef).then(snapshot => {
        let favorite;
        if (snapshot.exists()) {
            // if it's already in "favorites/" - update the number of favorites
            favorite = snapshot.val();
            console.log("found - current values=", favorite);

            //here's where the incrementer matters - if this was called in main.js by "adding" a favorite, it's +1.
            //otherwise that means it was unfavorited, so -1
            //~AB
            const totalFavorites = favorite.favorites + incrementer;

            //data as kept in firebase
            //~AB
            const newData = {
                name,
                id: parkId,
                favorites: totalFavorites
            };

            //update the data on firebase
            //~AB
            const updates = {};
            updates['favorites/' + name] = newData;
            update(ref(db), updates);
        } else {
            // if it does not exist, add to "mostFavorited/"
            console.log(`No favorite of key='${name}' found`);
            console.log("favorite=", favorite);
            set(favRef, {
                name,
                id: parkId,
                favorites: 1
            });
        }
        //catch for any errors, though I've never run into any at this specific point in the projecet 
        //knock on wood...
        //~AB
    }).catch((error) => {
        console.error(error);
    });
}
/* favoritesChanged: this method constantly checks for whether or not the favorites data in Firebase has been updated, in which case it
 * updates the ui of favorite-parks-viewer.html to reflect the changes
 * Params: snapshop - an object containing data from firebase regarding changes to our favorites branch of data
 * ~AB
 */
const favoritesChanged = (snapshot) => {
    
    //as this code will be parsed even if favorite-parks-viewer.html isn't live (as a result of coexisting with main.js in the same directory), this try/catch
    //is to stop any errors reminding us that favoritesList (an html element) does not exist within index.html
    //~AB
    try {
        //update the favoritesList to contain any favorited parks (i.e., more than 0 likes)
        //~AB
        favoritesList.innerHTML = "";

        //remember that the snapshot is basically an overview of data. the childKey is a reference to the childData, which holds information about the park
        //as stored on Firebase
        //~AB
        snapshot.forEach(fav => {
            const childKey = fav.key;
            const childData = fav.val();
            console.log(childKey, childData);
            if (childData.favorites != 0) {
                //update the UI
                //~AB
                favoritesList.innerHTML += `<li class="is-size-5"><b>${childData.name}: ID ${childData.id}</b> - Favorites: ${childData.favorites}</li>`;
            }
        });
    }catch (TypeError){
        console.log("park-viewer loaded in");
    }
};

/* init: function that gets necessary calls and components instantiated for the rest of parker-viewer.js to function with Firebase and favorite-parks-viewer.html
 * gets the database, the reference to our favorites branch, and calls onValue (see: imports in this file)
 * ~AB
 */
const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');

    //to speak briefly of onValue, this is basically an ever-observing function that will callback to favoritesChanged anytime there's an
    //update to the data on Firebase
    //~AB
    onValue(favoritesRef, favoritesChanged);
};

init();

export { writeFavNameData };
