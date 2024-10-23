"use client"
import { Provider } from "react-redux";
import { store } from "../../qr-code-state/store";
import QrcodeDisplay from "./QrcodeDisplay";
import QrcodeEditor from "./QrcodeEditor";
import { useSearchParams } from 'next/navigation'

function QrcodeTab() {

    const searchParams = useSearchParams()
 
    const type = searchParams.get('type')

    return ( 
        <Provider store={store}>
        <div className="md:flex-row flex flex-col items-center lg:items-start gap-8 w-full max-w-[1000px]">
        <div className="py-4 lg:py-12"><QrcodeDisplay/></div>
        <QrcodeEditor type={type}/>
        </div>
        </Provider>
     );
}

export default QrcodeTab;