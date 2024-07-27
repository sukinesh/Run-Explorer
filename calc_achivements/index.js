const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.writetofirestore = onDocumentCreated(
    "users/{userId}/runs/{activityId}",
    (event) => {
      const activity = event.data.data();
      const coord = activity.start_latlng;
      revGeoCoding(coord).then((place) => {
        console.log(place);
        const userRef = db.doc(`users/${event.params.userId}`);
        userRef.get().then((snapshot)=>{
          console.log(snapshot.data());
          let achievements = snapshot.data().achievements;
          if (achievements) {
            if (!achievements.states.includes(place.state)) {
              achievements.states.push(place.state);
            }
            if (!achievements.countries.includes(place.country)) {
              achievements.countries.push(place.country);
            }
          } else {
            achievements = {
              states: [place.state],
              countries: [place.country],
            };
          }
          return achievements;
        }).then((achievements)=>{
          userRef.update({achievements: achievements})
              .then(()=>console.log("db updated"));
        });
      });
    },
);

// RevGeoCoding([12.5,76.5]).then((result) =>{

//   console.log(result);
//   db.doc(`users/`).get({achievements: result});

// });

/**
 * reverse geocode lat long to give state & country
 * @param {array} co - array of lat & lng
 * @return {object} state & country object
 */
function revGeoCoding(co) {
  console.log(co[0], co[1]);
  return new Promise((resolve, reject) => {
    // OSM Api
    fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${co[0]}&lon=${co[1]}&format=json`,
    )
        .then((response) => response.json())
        .then((result) => {
          resolve({
            state: result.address.state,
            country: result.address.country,
          });
        })
        .catch((error) => console.error(error));
  });
}
