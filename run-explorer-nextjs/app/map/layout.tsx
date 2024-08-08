import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./style.css";
import { HoriSeparator, VertSeparator, SlidingLabelIcon } from "@/components/smallStuff";
import {Statistics, Activities , Leaderboard , Challenges , Art} from '@/public/svg';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/functions/firebase";
import { ProfileMenu } from "@/components/interactiveThings";
import { useRouter } from "next/navigation";


const inter = Inter({ subsets: ["latin"] });



 const metadata: Metadata = {
    title: "Run Explorer",
    description: "A Map console to monitor all your Runs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <NavBar />
            <SidePanel />
            {children}

        </div>
    );
}

const NavBar = () => {
    return (
        <div className="navbar bg-base-100 shadow-lg relative z-20">
            {/* <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-5 w-5 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div> */}
            <div className="flex-1">
                <a className="btn btn-ghost  text-2xl title_text hover:bg-transparent  ">RUN EXPLORERS</a>
            </div>
            {/* <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-5 w-5 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                </button>
            </div> */}
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src="/profile.svg" />
                    </div>
                </div>
                
                
                <ProfileMenu/>
            </div>
        </div>
    );
}



const SidePanel = () => {
    // slate-500
    const svgColor ="#64748b";
    // const svgColor = "#fff";
    return (

        <div className=" sidenav w-64 shadow-lg flex">
            <div className="w-12 flex flex-col shadow-lg">
                <SlidingLabelIcon name="Statistics" SvgImage={<Statistics fill={svgColor}/>} />
                <HoriSeparator />
                <SlidingLabelIcon name="Activities" SvgImage={<Activities fill={svgColor}/>} />
                <HoriSeparator />
                <SlidingLabelIcon name="Leaderboard" SvgImage={<Leaderboard fill={svgColor}/>} />
                <HoriSeparator />
                <SlidingLabelIcon name="Challenges" SvgImage={<Challenges fill={svgColor}/>}  />
                <HoriSeparator />
                <SlidingLabelIcon name="Explorer Art" SvgImage={<Art fill={svgColor}/>} />
                
            </div>
            {/* <VertSeparator /> */}
            <div className="w-52">

            </div>
        </div>
    );
};


