import { logOut, auth, SetToDB, UpdateToDB, firestore } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { getCookie, deleteCookies } from "./cookie.js";
import { map } from "./map.js";

document.getElementById("duck_icon").addEventListener("click", () => {
  document.getElementById("info_panel").classList.toggle("duck");
});

let locationArray = [];

const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector("#display_name").innerText = user.displayName;
    document.querySelector("#profile_icon").src = user.photoURL;

    const access_token = getCookie("access_token");
    // console.log(access_token);
    if (access_token != undefined && access_token != "")
      getDoc(doc(firestore, "users", user.uid)).then((result) => {
        const last_date = result.data().last_activity_date
          ? result.data().last_activity_date
          : new Date(0).getTime();
        console.log(last_date);
        getActivities(access_token, user,last_date);
      });
    else location = "../";
  } else {
    deleteCookies();
    location.href = "../";
  }
});

function getActivities(access_token, user, last_date) {
  let coordinatesArray = [],
    runsArray = [],
    activityArray = [];
  let last_activity_date = new Date(0);
  let Year = { count: 0, distance: 0, elevation: 0, time: 0 };
  let All = { count: 0, distance: 0, elevation: 0, time: 0 };
  // Handle the JSON data
  const activity_url = `https://www.strava.com/api/v3/athlete/activities?per_page=200&access_token=${access_token}`;
  fetch(activity_url)
    .then((response) => {
      if (!response.ok) {
        // getNewAccessToken();

        console.log("Network response was not ok - " + response.status);
        deleteCookies();
        location.href = "../strava.html";
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((activities) => {
      // console.log(activities);
      activities.forEach(async (activity, i) => {
        // console.log(i);

        const polyline = activity.map.summary_polyline;
        if (activity.type == "Run" && polyline != "") {
          if (new Date(activity.start_date) > last_activity_date)
            last_activity_date = new Date(activity.start_date);

          All.count++;
          All.distance += activity.distance;
          All.elevation += activity.total_elevation_gain;
          All.time += activity.elapsed_time;

          let date = new Date(activity.start_date);
          if (date.getFullYear() == new Date().getFullYear()) {
            Year.count++;
            Year.distance += activity.distance;
            Year.elevation += activity.total_elevation_gain;
            Year.time += activity.elapsed_time;
          }

          // console.log(activity);
          //   console.log(polyline);
          let coordinates = L.Polyline.fromEncoded(polyline).getLatLngs();
          L.polyline(coordinates, {
            color: "#ff4400",
            weight: 6.5,
            opacity: 0.6,
            lineJoin: "round",
          })
            .addTo(map)
            .bindPopup(
              `<div class="leaflet_popup">Title: ${
                activity.name
              }<br>Distance: ${(activity.distance / 1000).toFixed(1)}</div>`
            );

          // console.log(
          //   activity.start_date,
          //   new Date(last_date),
          //   new Date(activity.start_date) > new Date(last_date)
          // );

          if (new Date(activity.start_date) > new Date(last_date)) {
            const runData = {
              name: activity.name,
              distance: activity.distance,
              elapsed_time: activity.elapsed_time,
              start_date: activity.start_date,
              elevation: activity.total_elevation_gain,
              route: activity.map.summary_polyline,
              start_latlng: activity.start_latlng,
            };

            SetToDB(runData, `users/${user.uid}/runs`, `${activity.id}`);
          }

          coordinatesArray.push(coordinates.map((co) => [co.lat, co.lng]));
          runsArray.push([activity.name, coordinates.length]);

          // console.log(activity.name, activity.start_latlng);

          // const loc = await GetAddress(activity.start_latlng);
          if (activity.start_latlng.length)
            locationArray.push(activity.start_latlng);
          // console.log(loc);

          // if(coordinates.length > 0 )
          // {
          //     console.log(coordinates);
          //     console.log(coordinates[0].lat,coordinates[0].lng);
          //     map.setView([coordinates[0].lat,coordinates[0].lng],10);
          // }
        }
      });

      // console.log(last_activity_date);
      UpdateToDB(
        { last_activity_date: last_activity_date.getTime() },
        "users",
        user.uid
      );

      Year.distance = parseFloat((Year.distance / 1000).toFixed(2));
      All.distance = parseFloat((All.distance / 1000).toFixed(2));
      Year.elevation = parseFloat(Year.elevation.toFixed(2));
      All.elevation = parseFloat(All.elevation.toFixed(2));

      // console.log(Year,All);
      document.getElementById("total_runs").innerText = All.count;
      document.getElementById("total_distance").innerText = All.distance + "km";
      document.getElementById("total_elev").innerText = All.elevation + "m";
      document.getElementById("total_time").innerText =
        Math.floor(All.time / 3600) + ":" + Math.floor((All.time % 3600) / 60);

      document.getElementById("year_runs").innerText = Year.count;
      document.getElementById("year_distance").innerText = Year.distance + "km";
      document.getElementById("year_elev").innerText = Year.elevation + "m";
      document.getElementById("year_time").innerText =
        Math.floor(Year.time / 3600) +
        ":" +
        Math.floor((Year.time % 3600) / 60);
    })
    .then(() => {
      map.setView([coordinatesArray[0][0][0], coordinatesArray[0][0][1]], 10);
      //   calculateURD(coordinatesArray,runsArray);
      //   console.log(coordinatesArray, runsArray);
      document.querySelector(".page_blocker").classList.toggle("hidden");
      // console.log(locationArray);
      console.log("location length", locationArray.length);
    });
}

//open-close profile details
document.querySelectorAll(".panel_icon").forEach((icon) => {
  icon.addEventListener("click", async (click) => {
    //    click.stopImmediatePropagation();
    const id = click.target.id.split("_")[0];
    const panel = document.querySelector(`#${id.concat("_panel")}`);
    panel.classList.toggle("open");

    // if(id == 'profile')
    //     populateProfilePanel();
    // GetAddress([13.8976763,76.0365298]);

    //    const controller = new AbortController();
    //    document.addEventListener('click',(event)=>{
    //        event.stopImmediatePropagation();
    //        if(event.target.closest('.panel') == null)
    //            {
    //                panel.classList.remove('open');
    //                controller.abort();
    //            }

    //     },{signal:controller.signal});
  });
});

async function populateProfilePanel() {
  //calc States & countries
  let states = [],
    countries = [];
  const promises = locationArray.map(async (loc) => {
    const address = await GetAddress(loc);
    // console.log(address);

    if (!countries.includes(address.country)) countries.push(address.country);
    if (!states.includes(address.state)) states.push(address.state);
  });

  await Promise.all(promises);
  console.log(countries, states);
  document.querySelector(
    "#achivements"
  ).innerHTML = `<h3>${countries.length} Countries   ${states.length} States`;
}

// document.querySelectorAll(".closer").forEach((icon)=>{
//     icon.addEventListener('click',()=>{
//         icon.closest('.panel').classList.remove("open");
//     });
// })

//logout
document.querySelector("#logout_butn").addEventListener("click", () => {
  const result = confirm("Are you sure, You want to Logout?");
  if (result) {
    deleteCookies();
    logOut();
    location.reload();
  }
});

// -----------------------------------------------------------------------------------------------------------

//Get state and Country
function GetAddress(co) {
  //   console.log(co[0],co[1]);
  return new Promise((resolve, reject) => {
    //Google api -- ditched coz too costly
    //   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${co[0]},${co[1]}&key=AIzaSyB-0Z_umRJ5TaLK_woFHcpirp_yIffgvNY`, requestOptions)

    //OSM Api -- has limit on no of requests
    // fetch(`https://nominatim.openstreetmap.org/reverse?lat=${co[0]}&lon=${co[1]}&format=json`)
    // fetch(`https://rev-geocoding-3ti4mv5jca-uc.a.run.app/?lat=${co[0]}&lon=${co[1]}&format=json`)
    fetch(
      `http://127.0.0.1:5001/run-explorer/us-central1/rev_geocoding?lat=${co[0]}&lng=${co[1]}&format=json`
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.country, result.state);
        resolve({ state: result.state, country: result.country });
      })
      .catch((error) => console.error(error));
  });
}
//Distance calculating tools
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Function to calculate total distance of a polyline
function calculateTotalDistance(coordinates) {
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistance(
      coordinates[i - 1][0],
      coordinates[i - 1][1],
      coordinates[i][0],
      coordinates[i][1]
    );
  }
  return totalDistance;
}

