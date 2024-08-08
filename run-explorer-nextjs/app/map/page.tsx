import { Loading } from "@/components/smallStuff";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => {
    return import("@/components/Map");
  },
  { ssr: false ,loading: () => <Loading additionalStyle="w-8 bg-brand"   />}
);

const Home = () => {
 
  return  (
  <div className='relative z-0 ' style={{ height: '90.5vh', width: '100%' }}>
    <Map /> 
  </div>
  );
};

export default Home;
