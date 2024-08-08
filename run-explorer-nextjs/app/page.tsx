'use client';
import Link from "next/link";
import Image from "next/image";
import { ButtonWithIcon } from "@/components/interactiveThings";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logOut, checkAuth } from "@/functions/firebase";
import { useRouter } from "next/navigation";



// checkAuth();
// logOut();


export default function Home() {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.uid);
      router.replace("/map");
    } else {
      console.log('logged out');

    }
  });

  return (
    <main className="bg_img p-4">
      <div className="flex flex-col items-center m-[10vh]">
        <div className="flex items-center m-12 gap-5" >
          <Image width={96} height={96} src="/runner.svg" alt="logo" />
          <div className="flex flex-col text-nowrap mt-4" >
            <h1 className="font-brand text-8xl leading-[0.5] text-brand " >RUN EXPLORERS</h1>
            <h2 className="font-brand text-[2rem] leading-[1] tracking-[7px]  text-white" >Run to Explore & Explore to Run</h2>
          </div>
        </div>
        <ButtonWithIcon label="Continue with Google" imgPath="/google.png" additionalStyle="bg-google" />
      </div>
    </main>
  );
}



