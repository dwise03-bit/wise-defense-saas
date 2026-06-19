'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  price_cents: number;
  sessions_per_month: number | null;
  features: string[];
}

interface MembershipSelectorProps {
  onSelect?: (tierId: string) => void;
}

export default function MembershipSelector({ onSelect }: MembershipSelectorProps) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/memberships/tiers');
        if (!response.ok) {
          throw new Error('Failed to fetch tiers');
        }
        const data: Tier[] = await response.json();
        setTiers(data);
      } catch (err) {
        console.error('Error fetching tiers:', err);
        setError('Failed to load membership tiers');
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    if (onSelect) {
      onSelect(tierId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-600">Loading membership tiers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedTier === tier.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelectTier(tier.id)}
          >
            {/* Tier Name */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {tier.name}
            </h3>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  ${tier.price}
                </span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="mb-6 space-y-3">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Select Button */}
            <button
              onClick={() => handleSelectTier(tier.id)}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedTier === tier.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {selectedTier === tier.id ? 'Selected' : `Select ${tier.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
