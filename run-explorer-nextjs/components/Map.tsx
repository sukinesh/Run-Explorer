// components/Map.tsx
'use client';
import 'leaflet/dist/leaflet.css';
import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L, { LatLngExpression, Map as LeafletMap, LocationEvent } from 'leaflet';
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"


const Map = () => {
  const position: LatLngExpression = [12.5, 76.6];
  const polylinePositions: LatLngExpression[] = [
    [12.5, 76.5], [12.0, 76.5]

  ];

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
        <TestComp/>
        <LocateUser />
        <Polyline
          positions={polylinePositions}
          color="red"
          weight={4}
          opacity={1}
          dashArray="5,10"
        />
      </MapContainer>
    </div>
  );
};

const TestComp = ()=>{
  console.log('testComp');
  
  return <></>;
}

const LocateUser = () => {
  const map = useMap();
  console.log("test");

  const [userLocation, setUserLocation] = useState<LatLngExpression>([12.5, 76.5]);
  const [radius, setRadius] = useState<number>(0);

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 8 });

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
      <Marker position={userLocation}  />
    </>
  );
};


export default Map;
