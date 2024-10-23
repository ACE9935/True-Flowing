"use client"
import PhoneInputRaw from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export interface PhoneInputProps {
    label: string;
    error?: boolean;
    helperText?: string | null;
    onChange:(x:string)=>void
    value:string
}

function PhoneInput({label,error,helperText,onChange,value}:PhoneInputProps) {
    
    return ( 
        <div className="flex flex-col gap-2">
        <PhoneInputRaw
            placeholder={label}
            country={"us"}
            inputStyle={{
               borderRadius:"8px !important",
               outline:"1px solid lightgray",
               height:"2.45rem",
               border:"none"
            }}
            onChange={onChange}
            value={value}
            inputClass={`!w-full font-semibold transition-all !text-sm ${error?"!bg-red-50 !outline-red-200 placeholder:text-red-300":""}`}
            />
            <p className="text-red-400 text-xs px-3">{helperText}</p>
            </div>
     );
}

export default PhoneInput;