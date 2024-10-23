"use client"
import styled from '@emotion/styled'
import resolveConfig from 'tailwindcss/resolveConfig'
import Config from "../../../../../../tailwind.config";
import { HTMLAttributes, InputHTMLAttributes } from "react"; // Correct import
const tailwindConfig=resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as {[key:string]:string};
const primaryBlue = colors["primary-black"];

const StyledInput = styled.input`
   
   border-radius:8px !important;
   outline:1px solid lightgray;
   :hover{
    outline-width:2px
   }
   :focus{
    outline: 2px solid ${primaryBlue || "black"}; 
   }
  
`

export interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: boolean;
    helperText?: string | null;
    
}

function ClientInput({label, error, helperText, ...props}: BasicInputProps) {
    return ( 
        <div className="flex flex-col gap-2">
            <StyledInput
                {...props}
                className={`w-full py-[0.6rem] px-3 !font-semibold transition-all text-sm ${error?"bg-red-50 !outline-red-200 placeholder:text-red-300":""}`} placeholder={label}/>
            <p className="text-red-400 text-xs px-3">{helperText}</p>
        </div>
    );
}

export default ClientInput;
