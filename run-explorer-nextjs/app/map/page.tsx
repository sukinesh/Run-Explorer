import { Loading } from "@/components/smallStuff";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => {
    return import("@/components/Map");
  },
  { ssr: false ,loading: () => <Loading/>}
);

const Home = () => {
 
  return  (
  <div className='relative z-0' style={{ height: '90vh', width: '100%' }}>
    <Map /> 
  </div>
  );
};

export default Home;
