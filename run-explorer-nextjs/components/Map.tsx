// components/Map.tsx
'use client';
import 'leaflet/dist/leaflet.css';
import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L, { LatLngExpression, Map as LeafletMap, LocationEvent } from 'leaflet';
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import polyline from '@mapbox/polyline';


const Map = () => {
  const position: LatLngExpression = [8.1,77.5];  
  console.log('opening map');


  return (
    <div  style={{ height: '100%', width: '100%' }}>

      <MapContainer center={position} zoom={8} minZoom={2} maxBounds={L.latLngBounds(L.latLng(-90, -180),L.latLng(90, 180))} maxBoundsViscosity={1}  style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='Map data © Google'
        />
        <LocateUser />
        <DrawRunActivities />
      </MapContainer>
    </div>
  );
};


const LocateUser = () => {
  const map = useMap();

  console.log("test");

  const [userLocation, setUserLocation] = useState<LatLngExpression>([12.5, 76.5]);
  const [radius, setRadius] = useState<number>(0);

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 8 });

    console.log("inside use effect");

    map.on('locationfound', (e) => {
      setUserLocation(e.latlng);
      setRadius(e.accuracy / 2);

      console.log(userLocation);
    });

    map.on('locationerror', (e) => {
      console.error(e.message);
    });
  }, [map]);

  return (
    <>
      <Circle center={userLocation} radius={radius} />
      <Marker position={userLocation} />
    </>
  );
};

interface StravaActivity {
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  id: number;
  start_date: string;
  map: {
    summary_polyline: string;
  }
  start_latlng: [number, number];

}
const DrawRunActivities =  () => {
  const map = useMap();

  let activityArray:StravaActivity[] = [], coordinatesArray: LatLngExpression[][] = [];

  const activity_url = `https://www.strava.com/api/v3/athlete/activities?per_page=200&access_token=217acb58a4d707a4f00b68ecca7baddaef42f4e3`;
  fetch(activity_url)
    .then((response) => {
      if (!response.ok) {
        // getNewAccessToken();

        console.log("Network response was not ok - " + response.status);
        // deleteCookies();
        // location.href = "../strava.html";
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((activities) => {
      activities.forEach( (activity: StravaActivity, i: number) => {
        // console.log(i);

        const encodedPolyline = activity.map.summary_polyline;
        if (activity.type == "Run" && encodedPolyline != "") {

          // if (new Date(activity.start_date) > last_activity_date)
          //   last_activity_date = new Date(activity.start_date);
          activityArray.push(activity);
          const coordinates = polyline.decode(encodedPolyline);
          coordinatesArray.push(coordinates);
          // console.log(coordinates);

          L.polyline(coordinates, {
            color: "#ff4400",
            weight: 6.5,
            opacity: 0.6,
            lineJoin: "round",
          }).addTo(map).bindPopup(
            `<div class="leaflet_popup">
            Title: ${ activity.name }<br>
            Distance: ${(activity.distance / 1000).toFixed(1)}<br>
            Date: ${new Date(activity.start_date).toLocaleDateString()}
            </div>`
          );


        }
      });


    });

 return (<></>);

}

export default Map;
