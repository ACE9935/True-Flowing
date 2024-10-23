import { configureStore } from '@reduxjs/toolkit'
import qrCodeState from './qr-code-state'

export const store = configureStore({
  reducer: {
   qrCode:qrCodeState
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch