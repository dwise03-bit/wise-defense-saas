'use client';

import Link from 'next/link';
import Image from 'next/image';
import MembershipSelector from '@/components/MembershipSelector';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const handleSelectTier = (tierId: string) => {
    console.log('Selected tier:', tierId);
  };

  const comparisonFeatures = [
    {
      name: 'Sessions per Month',
      starter: '2',
      pro: '4',
      vip: 'Unlimited'
    },
    {
      name: '1-on-1 Coaching',
      starter: false,
      pro: true,
      vip: true
    },
    {
      name: 'Video Library',
      starter: true,
      pro: true,
      vip: true
    },
    {
      name: 'Community Access',
      starter: true,
      pro: true,
      vip: true
    },
    {
      name: 'Personalized Drills',
      starter: false,
      pro: true,
      vip: true
    },
    {
      name: 'Priority Support',
      starter: false,
      pro: false,
      vip: true
    },
    {
      name: 'Custom Learning Plan',
      starter: false,
      pro: false,
      vip: true
    },
    {
      name: 'Exclusive VIP Content',
      starter: false,
      pro: false,
      vip: true
    }
  ];

  return (
    <main className="w-full">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">Log In</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Training Path
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            All plans include access to our video library and community forum
          </p>
        </div>
      </section>

      {/* Membership Selector Component */}
      <section className="bg-gray-50 py-12 px-4">
        <MembershipSelector onSelect={handleSelectTier} />
      </section>

      {/* Comparison Table Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Detailed Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    Pro
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">
                    VIP
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {feature.name}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">
                      {typeof feature.starter === 'string' ? (
                        <span>{feature.starter}</span>
                      ) : feature.starter ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">
                      {typeof feature.pro === 'string' ? (
                        <span>{feature.pro}</span>
                      ) : feature.pro ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">
                      {typeof feature.vip === 'string' ? (
                        <span>{feature.vip}</span>
                      ) : feature.vip ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Choose your plan and begin your firearms training today
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
              Start Your Training Journey
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
