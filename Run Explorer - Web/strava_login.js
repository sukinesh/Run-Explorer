import { getFromDb, logOut, auth } from "./firebase.js";
import { getCookie } from "./cookie.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    loginWithCookie(user);
  } else {
    deleteCookies();
    location.href = "../";
  }
});

function loginWithCookie(user) {
  //check stava auth - if yes -> forward
  const access_token = getCookie("access_token");
  //check access token in cookies
  if (access_token != undefined && access_token != "") {
    console.log(access_token);
    location = "/map.html";
  } else {
    // get refresh token from Firestore and generate Access Token
    getFromDb(user.uid)
      .then((snap) => {
        console.log("reading refresh token");
        const refreshToken = snap.data().refresh_token;
        console.log(refreshToken);
        getNewAccessToken(refreshToken);
      })
      .catch((err) => {
        console.log(err);
        prepForStravaAuth();
      });
  }
}

function prepForStravaAuth() {
  document.getElementById(
    "auth_link"
  ).href = `https://www.strava.com/oauth/authorize?client_id=120778&redirect_uri=${location.href.substring(
    0,
    location.href.lastIndexOf("/")
  )}/auth_response.html&response_type=code&scope=activity:read_all`;
  const stravaButton = document.querySelector("#strava_connect_butn");
  stravaButton.disabled = false;
  stravaButton.querySelector("h4").innerText = "Connect with STRAVA";
  stravaButton.style.backgroundColor = "#f40";
}

function getNewAccessToken(refreshToken) {
  //get refresh token from firestore
  const url = `https://www.strava.com/oauth/token?client_id=120778&client_secret=dfff83ccf27dafd2adae6e59a8b234d2a03fc9c9&refresh_token=${refreshToken}&grant_type=refresh_token`;
  // console.log(url);
  fetch(url, { method: "POST" })
    .then((response) => {
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        prepForStravaAuth();
        throw new Error("Network response was not ok");
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      console.log(
        `access_token=${data.access_token};refresh_token=${data.refresh_token}`
      );
      document.cookie = `access_token=${
        data.access_token
      }; expires=${expirationDate.toUTCString()}; path=/`;
      // document.cookie = `refresh_token=${data.refresh_token}; expires=${expirationDate.toUTCString()}; path=/`
      location.reload();
    });
}

window.logOut = logOut;
