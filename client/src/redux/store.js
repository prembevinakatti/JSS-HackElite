import { configureStore } from '@reduxjs/toolkit'
import authslice from './authslice'
export const store = configureStore({
  reducer: {
    auth:authslice,
  }
})