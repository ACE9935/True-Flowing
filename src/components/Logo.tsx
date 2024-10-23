"use client"
import { configurations } from "@/app-configurations";
import { useRouter } from "next/navigation";

function Logo({variation}:{variation:"light"|"white"}) {
    const router=useRouter();
    return ( 
        <div onClick={()=>router.push("/")} className={`${variation=="light"?"text-black":"text-white"} cursor-pointer font-bold text-[2em] flex gap-3 items-center justify-center`}><img src={variation=="light"?"/logoLight.png":"/logo.png"} className="w-[1.2em]"/>{configurations.appName}</div>
     );
}

export default Logo;