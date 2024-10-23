"use client"
import { QRCode } from "@/types";
import { useAppSelector } from "../../qr-code-state/hooks";
import { useEffect } from "react";
import { useUser } from "@/context/authContext";
import { Skeleton } from "@mui/material";

function QrcodeDisplay() {
    
    const qrCode: QRCode = useAppSelector(state => state.qrCode);
    const { user } = useUser();

    useEffect(() => {
        var QRCode = require('qrcode');
        var canvas = document.getElementById('qr-code-display');
        
        if (user) QRCode.toCanvas(canvas, qrCode.text, {
            margin: qrCode.margin,
            errorCorrectionLevel: qrCode.correctionLevel,
            scale: 7,
            color: {
                dark: qrCode.darkColor,
                light: qrCode.lightColor
            }
        }, function (error: any) {
            if (error) console.error(error);
        });
    }, [qrCode, user]);

    return (
        <>
            {user ? (
                <div className="flex flex-col gap-2">
                    <div className="bg-primary-blue text-white p-3 rounded-t-xl font-bold text-center">Preview of the QR Code</div>
                    <div className="rounded-b-xl bg-content-secondary p-3 pb-8">
                        <canvas id="qr-code-display"></canvas>
                    </div>
                </div>
            ) : (
                <Skeleton variant="rounded" height={300} width={300} />
            )}
        </>
    );
}

export default QrcodeDisplay;
