'use client';
import React from 'react'
import Image from 'next/image';
import { ButtonWithIcon } from '@/components/interactiveThings';
import { Loading } from '@/components/smallStuff';
import { auth, checkAuth, firestore } from '@/functions/firebase';
import { processURLParameters } from '@/functions/tools';
import { setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Strava = () => {

    const router = useRouter();

    let urlParms = processURLParameters()
    console.log(urlParms);
    // if (urlParms == undefined) {
    //     urlParms = history.state;
    // }
    if (urlParms)
        if (urlParms.hasOwnProperty('code')) {
            // history.pushState({ code: urlParms.code }, "", "map.html");
            // console.log(urlParms.code);
            //genarating refresh token with the authorisation code rece
            const url = `https://www.strava.com/oauth/token?client_id=120778&client_secret=dfff83ccf27dafd2adae6e59a8b234d2a03fc9c9&code=${urlParms.code}&grant_type=authorization_code`
            console.log(url);
            fetch(url, { method: "POST" })
                .then(response => {
                    // Check if the request was successful (status code 200)
                    if (!response.ok) {
                        router.replace("../");
                        throw new Error('Network response was not ok');
                    }
                    // Parse the response as JSON
                    return response.json();
                })
                .then(async (data) => {
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 30);
                    console.log(`access_token=${data.access_token};refresh_token=${data.refresh_token}`);
                    document.cookie = `access_token=${data.access_token}; expires=${expirationDate.toUTCString()}; path=/`
                    // document.cookie = `refresh_token=${data.refresh_token}; expires=${expirationDate.toUTCString()}; path=/`
                    const unsubscribe = onAuthStateChanged(auth, (user) => {
                        if (user) {
                            setDoc(doc(firestore, "users", user.uid), {
                                'refresh_token': data.refresh_token,
                                'name': user.displayName,
                                'email': user.email,
                                'mobile': user.phoneNumber,
                                'photo': user.photoURL
                            })
                                .then((result) => {
                                    console.log(result);
                                    router.replace("../map");
                                }).catch((err) => console.log(err));

                        } else {
                            console.log('logged out');

                        }
                        return ()=>unsubscribe();
                    });

                })
        }
        else if (urlParms.hasOwnProperty('error')) {
            if (urlParms.error == "access_denied") {
                console.log(urlParms.error);
                router.replace("../");
            }
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
                <ButtonWithIcon label="Processing Strava Connection..." imgPath="/strava.svg" additionalStyle="bg-stravaTransparent" />
            </div>
            <Loading additionalStyle="w-20 bg-white top-3/4" />
        </main>
    );
}

export default Strava