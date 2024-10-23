'use client';
import { createTheme, Shadows } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary:{
        main:'rgb(0,0,0)',
        light:'rgb(200,200,200)'
      },

    },
    shadows: Array(25).fill('none') as Shadows,
    components: {
      /*MuiListItemButton: {
        styleOverrides:{
         root:{'fontWeight':'bold'}
        }
   }*/
  }
  });

  export default theme;