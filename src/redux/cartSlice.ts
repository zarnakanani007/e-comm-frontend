import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  _id: string
  image: string
  name: string
  price: number
  quantity: number
  category?:string
}

interface CartState {
  items: CartItem[]
}

// Load from LocalStorage
const savedCart = localStorage.getItem('cartItems')
const initialState: CartState = {
  items: savedCart ? JSON.parse(savedCart) : []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
   addToCart: (state, action: PayloadAction<CartItem>) => {
  const existing = state.items.find(item => item._id === action.payload._id);
  const qty = Number(action.payload.quantity) || 1; // default 1
  if (existing) {
    existing.quantity += qty;
  } else {
    state.items.push({ ...action.payload, quantity: qty });
  }
  localStorage.setItem('cartItems', JSON.stringify(state.items));
},

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.setItem('cartItems', JSON.stringify([]))
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i._id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity) //  Ensure min 1
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    }
  }
})

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions
export default cartSlice.reducer
