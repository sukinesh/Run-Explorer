// pages/index.tsx
// 'use client';

import dynamic from "next/dynamic";
import App from "@/components/test";
import LocationMap from "@/components/Map";
import MapComponent from "@/components/test";

const Map = dynamic(
  () => {
    return import("@/components/Map");
  },
  { ssr: false ,loading: () => <p>Loading...</p>}
);

const Home = () => {
  return  (
  <div>
    <Map /> 
  </div>
  );
};

export default Home;