function calculateURD(coordinatesArray, runsArray) {
  let urd = 0,
    turfKm = 0;
  coordinatesArray.forEach((runCos, index) => {
    let distance = calculateTotalDistance(runCos);
    runsArray[index].push(distance);
    urd += distance;
    let turfDistance = 0;
    if (runCos.length > 0) {
      let line = turf.lineString(runCos);
      turfDistance = turf.length(line);
      turfKm += turfDistance;
    }

    console.log(index, distance, turfDistance);
  });
  // console.log(runsArray);
  document.querySelector("#urd_value").innerText = urd.toFixed(2);

  console.log("urd - " + urd + ", turf - " + turfKm);

  // console.log(...coordinatesArray);
  // let collection = turf.featureCollection(...coordinatesArray);
  // console.log(collection);
  // // coordinatesArray.forEach((coordinates)=>{
  // //     if(coordinates.length > 0)
  // //     {
  // //         console.log(coordinates.length);
  // //         const newLineString = turf.lineString(coordinates);
  // //         multiLine = turf.combine(multiLine,newLineString);
  // //     }
  // // });
  // // multiLine = turf.combine(multiLine,[[1,2,3]]);
  // let multiLine = turf.combine(collection);
  // console.log(multiLine);
  // // Create Turf LineString objects for the polylines
  // const line1 = turf.lineString(coordinatesArray[0]);
  // const line2 = turf.lineString(coordinatesArray[1]);

  // // console.log(line1);
  // // Detect and remove overlapping segments
  // const nonOverlapping1 = turf.lineOverlap(line1, line2);
  // const nonOverlapping2 = turf.lineOverlap(line2, line1);
  // // console.log(nonOverlapping1);
  // // Step 2: Calculate Distance

  // // Calculate distance between non-overlapping segments
  // const distance1 = turf.length(nonOverlapping1, { units: 'kilometers' });
  // const distance2 = turf.length(nonOverlapping2, { units: 'kilometers' });

  // // console.log('overlap' + turf.booleanOverlap(line1,line2));
  // // Total distance between the non-overlapping segments
  // const totalDistance = distance1 + distance2;

  // // Output the total distance
  // console.log('Total distance between polylines:', totalDistance);
}

// SetToDB({ name: "sukinesh" }, `users/IQXAiDe2mRhcLywh8UBGB8CfZN92/runs`, "test");
