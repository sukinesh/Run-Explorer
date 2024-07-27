export let map = L.map("map").setView([13, 76], 5);
// window.map = map;
let userLocation;
//OpenStreet Map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

//Google Map
L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  attribution: "Map data © Google",
}).addTo(map);

// Locate the user
map.locate({ setView: false });

// Handle the location found event
map.on("locationfound", (e) => {
  let radius = e.accuracy / 2;
  userLocation = e.latlng;

  // Add a marker to the user's location
  L.marker(userLocation).addTo(map);
  //     .bindPopup("You are within " + radius + " meters from this point").openPopup();

  // Add a circle to show the accuracy
  L.circle(userLocation, radius).addTo(map);
});

map.on("locationerror", (e) => console.log("error: ", e));

document.querySelector("#locate_butn").addEventListener("click", (event) => {
  map.setView(userLocation, 10);
});
