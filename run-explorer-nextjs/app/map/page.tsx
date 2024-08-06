// pages/index.tsx
// 'use client';

import dynamic from "next/dynamic";

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
