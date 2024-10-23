"use client";
import { User, UserQRCode } from "@/types";
import QrcodeCard from "./QrcodeCard";
import { useUser } from "@/context/authContext";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import QrcodeNewCard from "./qr-code-edit-tab/QrcodeNewCard";

function QrcodesSkeleton() {
  const items = Array.from({ length: 6 }).map((_, index) => (
    <Box key={index} sx={{ mb: 4 }}>
      <Skeleton variant="text" width={240} height={40} />
      <Skeleton variant="rectangular" width={250} height={250} sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" width={160} height={40} sx={{ mt: 2 }} />
    </Box>
  ));

  return <>{items}</>;
}

function QrcodesSection() {
  
  const {user}=useUser()

  return ( 
    <div className="flex gap-4 p-4 flex-wrap justify-center sm:justify-start">
      <QrcodeNewCard/>
      {user?user.qrCodes.map((qrcode: UserQRCode) => <QrcodeCard key={qrcode.id} data={qrcode} />):<QrcodesSkeleton/>}
    </div>
  );
}

export default QrcodesSection;
