
import { alpha, styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import resolveConfig from 'tailwindcss/resolveConfig';
import Config from "../../../../../../../tailwind.config";
const tailwindConfig=resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as {[key:string]:string};
const primaryBlue = colors["primary-blue"];

export const QrcodeSwitch= styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: "#97a2ff !important",
      '&:hover': {
        backgroundColor: alpha("#97a2ff", theme.palette.action.hoverOpacity),
      },
    },
    '.MuiSwitch-thumb':{
        backgroundColor: "#97a2ff",
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: "#97a2ff !important",
    },
  }));