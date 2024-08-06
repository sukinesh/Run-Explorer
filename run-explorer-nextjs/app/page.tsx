import Link from "next/link";
import { Loading } from "@/components/smallStuff";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className=" text-4xl text-center">
        RUN EXPLORER
      </h1>
      <Link className="btn " href="/map">Map</Link>
      <Loading/>
    </main>
  );
}