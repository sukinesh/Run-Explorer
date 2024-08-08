import Image from "next/image"
import { ReactElement } from "react"

export const Loading = ()=>{
    return <span className="loading loading-ring loading-lg fixed top-1/2 left-1/2"></span>
}

export const VertSeparator = ()=>{
    return <div className="h-full w-[1px] bg-gray-200 "></div>
}
export const HoriSeparator = ()=>{
    return <div className="w-full h-[1px] bg-gray-200 "></div>
}

export const SlidingLabelIcon = (prop: {  name: string , SvgImage:ReactElement }) => {
    return (
        <div className="cursor-pointer group relative  inline-block ">
            {prop.SvgImage}
            <span className="absolute top-1/2 left-0 transform -translate-y-1/2 translate-x-[-120%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-500 text-white py-1 px-3 rounded-none w-64 h-[90%] m-auto flex items-center pl-12 z-[-1] ">
                {prop.name}
            </span>
        </div>
    )
}


