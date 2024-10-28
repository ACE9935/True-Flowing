"use client"
import { Add, Casino, QrCode2 } from "@mui/icons-material";
import { useRouter } from "next/navigation";

function QrcodeNewCard() {

    const router = useRouter()
   
    return ( 
        <div className="pb-4 flex text-white flex-col items-center border-2 p-2 px-5 rounded-lg bg-primary-blue cursor-pointer transition-all">
            <p className="font-semibold self-start m-3 text-center">Create new QRcode</p>
            <QrCode2 sx={{fontSize:"12rem"}}/>
            <div className="flex flex-col gap-3 w-full font-bold">
                <button onClick={()=>router.push("/dashboard/create-qrcode?type=basic")} className="rounded-full flex gap-2 transition-all items-center bg-slate-400 hover:bg-slate-500 justify-center pr-8 text-white border-2 border-white p-3"><Add/>Dynamic</button>
                <button onClick={()=>router.push("/dashboard/create-qrcode?type=premium")} className="rounded-full gap-2 flex transition-all border-2 border-white items-center justify-center bg-amber-500 hover:bg-amber-600 text-white text-primary-blue p-3"><Casino/>Premium</button>
            </div>
        </div>
     );
}

export default QrcodeNewCard;