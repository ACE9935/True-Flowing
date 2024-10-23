import QrcodeStatsContainer from "../components/QrcodeStatsContainer";


function QrCodePage({ params }: { params: { id: string } }) {

    return ( 
        <QrcodeStatsContainer qrCodeId={params.id}/>
     );
}

export default QrCodePage;