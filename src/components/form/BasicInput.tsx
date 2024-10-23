"use client"
import { InputProps, TextField } from "@mui/material";
import styled from '@emotion/styled'
import resolveConfig from 'tailwindcss/resolveConfig'
import Config from '../../../tailwind.config'
const tailwindConfig=resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as {[key:string]:string};
const primaryBlue = colors["primary-blue"];

const StyledInput = styled(TextField)`
  input{
   border-radius:10px !important;
   :focus{
    outline: 1.5px solid ${primaryBlue || "black"}; 
   }
  }
`

interface BasicInputProps extends Partial<InputProps> {
    label:string
    error?:boolean 
    helperText?:string | null
}

function BasicInput({label,error,helperText,...props}:BasicInputProps) {
    return ( 
        <StyledInput
        error={error}
        helperText={helperText}
        sx={{
            borderRadius:"20px !important"
        }}
        InputProps={{
            disableUnderline: true,
            sx: { borderRadius: "10px" },
            ...props
          }}
        className=" w-full" label={<p className="text-title-secondary font-semibold">{label}</p>} variant="filled" />
     );
}

export default BasicInput;