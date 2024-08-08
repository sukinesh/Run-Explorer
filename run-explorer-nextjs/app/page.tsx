'use client';
import Link from "next/link";
import Image from "next/image";
import { ButtonWithIcon } from "@/components/interactiveThings";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logOut, checkAuth, firestore, GoogleLogin } from "@/functions/firebase";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { use, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";




// checkAuth();
// logOut();


export default function Home() {
  const router = useRouter();
  // const TestFunc= ()=>{
  //   SetCenterButton({label:"Connect Strava Account", imgPath:"/strava.svg", additionalStyle:"bg-strava", clickHandler:GoogleLogin})
  // }
  const [centerButton, SetCenterButton] = useState({ label: "Continue with Google", imgPath: "/google.png", additionalStyle: "bg-google", clickHandler: GoogleLogin });

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
        //checking connectin strava button
        SetCenterButton({ label: "Checking Connection...", imgPath: "/strava.svg", additionalStyle: "bg-stravaTransparent", clickHandler: () => { } })
        StravaLoginWithCookie(user.uid);


      } else {
        console.log('logged out');

      }
    });

    return () => unsubscribe();
  }, [])

  const StravaLoginWithCookie = (userId: string) => {
    //check stava auth - if yes -> forward
    const access_token = Cookies.get("access_token");
    //check access token in cookies
    if (access_token != undefined && access_token != "") {
      console.log(access_token);
      router.replace("/map");
    } else {
      // get refresh token from Firestore and generate Access Token
      getDoc(doc(firestore, 'users', userId))
        .then((snap) => {
          console.log("reading refresh token");
          const refreshToken = snap.data()?.refresh_token;
          console.log(refreshToken);
          if (refreshToken)
            getNewAccessToken(refreshToken);
          else
            prepForStravaAuth();
        })
        .catch((err) => {
          console.log(err);
          prepForStravaAuth();
        });
      prepForStravaAuth();

    }
  }

  function prepForStravaAuth() {
    SetCenterButton({ label: "Connect Strava Account", imgPath: "/strava.svg", additionalStyle: "bg-strava", clickHandler: StravaSignUpLink })

  }

  function testFunc(){
    router.replace('../test');
  }

  function StravaSignUpLink(){
    window.location.href =`https://www.strava.com/oauth/authorize?client_id=120778&redirect_uri=${location.href.substring(
      0,
      location.href.lastIndexOf("/")
    )}/strava_callback&response_type=code&scope=activity:read_all`;
    
    // window.location.href = 'https://www.example.com';
  }

  function getNewAccessToken(refreshToken: string) {

    //get refresh token from firestore
    const url = `https://www.strava.com/oauth/token?client_id=120778&client_secret=dfff83ccf27dafd2adae6e59a8b234d2a03fc9c9&refresh_token=${refreshToken}&grant_type=refresh_token`;
    // console.log(url);
    fetch(url, { method: "POST" })
      .then((response) => {
        // Check if the request was successful (status code 200)
        if (!response.ok) {
          prepForStravaAuth();
          throw new Error("Network response was not ok");
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        console.log(
          `access_token=${data.access_token};refresh_token=${data.refresh_token}`
        );
        document.cookie = `access_token=${data.access_token
          }; expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = `refresh_token=${data.refresh_token}; expires=${expirationDate.toUTCString()}; path=/`
        location.reload();
      });
  }

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
        <ButtonWithIcon label={centerButton.label} imgPath={centerButton.imgPath} additionalStyle={centerButton.additionalStyle} clickHandler={centerButton.clickHandler} />
      </div>
    </main>
  );
}





