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
            title="NOTIFICATION CAMPAINGS"
            content={user?.automatedNotifications?.length || 0}
            Icon={NotificationAdd}
            link="/dashboard/send-requests"
          />
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {/* Recent Roulette Winners Table */}
          <div className="border-2 rounded-lg w-full overflow-x-auto">
            <div className="px-5 flex justify-between items-center py-4">
              <h2 className="text-lg font-bold">Recent roulette winners</h2>
              <button
                onClick={() => router.push("dashboard/roulette-winners")}
                className="rounded-full border-black p-3 py-1 border-2 hover:underline"
              >
                See all
              </button>
            </div>
            <table className="w-full table-auto text-left min-w-[45rem]">
              <thead className="text-slate-500 border-b-2">
                <tr>
                  <th className="px-5 py-2">Name</th>
                  <th className="px-5 py-2">Email</th>
                  <th className="px-5 py-2">Phone</th>
                  <th className="px-5 py-2">Scanned QRCode</th>
                </tr>
              </thead>
              <tbody>
                {!user?.winnerClients.length ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  user?.winnerClients
                    .sort((a, b) => {
                      const [dayA, monthA, yearA, hourA, minuteA] = a.infos.submitDate.split(/[\/: ]/);
                      const [dayB, monthB, yearB, hourB, minuteB] = b.infos.submitDate.split(/[\/: ]/);
                      const dateA = new Date(`${yearA}-${monthA}-${dayA}T${hourA}:${minuteA}`);
                      const dateB = new Date(`${yearB}-${monthB}-${dayB}T${hourB}:${minuteB}`);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((o, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-amber-300/30" : "bg-amber-300"}>
                        <td className="px-5 py-4">{o.infos.name}</td>
                        <td className="px-5 py-4">{o.infos.email}</td>
                        <td className="px-5 py-4">{o.infos.phoneNumber}</td>
                        <td className="px-5 py-4">
                          {user?.qrCodes?.find((qrcode) => qrcode.id === o.infos.qrcodeId)?.name}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Clients Table */}
          <div className="border-2 rounded-lg w-full overflow-x-auto">
            <div className="px-5 flex justify-between items-center py-4">
              <h2 className="text-lg font-bold">Recent clients</h2>
              <button
                onClick={() => router.push("/dashboard/clients")}
                className="rounded-full border-black p-3 py-1 border-2 hover:underline"
              >
                See all
              </button>
            </div>
            <table className="w-full min-w-[45rem] table-auto text-left">
              <thead className="text-slate-500 border-b-2">
                <tr>
                  <th className="px-5 py-2">Name</th>
                  <th className="px-5 py-2">Email</th>
                  <th className="px-5 py-2">Phone</th>
                  <th className="px-5 py-2">Scanned QRCode</th>
                </tr>
              </thead>
              <tbody>
                {!user?.clients.length ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  user?.clients
                    .sort((a, b) => {
                      const [dayA, monthA, yearA, hourA, minuteA] = a.infos.submitDate.split(/[\/: ]/);
                      const [dayB, monthB, yearB, hourB, minuteB] = b.infos.submitDate.split(/[\/: ]/);
                      const dateA = new Date(`${yearA}-${monthA}-${dayA}T${hourA}:${minuteA}`);
                      const dateB = new Date(`${yearB}-${monthB}-${dayB}T${hourB}:${minuteB}`);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((o, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-blue-700/15" : "bg-primary-blue"}>
                        <td className="px-5 py-4">{o.infos.name}</td>
                        <td className="px-5 py-4">{o.infos.email}</td>
                        <td className="px-5 py-4">{o.infos.phoneNumber}</td>
                        <td className="px-5 py-4">
                          {user?.qrCodes?.find((qrcode) => qrcode.id === o.infos.qrcodeId)?.name}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


