'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'cancelled' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const subscriptionId = searchParams?.get('subscription_id');
    const clientSecret = searchParams?.get('client_secret');

    if (!subscriptionId || !clientSecret) {
      setStatus('error');
      setMessage('Missing payment information. Please try again.');
      return;
    }

    const timer = setTimeout(() => {
      setStatus('success');
      setMessage('Your subscription is now active!');
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <section className="bg-black py-20 px-4 min-h-[calc(100vh-80px)] flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        {status === 'processing' && (
          <div className="card">
            <div className="mb-8">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-neon-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="heading-silver text-3xl mb-4">Processing Payment</h1>
            <p className="text-gray mb-4">{message}</p>
            <p className="text-gray-muted text-sm">Do not close this page while processing...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="card">
            <div className="mb-8 text-5xl">✓</div>
            <h1 className="heading-silver text-3xl mb-4">Welcome to Premium Training!</h1>
            <p className="text-gray mb-8">
              Your subscription is now active. You have access to all premium features including 1-on-1 coaching, personalized drills, and priority support.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <button className="btn-primary w-full">Go to Dashboard</button>
              </Link>
              <Link href="/booking">
                <button className="btn-secondary w-full">Book a Session</button>
              </Link>
            </div>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="card">
            <h1 className="heading-silver text-3xl mb-4 text-neon-red">Payment Cancelled</h1>
            <p className="text-gray mb-8">Your subscription was not completed. No charges were made.</p>
            <Link href="/pricing">
              <button className="btn-primary w-full">Return to Pricing</button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="card">
            <h1 className="heading-silver text-3xl mb-4 text-neon-red">Payment Error</h1>
            <p className="text-gray mb-8">{message}</p>
            <Link href="/pricing">
              <button className="btn-primary w-full">Try Again</button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <main className="bg-black min-h-screen">
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="text-center py-20 text-gray">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
