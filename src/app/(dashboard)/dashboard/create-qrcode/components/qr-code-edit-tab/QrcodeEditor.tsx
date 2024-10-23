"use client"
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { auth } from "@/firebase/firebase";
import { updateUserFieldOfTypeArray } from "@/firebase/updateUserFieldOfTypeArray";
import { UserBasicQRCode, UserQRCode } from "@/types";
import { isValidUser } from "@/firebase/isValidUser";
import { motion } from "framer-motion";
import { storage } from '@/firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from "next/navigation";
import { configurations } from "@/app-configurations";
import QrcodeEditorFirstSection from "./QrcodeEditorFirstSection";
import QrcodeEditorSecondSection from "./QrcodeEditorSecondSection";
import { AnimatePresence } from "framer-motion";
import QrcodeEditorThirdSection from "./QrcodeEditorThirdSection";
import QrcodeEditorFourthSection from "./QrcodeEditorFourthSection";
import { useUser } from "@/context/authContext";
import QrCodeEditorSkeleton from "./QrcodeEditorSkeleton";
import { useDispatch } from "react-redux";
import { resetQRCodeSate, setQRCodeText, setQRCodeType } from "../../qr-code-state/qr-code-state";
import AppToast from "@/components/AppToast";
import { Check } from "@mui/icons-material";
import { useToast } from "@chakra-ui/react";

var QRCode = require('qrcode');

export interface TransitionalComponent { handlerForward: () => void, handlerPrevious?: () => void, isLoading?: boolean, editorMode?: boolean }

export const handleUpload = async (image: File | undefined | string, dir: string): Promise<string | null> => {
  if (!image || typeof image == "string") return null;

  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${dir}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('Upload progress:', progress);
      },
      error => {
        console.error('Upload error:', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve(downloadURL);
        }).catch(error => {
          console.error('Error getting download URL:', error);
          reject(error);
        });
      }
    );
  });
};

function QrcodeEditor({ type }: { type?: "basic" | "premium" | string | null }) {

  const qrCodeState = useAppSelector(state => state.qrCode);
  const dispatch = useDispatch();
  const { user, updateUser } = useUser();
  const [section, setSection] = useState(1);
  const [error, setErrorMsg] = useState<{ msg: string, type: string | null }>({ msg: "", type: null });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSaveQRCode = async () => {
    setIsLoading(true);
    try {
      if (isValidUser(user)) {
        const userId = user!.id;
        const qrCodeId = userId + Date.now();
        let qrCodeURI = null;

        QRCode.toDataURL(configurations.host + "/client/" + userId + "/" + qrCodeId, {
          margin: qrCodeState.margin,
          errorCorrectionLevel: qrCodeState.correctionLevel,
          scale: 8,
          color: {
            dark: qrCodeState.darkColor,
            light: qrCodeState.lightColor
          }
        }, function (err: any, url: string) {
          if (err) throw err;
          qrCodeURI = url;
        });

        const today = new Date();
        const logoUrl = await handleUpload(qrCodeState.meta.logoImg, "logos");
        const desktopImgUrl = await handleUpload(qrCodeState.meta.desktopImg, "desktop-images");
        const qrCode: UserQRCode | UserBasicQRCode = qrCodeState.type == "Premium" ? {
          createdAt: today,
          name: qrCodeState.name,
          type: qrCodeState.type,
          url: qrCodeURI!,
          redirectoryLink: qrCodeState.redirectoryLink,
          scansForDate: [],
          scans: 0,
          scansPerDay: 0,
          scansPerMonth: 0,
          scansPerWeek: 0,
          winners: 0,
          winnersPerDay: 0,
          winnersPerMonth: 0,
          winnersPerWeek: 0,
          winnersForDate: [],
          id: qrCodeId,
          meta: {
            ...qrCodeState.meta,
            logoImg: logoUrl || configurations.userImg,
            desktopImg: desktopImgUrl || configurations.client.desktopImg,
          }
        } : {
          name: qrCodeState.name,
          type: qrCodeState.type,
          url: qrCodeURI!,
          redirectoryLink: qrCodeState.redirectoryLink,
          scansForDate: [],
          scans: 0,
          scansPerDay: 0,
          scansPerMonth: 0,
          scansPerWeek: 0,
          id: qrCodeId,
          createdAt: today
        };

        await updateUserFieldOfTypeArray(userId, "qrCodes", qrCode)
          .then(() => setErrorMsg({ msg: "", type: null }))
          .then(async () => {
            await updateUser();
            router.push("/dashboard/qrcodes");
            toast({
              position: 'bottom-left',
              render: () => (
                 <AppToast variant="SUCCESS" title="QR code added" Icon={Check} />
              ),
           });
          });
      } else {
        setErrorMsg({ msg: "Please log in and verify your email to continue", type: null });
      }
    } catch (e) {
      setErrorMsg({ msg: "An error occurred, please try again later", type: null });
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    dispatch(resetQRCodeSate(configurations.host + "/client/" + user?.name))
    if (user) {
      dispatch(setQRCodeText(configurations.host + "/client/" + user?.name));
      switch (type) {
        case "basic":
          dispatch(setQRCodeType("Basic"));
          break;
        case "premium":
          dispatch(setQRCodeType("Premium"));
          break;
        default:
      }
    }
    console.log(qrCodeState.type);
  }, [user]);

  const sections = [
    <QrcodeEditorFirstSection key={0} handler={async () => qrCodeState.type == "Premium" ? setSection(2) : await handleSaveQRCode()} isLoading={isLoading} />,
    <QrcodeEditorSecondSection key={1} handlerForward={() => setSection(3)} handlerPrevious={() => setSection(1)} />,
    <QrcodeEditorThirdSection key={2} handlerForward={() => setSection(4)} handlerPrevious={() => setSection(2)} />,
    <QrcodeEditorFourthSection key={3} handlerPrevious={() => setSection(3)} handlerForward={handleSaveQRCode} isLoading={isLoading} />
  ];

  const wrappedSections = sections.map((section, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, top: -100 }}
      animate={{ opacity: 1, top: 0 }}
      transition={{ type: "spring" }}
      style={{ position: 'relative', width: '100%' }}
    >
      {section}
    </motion.div>
  ));

  return (
    <div className="overflow-hidden grow">
      <AnimatePresence>
        {user ? wrappedSections[section - 1] : <QrCodeEditorSkeleton />}
      </AnimatePresence>
    </div>
  );
}

export default QrcodeEditor;
