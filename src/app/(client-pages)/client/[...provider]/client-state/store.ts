import { configureStore } from '@reduxjs/toolkit'
import clientState from './client-state'

export const store = configureStore({
  reducer: {
   client:clientState
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch