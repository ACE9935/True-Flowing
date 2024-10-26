import { QRCode, UserQRCode } from "@/types";
import { MoreVert, Star } from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { DeleteQRCodeModal, EditQRCodeModal } from "../../qrcode/components/QrcodeStatsContainer";

function QrcodeCard({data}:{data:UserQRCode}) {

    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen:isOpenY, onOpen:onOpenY, onClose:onCloseY } = useDisclosure()
    const [loading,setLoading]=useState(false)
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

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
        <div className="pb-4 flex flex-col items-center border-2 p-2 px-4 rounded-lg bg-white hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all">
            
            <DeleteQRCodeModal isOpen={isOpen} onClose={onClose} qrCodeId={data.id}/>
            <EditQRCodeModal isOpen={isOpenY} onClose={onCloseY} qrCode={data}/>

            <div className="flex justify-between self-start w-full items-center">
                <div className="font-semibold self-start m-3 flex items-center gap-2">{data.type=="Premium"&&<Star className="text-amber-500"/>}{data.name}</div>
                <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                ><MoreVert/></IconButton>
                <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>{
            if(data.type=="Basic") onOpenY()
            else router.push(`/dashboard/edit-qrcode/${data.id}`)
        }}>Edit</MenuItem>
        <MenuItem onClick={onOpen}>Delete</MenuItem>
      </Menu>
            </div>
            <div
             onClick={()=>router.push(`/dashboard/qrcode/${data.id}`)}
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