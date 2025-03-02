import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProduct } from '../../types/product';

export interface CartState {
    items: IProduct[];
    totalPrice: number;
    orderId: string | null;
}

const saveToLocalStorage = (state: CartState) => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
    localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  totalPrice: JSON.parse(localStorage.getItem('totalPrice') || '0'),
  orderId: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price, 0);
      saveToLocalStorage(state);
    },
    removeProduct(state, action: PayloadAction<{ _id: string }>) {
      state.items = state.items.filter(item => item._id !== action.payload._id);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price, 0);
      saveToLocalStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
      saveToLocalStorage(state);
    },
    clickOrderId(state, action: PayloadAction<string>) {
      state.orderId = action.payload;
    },
  },
})

export const { addProduct, removeProduct, clearCart, clickOrderId } = cartSlice.actions;
export default cartSlice.reducer