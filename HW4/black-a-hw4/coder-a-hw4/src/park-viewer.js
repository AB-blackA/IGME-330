

// TODO: ADD YOUR imports and Firebase setup code HERE
// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment, get, update } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

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

// This is the "harder" way and not necessary for incrementing a counter
// But this code is useful if you want to `get()` a value just once
// and/or do "batch" updates of non-numeric values with `update()`
const writeFavNameData = (name, parkId, incrementer) => {
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
            const totalFavorites = favorite.favorites + incrementer;
            const newData = {
                name,
                id: parkId,
                favorites: totalFavorites
            };
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
    }).catch((error) => {
        console.error(error);
    });
}

const favoritesChanged = (snapshot) => {
    // TODO: clear #favoritesList
    try {
        favoritesList.innerHTML = "";
        snapshot.forEach(fav => {
            const childKey = fav.key;
            const childData = fav.val();
            console.log(childKey, childData);
            if (childData.favorites != 0) {
                // TODO: update #favoritesList
                favoritesList.innerHTML += `<li><b>${childData.name}: ID ${childData.id}</b> - Favorites: ${childData.favorites}</li>`;
            }
        });
    }catch (TypeError){
        console.log("park-viewer loaded in");
    }
};

const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');
    onValue(favoritesRef, favoritesChanged);
};

init();

export { writeFavNameData };
