"use client";

import ClientsTable from "./ClientsTable";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { useUser } from "@/context/authContext";
import ClientsTableSkeleton from "./ClientsTableSkeleton";
import * as XLSX from "xlsx"; // Import SheetJS

function PageContainer({ type, color, lightColor, theme, title, description }: {
    title: string;
    description: string;
    theme: string;
    type: "winners" | "clients";
    color: string;
    lightColor: string;
}) {
    const { user } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const selectedData=type=="clients"?user?.clients:user?.winnerClients

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const getPaginatedData = () => {
        if (!user) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        switch (type) {
            case "clients":
                return user.clients.slice(startIndex, endIndex);
            case "winners":
                return user.winnerClients.slice(startIndex, endIndex);
            default:
                return user.clients.slice(startIndex, endIndex);
        }
    };

    const paginatedData = getPaginatedData();

    // Function to handle Excel export
    const downloadExcel = () => {
        if (!user) return; // Ensure user data is available

        const clientsData = selectedData!.map(client => ({
            name: client.infos.name,
            email: client.infos.email,
            phoneNumber: client.infos.phoneNumber,
            submitDate: client.infos.submitDate,
            ...(type === "winners" ? { prize: client.infos.prize } : {}) // Conditionally add prize
        }));

        const worksheet = XLSX.utils.json_to_sheet(clientsData!);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

        const filename = `${type}-data-${user.name}.xlsx`; // Set the filename
        XLSX.writeFile(workbook, filename);
    };

    return (
        <>
            {user ? (
                <div className="px-6 py-6">
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold pb-2">{title}</h1>
                        <p className="text-slate-600 text-lg">{description}</p>
                    </div>
                    {selectedData?.length?<button onClick={downloadExcel} className="px-4 py-2 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded mb-4">
                        <img width={25} src="/excel.png"/>Download Excel
                    </button>:<></>}
                    <ClientsTable theme={theme} color={color} lightColor={lightColor} type={type} data={paginatedData} startIndex={(currentPage - 1) * itemsPerPage} />
                    <div className="pt-6 flex justify-center">
                        <Pagination
                            count={Math.ceil(user.clients.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            ) : (
                <ClientsTableSkeleton />
            )}
        </>
    );
}

export default PageContainer;

