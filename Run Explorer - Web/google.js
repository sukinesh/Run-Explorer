import { GoogleLogin, checkAuth, logOut ,auth } from "./firebase.js";
import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
  
document.getElementById("signin_butn").addEventListener("click", GoogleLogin);

// const user = await checkAuth();
// console.log(user);
// if(user.uid != undefined)
//     location.href = "../strava.html"

// window.logOut = logOut;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    location.href = "../strava.html";
  } else {
    console.log('no user');
    // location.href = "../";
  }
});
