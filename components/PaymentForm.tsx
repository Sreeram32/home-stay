'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PAYMENT_METHODS } from '@/lib/razorpay-client';
import { Check, CreditCard, Smartphone, Building2, Wallet, Calendar, Clock, Banknote, Truck } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: any) => void;
  userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const PAYMENT_ICONS = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
  emi: Calendar,
  paylater: Clock,
  banktransfer: Banknote,
  cod: Truck,
};

export default function PaymentForm({ 
  amount, 
  currency = 'INR', 
  onSuccess, 
  onFailure,
  userDetails 
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [userInfo, setUserInfo] = useState({
    name: userDetails?.name || '',
    email: userDetails?.email || '',
    phone: userDetails?.phone || '',
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `order_${Date.now()}`,
          notes: {
            payment_method: selectedMethod,
            user_name: userInfo.name,
            user_email: userInfo.email,
          },
          prefill: userInfo,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderId(data.order.id);
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      onFailure?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const order = await createOrder();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Sakria Farm and HomeStay',
        description: 'Farm Products & Accommodation',
        image: '/images/garden.jpg',
        order_id: order.id,
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },
        notes: {
          address: 'Sakria Farm and HomeStay, Sustainable Agriculture',
          payment_method: selectedMethod,
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Payment
          </CardTitle>
          <div className="text-center text-gray-600">
            Total Amount: <span className="font-bold text-green-600">{formatAmount(amount)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(PAYMENT_METHODS).map(([key, method]) => {
                const IconComponent = PAYMENT_ICONS[key as keyof typeof PAYMENT_ICONS];
                return (
                  <div
                    key={key}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMethod === key
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMethod(key)}
                  >
                    {selectedMethod === key && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">{formatAmount(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold">{PAYMENT_METHODS[selectedMethod as keyof typeof PAYMENT_METHODS].name}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatAmount(amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || !userInfo.name || !userInfo.email || !userInfo.phone}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          >
            {loading ? 'Processing...' : `Pay ${formatAmount(amount)}`}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Secure payment powered by Razorpay</span>
            </div>
            <p className="mt-2">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 