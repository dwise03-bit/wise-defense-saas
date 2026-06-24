'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: 'Tactical Training Holster',
      price: 89.99,
      rating: 4.8,
      image: '/shop-holster.webp'
    },
    {
      id: 2,
      name: 'Premium Ear Protection',
      price: 129.99,
      rating: 4.9,
      image: '/shop-earpro.webp'
    },
    {
      id: 3,
      name: 'Target Practice Ammo (50ct)',
      price: 24.99,
      rating: 4.7,
      image: '/shop-ammo.webp'
    },
    {
      id: 4,
      name: 'Cleaning Kit Pro',
      price: 59.99,
      rating: 4.9,
      image: '/shop-kit.webp'
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
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">
              Training
            </Link>
            <Link href="/auth/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Tactical Gear & Equipment
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Premium firearms training equipment, safety gear, and accessories curated by professionals. Everything you need to train smarter and stay safe.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-gray-200 overflow-hidden hover:border-red-300 hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-64 bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button className="text-red-600 hover:text-red-700 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Training Gear
              </h3>
              <p className="text-gray-600">
                Holsters, targets, range equipment, and training accessories
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safety Equipment
              </h3>
              <p className="text-gray-600">
                Ear protection, eye protection, gloves, and safety gear
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Maintenance
              </h3>
              <p className="text-gray-600">
                Cleaning kits, lubricants, maintenance tools, and supplies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Member Exclusive Discounts
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Wise Defense members receive exclusive discounts on all shop items. Sign up for training to unlock member pricing.
          </p>
          <Link href="/auth/signup">
            <button className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Become a Member
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>&copy; 2026 Wise Defense LLC. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
