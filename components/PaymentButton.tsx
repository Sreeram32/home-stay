'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: any) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  amount,
  currency = 'INR',
  description = 'Farm Products & Accommodation',
  userDetails,
  onSuccess,
  onFailure,
  variant = 'default',
  size = 'default',
  className = '',
  children,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `order_${Date.now()}`,
          notes: {
            description,
            user_name: userDetails?.name,
            user_email: userDetails?.email,
          },
          prefill: userDetails,
        }),
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Sakria Farm and HomeStay',
        description,
        image: '/images/garden.jpg',
        order_id: orderData.order.id,
        prefill: {
          name: userDetails?.name || '',
          email: userDetails?.email || '',
          contact: userDetails?.phone || '',
        },
        notes: {
          address: 'Sakria Farm and HomeStay, Sustainable Agriculture',
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setLoading(false);
          },
        },
        handler: async function(response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              onSuccess?.(verifyData.payment);
            } else {
              onFailure?.(new Error(verifyData.error));
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            onFailure?.(error);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      onFailure?.(error);
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      variant={variant}
      size={size}
      className={`${loading ? 'cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Pay ${formatAmount(amount)}`}
        </>
      )}
    </Button>
  );
} 