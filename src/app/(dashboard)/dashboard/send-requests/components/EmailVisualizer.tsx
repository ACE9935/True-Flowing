import { Email } from "@mui/icons-material";
import { EmailInterface } from "@/types";

function EmailVisualizer({email}:{email:EmailInterface}) {
    return ( 
        <div className="overflow-hidden rounded-3xl w-full max-w-[16rem] aspect-[0.5] flex flex-col border-2 border-primary-color">
            <div className="bg-primary-blue font-bold text-white p-4 border-b-2 border-primary-color flex items-center gap-3"><Email/>{email.sender}</div>
         <div className="p-4">
         <div dangerouslySetInnerHTML={{ __html: email.email }}/>
         </div>
        </div>
     );
}

export default EmailVisualizer;