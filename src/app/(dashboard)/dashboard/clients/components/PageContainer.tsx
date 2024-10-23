"use client"

import ClientsTable from "./ClientsTable";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { useUser } from "@/context/authContext";
import ClientsTableSkeleton from "./ClientsTableSkeleton";

function PageContainer({type,color,lightColor,theme,title,description}:{title:string,description:string,theme:string,type:"winners"|"clients",color:string,lightColor:string}) {

    const {user}=useUser()
    const [data,setData]=useState();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const getPaginatedData = () => {
        if (!user) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        switch(type){
            case "clients":
                return user.clients.slice(startIndex, endIndex);
            case "winners":
                return user.winnerClients.slice(startIndex, endIndex);
            default:
                return user.clients.slice(startIndex, endIndex);
                break;
        }
    };

    const paginatedData = getPaginatedData();

    return (
        <>
            {user?(
                <div className="px-6 py-6">
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold pb-2">{title}</h1>
                        <p className="text-slate-600 text-lg">
                            {description}
                        </p>
                    </div>
                    <ClientsTable theme={theme} color={color} lightColor={lightColor} type={type} data={paginatedData} startIndex={(currentPage - 1) * itemsPerPage} />
                    <div className="pt-6 flex justify-center">
                        <Pagination
                            count={Math.ceil(user.clients.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            ):<ClientsTableSkeleton/>}
        </>
    );
}

export default PageContainer;