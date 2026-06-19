'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutButtonProps {
  tier: string;
  price: number;
}

export default function CheckoutButton({ tier, price }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to subscribe');
        setLoading(false);
        return;
      }

      // Call create-subscription API
      const response = await fetch('/api/payments/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create subscription');
        setLoading(false);
        return;
      }

      const { subscription_id, client_secret } = await response.json();

      // Load Stripe
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
      if (!stripePublicKey) {
        setError('Stripe is not configured');
        setLoading(false);
        return;
      }

      const stripe = await loadStripe(stripePublicKey);
      if (!stripe) {
        setError('Failed to initialize Stripe');
        setLoading(false);
        return;
      }

      // Redirect to Stripe hosted checkout using subscription ID
      // In production, you would use stripe.confirmCardPayment or stripe.confirmSetupIntent
      // For now, redirect to subscription confirmation (implementation depends on your Stripe setup)
      window.location.href = `/checkout?subscription_id=${subscription_id}&client_secret=${client_secret}`;
      setLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
          loading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Subscribe - $${price}/month`}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
