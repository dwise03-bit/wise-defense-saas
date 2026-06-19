'use client';

import Link from 'next/link';
import Image from 'next/image';
import MembershipSelector from '@/components/MembershipSelector';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const handleSelectTier = (tierId: string) => {
    console.log('Selected tier:', tierId);
  };

  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray hover:text-neon-red transition-glow">Home</Link>
            <Link href="/auth/login" className="text-gray hover:text-neon-red transition-glow">Log In</Link>
          </nav>
        </div>
      </header>

      {/* Page Heading */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="heading-silver text-4xl mb-4">Choose Your Training Path</h1>
          <p className="text-gray mb-2">
            All plans include access to our video library and community forum
          </p>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <MembershipSelector onSelect={handleSelectTier} />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-12">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t-2 border-neon-red border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-silver font-bold">Feature</th>
                  <th className="text-center py-4 px-4 text-silver font-bold">Starter</th>
                  <th className="text-center py-4 px-4 text-silver font-bold">Pro</th>
                  <th className="text-center py-4 px-4 text-silver font-bold">VIP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray">Sessions per Month</td>
                  <td className="text-center py-4 px-4 text-gray">2</td>
                  <td className="text-center py-4 px-4 text-gray">4</td>
                  <td className="text-center py-4 px-4 text-neon-red">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800 bg-gray-900 bg-opacity-20">
                  <td className="py-4 px-4 text-gray">1-on-1 Coaching</td>
                  <td className="text-center py-4 px-4 text-gray">—</td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray">Video Library</td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-800 bg-gray-900 bg-opacity-20">
                  <td className="py-4 px-4 text-gray">Community Access</td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray">Personalized Drills</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                </tr>
                <tr className="bg-gray-900 bg-opacity-20">
                  <td className="py-4 px-4 text-gray">Priority Support</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 px-4"><Check className="inline text-neon-red" size={20} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-silver text-4xl mb-6">Ready to Start Training?</h2>
          <Link href="/auth/signup">
            <button className="btn-primary">Get Started Today</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
