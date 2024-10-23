import { QRCode, UserQRCode } from "@/types";
import { useRouter } from "next/navigation";

function QrcodeCard({data}:{data:UserQRCode}) {

    const router = useRouter()

    const handleDownload = (dataUrl:string,name:string) => {
        // Remplacez cette chaîne par votre propre URL data
    
        // Créez un élément <a> invisible
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = name+".png"; // Nom du fichier à télécharger
    
        // Ajoutez l'élément au DOM
        document.body.appendChild(link);
    
        // Cliquez sur le lien
        link.click();
    
        // Supprimez l'élément du DOM
        document.body.removeChild(link);
      };
   
    return ( 
        <div onClick={()=>router.push(`/dashboard/qrcode/${data.id}`)} className="pb-4 flex flex-col items-center border-2 p-2 px-4 rounded-lg bg-white hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all">
            <p className="font-semibold self-start m-3">{data.name}</p>
            <div
             style={{background:`url(${data.url})`}}
             className="w-[14rem] aspect-square !bg-center !bg-contain"
            ></div>
            <div>
            <a 
            onClick={(e)=>{
                e.stopPropagation()
                handleDownload(data.url,data.name)
            }}
            className="bg-primary-color p-3 rounded-md text-white font-bold mt-2 block transition-all">Download QR code</a>
            </div>
            <div className="text-slate-600 pt-3">Created on: {data?.createdAt?.toDate().toLocaleDateString()}</div>
        </div>
     );
}

export default QrcodeCard;