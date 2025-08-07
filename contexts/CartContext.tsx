'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem, getCart, addToCart, removeFromCart, updateItemQuantity, clearCart } from '@/lib/cart';

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCartItems: () => void;
  isInCart: (itemId: number) => boolean;
  getItemQuantity: (itemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart());
  }, []);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const updatedCart = addToCart(item);
    setCart(updatedCart);
  };

  const removeItem = (itemId: number) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    const updatedCart = updateItemQuantity(itemId, quantity);
    setCart(updatedCart);
  };

  const clearCartItems = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
  };

  const isInCart = (itemId: number) => {
    return cart.items.some(item => item.id === itemId);
  };

  const getItemQuantity = (itemId: number) => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCartItems,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
