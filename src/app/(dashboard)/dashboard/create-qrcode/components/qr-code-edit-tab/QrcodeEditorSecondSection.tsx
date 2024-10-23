"use client";
import ClientFormInstance from "./ClientFormInstance";
import { TransitionalComponent } from "./QrcodeEditor";

function QrcodeEditorSecondSection({ handlerForward, handlerPrevious }: TransitionalComponent) {

    return ( 
        <div className="w-full max-w-[32rem] py-4">
            <div className="pb-4">
                <h2 className="text-2xl font-bold pb-1">Edit Your Review Link</h2>
                <p className="text-slate-600">This is the link your clients will visit to leave you a review. Customize the page by changing the text and images.</p>
            </div>
            <ClientFormInstance handlerForward={handlerForward} handlerPrevious={handlerPrevious}/>
        </div>
    );
}

export default QrcodeEditorSecondSection;
