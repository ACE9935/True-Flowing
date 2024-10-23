import { ElementType, ReactNode } from "react";

function AppToast({title,Icon,variant}:{title:string,Icon:ElementType,variant:"SUCCESS"|"ERROR"|"INFO"}) {
    const color=variant === 'SUCCESS' ? 'bg-green-500' :
                variant === 'ERROR' ? 'bg-red-500' :
                variant === 'INFO' ? 'bg-black' :
                'bg-black'; 
    return ( 
        <div className={`p-3 rounded-xl text-white flex gap-3 font-bold ${color}`}><Icon/><p>{title}</p></div>
     );
}

export default AppToast;