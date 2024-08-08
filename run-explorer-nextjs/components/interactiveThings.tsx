'use client';
import Image from "next/image";
import { GoogleLogin } from "@/functions/firebase";
import { checkAuth, logOut } from "@/functions/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/functions/firebase";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";


export const ButtonWithIcon = (props: { label: string, imgPath: string, additionalStyle: string , clickHandler?: MouseEventHandler }) => {
    let styleTag = "flex text-white text-xl font-bold rounded pr-2 drop-shadow-2xl";
    styleTag = styleTag + ' ' + props.additionalStyle;

    return (
        <button className={styleTag} onClick={props.clickHandler} >
            <Image width={36} height={36} src={props.imgPath} alt="google logo" className="float-left m-2 bg-white p-1 rounded " />
            <h4 className="m-auto">
                {props.label}
            </h4>
        </button>
    );
};

export const ProfileMenu = () => {
    const router = useRouter();


      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user.uid);
        } else {
          console.log('logged out');
          router.replace("../");
        }
      });

    return (
        <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
                <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
            </li>
            <li><a>Settings</a></li>
            <li><a onClick={logOut}>Logout</a></li>
        </ul>
    )
}



