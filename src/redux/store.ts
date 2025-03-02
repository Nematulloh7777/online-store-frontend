import { configureStore } from '@reduxjs/toolkit'
import products from './slices/productsSlice'
import filter from './slices/filterSlice'
import drawer from './slices/drawerSlice'
import auth from './slices/authSlice'
import cart from './slices//cartSlice'
import { apiSlice } from './slices/api/apiProductsSlice'

export const store = configureStore({
  reducer: {
    products,
    filter,
    drawer,
    auth,
    cart,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch