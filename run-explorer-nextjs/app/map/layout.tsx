import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Run Explorer",
    description: "A Map console to monitor all your Runs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="winter">
            <body className={inter.className} suppressHydrationWarning={true}>
                <NavBar />
                <SidePanel />
                {children}
            </body>
        </html>
    );
}

const NavBar = () => {
    return (
        <div className="navbar bg-base-100 shadow-lg relative z-10">
            <div className="flex-none">
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
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">RUN EXPLORERS</a>
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
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
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
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
    );
}

const SidePanel = () => {
    return (
        <div role="tablist" className="tabs tabs-lifted">
            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Stats" defaultChecked  />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Tab content 1
            </div>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Runs" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Tab content 3
            </div>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="People" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Tab content 3
            </div>
            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Challenges" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Tab content 3
            </div>
            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Art" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                Tab content 3
            </div>
            
        </div>
    );
};
