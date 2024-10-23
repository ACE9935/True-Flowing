"use client";

import AppToast from "@/components/AppToast";
import { useUser } from "@/context/authContext";
import { useToast } from "@chakra-ui/react";
import { Check, NotificationAdd, Person, QrCode } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("verifiedUser")) {
      toast({
        position: "bottom-left",
        render: () => (
          <AppToast variant="SUCCESS" title="Email successfully verified" Icon={Check} />

        ),
      });
    }
  }, [searchParams, toast]);

  // Corrected Tab function as a component
  const Tab = ({
    title,
    content,
    Icon,
    link,
  }: {
    title: string;
    content: number;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    link: string;
  }) => (
    <div
      onClick={() => router.push(link)}
      className="flex cursor-pointer hover:scale-105 transition-all text-white shadow-md justify-between p-4 gap-7 border-2 rounded-lg bg-gradient-to-b from-primary-blue to-purple-400/70"
    >
      <div>
        <div className="font-bold text-md">{title}</div>
        <div>{content}</div>
      </div>
      <Icon fontSize="large" />
    </div>
  );

  return (
    <div className="p-6 min-h-full">
      <h1 className="text-3xl font-bold pb-2">Dashboard</h1>
      <div className="py-8 flex flex-col gap-5">
        <div className="sm:flex-row flex-col flex justify-center gap-5">
          <Tab
            title="SAVED CLIENTS"
            content={user?.clients?.length || 0}
            Icon={Person}
            link="/dashboard/clients"
          />
          <Tab
            title="QRCODES CREATED"
            content={user?.qrCodes?.length || 0}
            Icon={QrCode}
            link="/dashboard/qrcodes"
          />
          <Tab
            title="AUTOMATED ALERTS"
            content={user?.automatedNotifications?.length || 0}
            Icon={NotificationAdd}
            link="/dashboard/send-requests"
          />
        </div>
<div className="lg:flex-row flex-col flex gap-4 w-full">
        <div className="border-2 rounded-lg flex flex-col gap-4 py-4 w-full">
        <div className="px-5 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent roulette winners</h2>
            <button onClick={()=>router.push("dashboard/roulette-winners")} className="rounded-full border-black p-3 py-1 border-2 hover:underline">See all</button>
            </div>
          <div>
            <div className="flex justify-between text-slate-500 border-b-2 pb-1 px-5">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Scanned QRCode</div>
            </div>
            {!user?.winnerClients.length?<div className="p-4 text-center">No data found</div>:user?.winnerClients
              ?.sort((a, b) => {
                const [dayA, monthA, yearA, hourA, minuteA] = a.infos.submitDate.split(/[\/: ]/);
                const [dayB, monthB, yearB, hourB, minuteB] = b.infos.submitDate.split(/[\/: ]/);
                const dateA = new Date(`${yearA}-${monthA}-${dayA}T${hourA}:${minuteA}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}T${hourB}:${minuteB}`);
                return dateB.getTime() - dateA.getTime();
              })
              .slice(0, 5) // Limit to 5 items
              .map((o, index) => (
                <div key={index} className={index % 2 === 0 ? "bg-amber-300/30" : "bg-amber-300"}>
                  <div className="flex justify-between text-black border-b-2 py-4 px-5">
                    <div>{o.infos.name}</div>
                    <div>{o.infos.email}</div>
                    <div>{o.infos.phoneNumber}</div>
                    <div>
                      {user?.qrCodes?.find((qrcode) => qrcode.id === o.infos.qrcodeId)?.name}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="border-2 rounded-lg flex flex-col gap-4 py-4 w-full">
          <div className="px-5 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent clients</h2>
            <button className="rounded-full border-black p-3 py-1 border-2 hover:underline" onClick={()=>router.push("/dashboard/clients")}>See all</button>
            </div>
          <div>
            <div className="flex justify-between text-slate-500 border-b-2 pb-1 px-5">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Scanned QRCode</div>
            </div>
            {!user?.clients.length?<div className="p-4 text-center">No data found</div>:user?.clients
              ?.sort((a, b) => {
                const [dayA, monthA, yearA, hourA, minuteA] = a.infos.submitDate.split(/[\/: ]/);
                const [dayB, monthB, yearB, hourB, minuteB] = b.infos.submitDate.split(/[\/: ]/);
                const dateA = new Date(`${yearA}-${monthA}-${dayA}T${hourA}:${minuteA}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}T${hourB}:${minuteB}`);
                return dateB.getTime() - dateA.getTime();
              })
              .slice(0, 5) // Limit to 5 items
              .map((o, index) => (
                <div key={index} className={index % 2 === 0 ? "bg-blue-700/15" : "bg-primary-blue"}>
                  <div className="flex justify-between text-black border-b-2 py-4 px-5">
                    <div>{o.infos.name}</div>
                    <div>{o.infos.email}</div>
                    <div>{o.infos.phoneNumber}</div>
                    <div>
                      {user?.qrCodes?.find((qrcode) => qrcode.id === o.infos.qrcodeId)?.name}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

