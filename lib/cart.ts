export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  quantity: number;
  organic: boolean;
  inStock: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  const cartData = localStorage.getItem('cart');
  if (!cartData) {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  try {
    const cart = JSON.parse(cartData);
    return {
      items: cart.items || [],
      total: cart.total || 0,
      itemCount: cart.itemCount || 0,
    };
  } catch {
    return { items: [], total: 0, itemCount: 0 };
  }
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
export function addToCart(item: Omit<CartItem, 'quantity'>): Cart {
  const cart = getCart();
  const existingItem = cart.items.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ ...item, quantity: 1 });
  }
  
  const updatedCart = {
    items: cart.items,
    total: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  };
  
  saveCart(updatedCart);
  return updatedCart;
}

// Remove item from cart
export function removeFromCart(itemId: number): Cart {
  const cart = getCart();
  const updatedItems = cart.items.filter(item => item.id !== itemId);
  
  const updatedCart = {
    items: updatedItems,
    total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
  };
  
  saveCart(updatedCart);
  return updatedCart;
}

// Update item quantity
export function updateItemQuantity(itemId: number, quantity: number): Cart {
  const cart = getCart();
  const updatedItems = cart.items.map(item => 
    item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
  ).filter(item => item.quantity > 0);
  
  const updatedCart = {
    items: updatedItems,
    total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
  };
  
  saveCart(updatedCart);
  return updatedCart;
}

// Clear cart
export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0, itemCount: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

// Get cart item count
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.itemCount;
}

// Get cart total
export function getCartTotal(): number {
  const cart = getCart();
  return cart.total;
}
