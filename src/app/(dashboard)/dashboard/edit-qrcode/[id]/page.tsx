"use client"
import { Provider } from "react-redux";
import QrcodeEditor from "../components/QrcodeEditor";
import { store } from "../../create-qrcode/qr-code-state/store";
import { useUser } from "@/context/authContext";
import QrcodeStatsSkeleton from "../../qrcode/components/QrcodeStatsSkeleton";


function QrCodeEditPage({ params }: { params: { id: string } }) {

    const {user}=useUser()

    return ( 
        <Provider store={store}>
            {user?<QrcodeEditor qrCodeId={params.id}/>:<QrcodeStatsSkeleton/>}
        </Provider>
     );
}

export default QrCodeEditPage;