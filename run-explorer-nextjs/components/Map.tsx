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
  const position: LatLngExpression = [12.5, 76.6];
  const polylinePositions: LatLngExpression[] = [
    [12.5, 76.5], [12.0, 76.5]

  ];

  console.log('opening map');


  return (
    <div style={{ height: '100vh', width: '100%' }}>

      <MapContainer center={position} zoom={8} minZoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='Map data © Google'
        />
        {/* <Marker position={position}>
        </Marker> */}
        <LocateUser />
        <Polyline
          positions={polylinePositions}
          color="red"
          weight={4}
          opacity={1}
          dashArray="5,10"
        />
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
  id : number;
  start_date : string;
  map : {
    summary_polyline : string;
  }
  start_latlng : [number , number];

}
const DrawRunActivities = () => {
  const activity_url = `https://www.strava.com/api/v3/athlete/activities?per_page=200&access_token=c40882f8f95e78518b7833dd2764377476d85c01`;
  fetch(activity_url)
    .then((response) => {
      if (!response.ok) {
        // getNewAccessToken();

        console.log("Network response was not ok - " + response.status);
        // deleteCookies();
        location.href = "../strava.html";
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((activities) => {
      let activityArray = [];
      activities.forEach(async (activity: StravaActivity, i: number) => {
        // console.log(i);

        const polyline = activity.map.summary_polyline;
        if (activity.type == "Run" && polyline != "") {

          // if (new Date(activity.start_date) > last_activity_date)
          //   last_activity_date = new Date(activity.start_date);
          activityArray.push(activity);

        }
      });
      console.log(activityArray.length);


    });
  return (<></>);
}

export default Map;
