import { configurations } from "@/app-configurations";
import { HTMLAttributes } from "react";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  variant:"DARK"|"LIGHT"
  size?:number
}

function AppSpinner({variant,size,...props}:SpinnerProps) {
 
    return ( 
        <div {...props}>{variant=="DARK"?
          <img width={size} height={size} src={configurations.darkSpinner}/>:
          variant=="LIGHT"?
          <img width={size} height={size} src={configurations.lightSpinner}/>:
          <></>
          }</div>
     );
}

export default AppSpinner;