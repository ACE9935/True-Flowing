"use client"
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import SideBar from "./SideBar";
import { Menu } from "@mui/icons-material";
import { useState } from "react";

function DashBoardLayout({children}:{children:React.ReactNode}) {

    const [open, setOpen] = useState(false);
    const matches = useMediaQuery('(max-width:1000px)');

    const toggleDrawer = (newOpen: boolean) => () => {
     setOpen(newOpen);
    };

    return ( 
        <div className={`${!matches?"flex":""}`}>
            {matches?<Drawer open={open} onClose={toggleDrawer(false)}>
            <SideBar/>
            </Drawer>:<SideBar/>}
            <main className="grow">
                {matches&&<nav className="bg-primary-blue px-4 py-3 flex justify-between items-center">
                    <a href="/"><img width={30} src="/logo.png"/></a>
                    <IconButton onClick={toggleDrawer(true)}><Menu sx={{color:"white"}}/></IconButton>
                    </nav>}
                {children}
            </main>
        </div>
     );
}

export default DashBoardLayout;