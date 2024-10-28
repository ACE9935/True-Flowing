import { getUserById } from "@/firebase/getUserById";
import { User, UserQRCode } from "@/types";
import { notFound, redirect } from "next/navigation";
import ClientPageSections from "./components/ClientPageSections";
import axios from "axios";

export async function generateMetadata({ params }: { params: { provider: string[] } }) {
  const [userId] = params.provider; // Get userId from params
  const provider = await getUserById(userId); // Fetch the provider

  if (provider) {
    return {
      title: `${provider.name} - True Flowing`,
      icons: {
        icon: '/logoLight.png',
      }, // Use provider's name for the title
      description: `We're excited to welcome you to the ${provider.name} page, where you can play our roulette game to win a free prize!`,
    };
  }

  // Default metadata in case the provider is not found
  return {
    title: "Welcome to Our Site",
    icons: {
      icon: '/logoLight.png',
    },
    description: "Join us to play our roulette game and win amazing prizes!",
  };
}

export default async function ClientPage({ params }: { params: { provider: string[] } }) {
  const [userId, qrCodeID] = params.provider;
  const provider = await getUserById(userId);

  if (!provider) notFound();
  else {
    const qrCode = provider.qrCodes.find((obj: UserQRCode) => obj.id === qrCodeID);
    if (qrCode) {
      qrCode.createdAt = null; // You can safely assign the value if qrCode exists
    }

    if (!qrCode) notFound();
    if (qrCode.type === "Basic") {
      await axios.post(process.env.HOST + "/api/increment-basic-qrcode-scans", {
        userId: userId,
        qrCodeId: qrCode.id,
      });
      redirect(qrCode.redirectoryLink!);
    } else {
      return (
        <div className="flex w-full min-h-screen xl:justify-none justify-center">
          <div className="self-center w-full max-w-[32rem]">
            <ClientPageSections name={provider.name} qrCode={qrCode} clientId={provider.id} />
          </div>
          <div
            className="grow !bg-center !bg-cover xl:block hidden"
            style={{
              background: `url(/pattern.jpg)`,
              backgroundSize: "contain",
            }}
          ></div>
        </div>
      );
    }
  }
}
