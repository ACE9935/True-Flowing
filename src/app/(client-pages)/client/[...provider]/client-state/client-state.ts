import { createSlice } from '@reduxjs/toolkit'
import { ClientPageState, QRCode } from '@/types'
import generateRandomId from '@/utils/generateRandomId'

const initialState:ClientPageState={
    providerId:null,
    providerName:null,
    client:{
        infos:{
            id:"",
            name:"",
            email:"",
            phoneNumber:"",
            submitDate:"",
            qrcodeId:""
        }
    },
    qrCode:null
}
  
  export const ClientPageSlice = createSlice({
    name: 'client-page',
    initialState:initialState,
    reducers: {
        setSavedClient:(state,action)=>({...state,client:{infos:{...action.payload}}}),
        setProviderId:(state,action)=>({...state,providerId:action.payload}),
        setProviderName:(state,action)=>({...state,providerName:action.payload}),
        setClientId:(state,action)=>{state.client.infos.id=action.payload},
        setQRCode:(state,action)=>({...state,qrCode:action.payload}),
        setClientName:(state,action)=>{state.client.infos.name=action.payload},
        setClientEmail:(state,action)=>{state.client.infos.email=action.payload},
        setClientPhoneNumber:(state,action)=>{state.client.infos.phoneNumber=action.payload},
        setQRCodeId:(state,action)=>{state.client.infos.qrcodeId=action.payload},
        setSubmitDate:(state,action)=>{state.client.infos.submitDate=action.payload},
    },
  })

export const { setProviderId,setQRCode,setSavedClient,setProviderName, setClientId, setClientEmail,setClientPhoneNumber,setClientName,setQRCodeId,setSubmitDate } = ClientPageSlice.actions

export default ClientPageSlice.reducer