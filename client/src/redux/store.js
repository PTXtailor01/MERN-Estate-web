import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    (store) => (next) => (action) => {
      console.log('Action dispatched:', action);
      next(action);
    },
  ],
})