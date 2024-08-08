import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCXyBNR6V1nHEuG2aUg-DTgQZCELSMjgak",
  authDomain: "run-explorer.firebaseapp.com",
  projectId: "run-explorer",
  storageBucket: "run-explorer.appspot.com",
  messagingSenderId: "1044623552559",
  appId: "1:1044623552559:web:707defaca0bde8b8efd6da",
  measurementId: "G-MZ2B7W6EMF",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

import {  getAuth,  GoogleAuthProvider,  signInWithPopup,  onAuthStateChanged,} from "firebase/auth";
import { getFirestore,} from "firebase/firestore";
export const auth = getAuth(firebase);
export const firestore = getFirestore(firebase);

const provider = new GoogleAuthProvider();

export const GoogleLogin = ()=> {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      //console.log(user);
      // location.href = "../strava.html"
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

//check auth state and navigate page
export function checkAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        resolve(user);
        // if (Location.href == " ") location.href = "../strava.html";
      } else {
        console.log('logged out');
        resolve("no user");
        // location.href = "../";
      }
      unsubscribe();
    });
  });
}

export function logOut() {
  auth.signOut();
}

