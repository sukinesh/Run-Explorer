// components/Map.tsx
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"


const Map = () => {
  const position: LatLngExpression = [12.5, 76.6]; 

  return (
    <MapContainer center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        attribution='Map data © Google'
      />
      <Marker position={position}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
