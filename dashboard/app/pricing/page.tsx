'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight } from 'lucide-react';

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState('pro');
  const router = useRouter();

  const handleSelectTier = (tier: string) => {
    router.push(`/auth/signup?tier=${tier}`);
  };

  const tiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      description: 'For beginners building fundamentals',
      features: [
        'Up to 2 sessions per month',
        'Access to video library',
        'Community forum access',
        'Basic progress tracking',
        'Email support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 199,
      description: 'For serious learners advancing their skills',
      featured: true,
      features: [
        'Up to 4 sessions per month',
        ' 1-on-1 coaching sessions',
        'Complete video library',
        'Community forum access',
        'Personalized drills',
        'Priority email support',
        'Progress analytics',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 499,
      description: 'For competitive shooters and serious athletes',
      features: [
        'Unlimited monthly sessions',
        'Unlimited 1-on-1 coaching',
        'Complete video library',
        'Exclusive VIP community',
        'Custom training plans',
        '24/7 priority support',
        'Advanced analytics',
        'Competition prep',
      ],
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Wise Defense
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Home
            </Link>
            <Link href="/booking" className="text-gray-600 hover:text-gray-900 text-sm">
              Book
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900 text-sm">
              Community
            </Link>
            <Link href="/auth/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that fits your training goals. All plans include access to our community and resources.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl transition-all ${
                  tier.featured
                    ? 'ring-2 ring-red-600 shadow-lg scale-105 bg-white'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                <div className="p-8">
                  {tier.featured && (
                    <div className="mb-4 inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <button
                    onClick={() => handleSelectTier(tier.id)}
                    className={`w-full py-3 rounded-full font-semibold transition-all mb-8 ${
                      tier.featured
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Get Started
                  </button>

                  <div className="space-y-4">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Questions?
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan?</h4>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h4>
                <p className="text-gray-600">
                  We offer a 7-day money-back guarantee if you're not satisfied with your first month.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer group rates?</h4>
                <p className="text-gray-600">
                  Yes, we offer discounts for organizations and groups. Contact us for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Start Your Training Today
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join hundreds of students achieving their training goals with Wise Defense.
          </p>
          <Link href="/auth/signup">
            <button className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Begin Free Trial
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
