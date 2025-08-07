'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function PaymentTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/test');
      const data = await response.json();
      setTestResults({ success: true, data });
    } catch (error) {
      setTestResults({ success: false, error: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  const testCreateOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          currency: 'INR',
          receipt: 'test_order',
        }),
      });
      
      const data = await response.json();
      setTestResults({ success: response.ok, data });
    } catch (error) {
      setTestResults({ success: false, error: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>Payment System Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testAPI} disabled={loading} className="w-full">
            {loading ? 'Testing...' : 'Test API Connection'}
          </Button>
          <Button onClick={testCreateOrder} disabled={loading} variant="outline" className="w-full">
            {loading ? 'Testing...' : 'Test Order Creation'}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            {testResults.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold">Test Successful</div>
                  <pre className="text-sm mt-2 bg-gray-100 p-2 rounded">
                    {JSON.stringify(testResults.data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold">Test Failed</div>
                  <div className="text-sm mt-2">{testResults.error}</div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Setup Required</div>
            <div className="text-sm mt-2 space-y-1">
              <div>1. Copy <code>env.example</code> to <code>.env.local</code></div>
              <div>2. Get Razorpay credentials from <a href="https://dashboard.razorpay.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Razorpay Dashboard</a></div>
              <div>3. Replace placeholder values in <code>.env.local</code></div>
              <div>4. Restart your development server</div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
