# Razorpay Payment Integration Setup

This guide will help you set up Razorpay payment integration with all available payment methods for your Sakria Farm and HomeStay application.

## 🚀 Features

- **All Payment Methods Supported:**
  - 💳 Credit/Debit Cards (Visa, MasterCard, RuPay, American Express)
  - 📱 UPI (Google Pay, PhonePe, Paytm, BHIM)
  - 🏦 Net Banking (All major Indian banks)
  - 👛 Digital Wallets (Paytm, PhonePe, Amazon Pay, Freecharge)
  - 📅 EMI (Credit Card EMI, Debit Card EMI)
  - ⏰ Pay Later (LazyPay, Simpl, ZestMoney)
  - 🏛️ Bank Transfer (NEFT, RTGS, IMPS)
  - 💵 Cash on Delivery

- **Security Features:**
  - Payment signature verification
  - Webhook handling for payment events
  - Secure order creation and verification
  - SSL encryption for all transactions

- **User Experience:**
  - Modern, responsive payment form
  - Real-time payment status updates
  - Multiple payment method selection
  - Order summary and confirmation

## 📋 Prerequisites

1. **Razorpay Account:** Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Node.js & npm:** Ensure you have Node.js installed
3. **Next.js Project:** This integration is built for Next.js 15+

## 🔧 Setup Instructions

### 1. Install Dependencies

The Razorpay package is already installed in your project:

```bash
npm install razorpay
```

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Razorpay Configuration
# Get these from your Razorpay Dashboard: https://dashboard.razorpay.com/

# Test Mode (for development)
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
RAZORPAY_WEBHOOK_SECRET=YOUR_TEST_WEBHOOK_SECRET

# Production Mode (for live payments)
# RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
# RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
# RAZORPAY_WEBHOOK_SECRET=YOUR_LIVE_WEBHOOK_SECRET
```

### 3. Get Razorpay Credentials

1. **Sign up/Login:** Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Get API Keys:** Navigate to Settings → API Keys
3. **Copy Keys:** Copy your Key ID and Key Secret
4. **Test Mode:** Use test keys for development
5. **Live Mode:** Use live keys for production

### 4. Configure Webhooks (Optional but Recommended)

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`, `refund.processed`, `order.paid`
4. Copy the webhook secret to your environment variables

## 🎯 Usage Examples

### 1. Payment Form Component

```tsx
import PaymentForm from '@/components/PaymentForm';

export default function CheckoutPage() {
  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Handle success - redirect, show confirmation, etc.
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    // Handle failure - show error message, retry, etc.
  };

  return (
    <PaymentForm
      amount={2500} // Amount in INR
      currency="INR"
      onSuccess={handlePaymentSuccess}
      onFailure={handlePaymentFailure}
      userDetails={{
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
      }}
    />
  );
}
```

### 2. Payment Button Component

```tsx
import PaymentButton from '@/components/PaymentButton';

export default function ProductCard() {
  return (
    <PaymentButton
      amount={150}
      description="Organic Mangoes"
      onSuccess={(paymentData) => {
        console.log('Payment successful:', paymentData);
      }}
      onFailure={(error) => {
        console.error('Payment failed:', error);
      }}
    >
      Buy Now - ₹150
    </PaymentButton>
  );
}
```

### 3. API Routes Usage

The following API routes are automatically created:

- `POST /api/payment/create-order` - Create a new payment order
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/payment/webhook` - Handle webhook events

## 🔒 Security Features

### Payment Verification

All payments are verified using Razorpay's signature verification:

```typescript
import { verifyPaymentSignature } from '@/lib/razorpay';

const isValid = verifyPaymentSignature({
  razorpay_order_id: 'order_id',
  razorpay_payment_id: 'payment_id',
  razorpay_signature: 'signature',
});
```

### Webhook Security

Webhooks are verified using HMAC SHA256:

```typescript
// Automatically handled in /api/payment/webhook/route.ts
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
  .update(body)
  .digest('hex');
```

## 🎨 Customization

### Styling

The payment components use Tailwind CSS and can be customized:

```tsx
<PaymentForm
  amount={1000}
  className="custom-payment-form"
  // Custom styling
/>
```

### Payment Methods

Supported payment methods are defined in `lib/razorpay.ts`:

```typescript
export const PAYMENT_METHODS = {
  card: { name: 'Credit/Debit Cards', ... },
  upi: { name: 'UPI', ... },
  netbanking: { name: 'Net Banking', ... },
  // ... more methods
};
```

## 🧪 Testing

### Test Cards

Use these test cards for development:

- **Visa:** 4111 1111 1111 1111
- **MasterCard:** 5555 5555 5555 4444
- **RuPay:** 6073 8400 0000 0000

### Test UPI

Use any UPI ID for testing: `test@razorpay`

### Test Net Banking

Select any bank from the dropdown for testing.

## 🚀 Production Deployment

1. **Switch to Live Keys:** Update environment variables with live keys
2. **Update Webhook URL:** Set production webhook URL in Razorpay dashboard
3. **SSL Certificate:** Ensure your domain has SSL certificate
4. **Domain Verification:** Add your domain to Razorpay dashboard
5. **Test Transactions:** Perform test transactions before going live

## 📱 Mobile Responsiveness

The payment components are fully responsive and work on:
- Desktop browsers
- Mobile browsers
- Progressive Web Apps (PWA)

## 🔧 Troubleshooting

### Common Issues

1. **Payment Failed:**
   - Check if Razorpay keys are correct
   - Verify amount is in paise (multiply by 100)
   - Ensure webhook URL is accessible

2. **Signature Verification Failed:**
   - Check if webhook secret is correct
   - Verify request body format
   - Ensure proper HMAC calculation

3. **Order Creation Failed:**
   - Check Razorpay API credentials
   - Verify amount format
   - Check network connectivity

### Debug Mode

Enable debug logging:

```typescript
// In lib/razorpay.ts
console.log('Order creation:', order);
console.log('Payment verification:', paymentData);
```

## 📞 Support

- **Razorpay Documentation:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support:** [https://razorpay.com/support/](https://razorpay.com/support/)
- **API Reference:** [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)

## 🎉 Success!

Your Razorpay integration is now complete with all payment methods supported. Users can pay using:

- Credit/Debit Cards
- UPI
- Net Banking
- Digital Wallets
- EMI
- Pay Later
- Bank Transfer
- Cash on Delivery

The integration includes proper error handling, security verification, and a modern user interface. 