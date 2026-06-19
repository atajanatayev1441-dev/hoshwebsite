'use client'

import { createContext, useContext, useReducer } from 'react'

export interface CartItem {
  id: number
  name_ru: string
  name_tk: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: number }
  | { type: 'UPDATE_QTY'; id: number; qty: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = state.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: 'ADD', item }),
        removeItem: (id) => dispatch({ type: 'REMOVE', id }),
        updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
