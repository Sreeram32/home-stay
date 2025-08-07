import Razorpay from 'razorpay';

// Initialize Razorpay instance only on server side
let razorpay: Razorpay | null = null;

if (typeof window === 'undefined') {
  // Server-side initialization
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export { razorpay };

// Create a new order
export async function createOrder(params: any) {
  if (!razorpay) {
    throw new Error('Razorpay is not initialized. This function should only be called on the server side.');
  }
  
  try {
    const order = await razorpay.orders.create({
      amount: params.amount * 100, // Convert to paise
      currency: params.currency || 'INR',
      receipt: params.receipt || `order_${Date.now()}`,
      notes: params.notes || {},
      partial_payment: params.partial_payment || false,
    });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Verify payment signature
export function verifyPaymentSignature(params: any): boolean {
  const crypto = require('crypto');
  const text = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');
  
  return signature === params.razorpay_signature;
}

// Get payment details
export async function getPaymentDetails(paymentId: string) {
  if (!razorpay) {
    throw new Error('Razorpay is not initialized. This function should only be called on the server side.');
  }
  
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
}

// Get order details
export async function getOrderDetails(orderId: string) {
  if (!razorpay) {
    throw new Error('Razorpay is not initialized. This function should only be called on the server side.');
  }
  
  try {
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}

// Refund payment
export async function refundPayment(paymentId: string, amount?: number, notes?: Record<string, string>) {
  if (!razorpay) {
    throw new Error('Razorpay is not initialized. This function should only be called on the server side.');
  }
  
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined, // Convert to paise
      notes: notes || {},
    });
    return refund;
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
} 