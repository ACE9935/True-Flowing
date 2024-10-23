import { createSlice } from '@reduxjs/toolkit'
import { configurations } from '@/app-configurations'

const initialState:any={
    name:"",
    type:"Premium",
    redirectoryLink:"",
    correctionLevel:"M",
    darkColor:"#000000",
    lightColor:"#FFFFFF",
    text:"",
    margin:4,
    meta:{
      introductoryText:configurations.client.introductorytext,
      reviewLinks:{google:"",facebook:""},
      spinWheelData:{
        bgColors:['#3e3e3e', '#df3428'],
        textColor:['#ffffff'],
        options:[{
        option:"A",
        size:1,
      },
      {
        option:"B",
        size:1,
      },
      {
        option:"C",
        size:1,
      },
      {
        option:"D",
        size:1,
      }]
    }
  }}
  
  export const QrcodeSlice = createSlice({
    name: 'qr-code',
    initialState:initialState,
    reducers: {
      setBgColorOfQRCodeMetaSpinWheel: (state, action) => {
      const [index,color] = action.payload;
      if (index >= 0 && index < state.meta.spinWheelData.bgColors.length) {
        state.meta.spinWheelData.bgColors[index] = color;
      }
      },
      removeOptionFromQRCodeMetaSpinWheel: (state, action) => {
        const index = action.payload;
        if (index >= 0 && index < state.meta.spinWheelData.options.length) {
            state.meta.spinWheelData.options.splice(index, 1);
        }
      },
      setOptionTextOfQRCodeMetaSpinWheel: (state, action) => {
      const [index, text] = action.payload;
      if (index >= 0 && index < state.meta.spinWheelData.options.length) {
      state.meta.spinWheelData.options[index].option = text;
      }
      },
      addSlotForQRCodeMetaSpinWheel: (state) => {
      state.meta.spinWheelData.options.push({
      option:"",
      size:1,
      })
      },
      setTextColorOfQRCodeMetaSpinWheel: (state, action) => {
      const color = action.payload;
      state.meta.spinWheelData.textColor[0] = color;
      },
      setQRCodeMetaLogo:(state,action)=>({...state,meta:{...state.meta,logoImg:action.payload}}),
      setQRCodeMetaReviewLinks:(state,action)=>({...state,meta:{...state.meta,reviewLinks:action.payload}}),
      setQRCodeMetaDesktopImg:(state,action)=>({...state,meta:{...state.meta,desktopImg:action.payload}}),
      setQRCodeMetaIntroductoryText:(state,action)=>({...state,meta:{...state.meta,introductoryText:action.payload}}),
      resetQRCodeSate:(state,action)=>({...initialState,text:action.payload}),
      setCorrectionLevel:(state,action)=>({...state,correctionLevel:action.payload}),
      setQRCodeName:(state,action)=>({...state,name:action.payload}),
      setQRCodeType:(state,action)=>({...state,type:action.payload}),
      setDarkColor:(state,action)=>({...state,darkColor:action.payload}),
      setLightColor:(state,action)=>({...state,lightColor:action.payload}),
      setQRCodeText:(state,action)=>({...state,text:action.payload}),
      setMargin:(state,action)=>({...state,margin:action.payload}),
      setQRCodeRedicectoryLink:(state,action)=>({...state,redirectoryLink:action.payload}),
      setQRCode:(state,action)=> ({...action.payload})
    },
  })

export const { setQRCode,setQRCodeType, setQRCodeRedicectoryLink, setDarkColor,setLightColor,setMargin,setQRCodeText,setCorrectionLevel,setQRCodeName, resetQRCodeSate,setQRCodeMetaLogo,setQRCodeMetaDesktopImg,setQRCodeMetaIntroductoryText, setQRCodeMetaReviewLinks,setBgColorOfQRCodeMetaSpinWheel,setTextColorOfQRCodeMetaSpinWheel, setOptionTextOfQRCodeMetaSpinWheel, addSlotForQRCodeMetaSpinWheel, removeOptionFromQRCodeMetaSpinWheel } = QrcodeSlice.actions

export default QrcodeSlice.reducer