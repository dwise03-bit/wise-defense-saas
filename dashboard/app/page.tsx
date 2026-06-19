'use client';

import Link from 'next/link';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Firearms Training
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            NRA Certified Instructor | Personalized Coaching
          </p>
          <p className="text-lg mb-8 opacity-85">
            Learn from a certified professional with proven results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
                Start Training
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                View Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Wise Defense?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NRA Certified */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                NRA Certified
              </div>
              <p className="text-gray-700">
                Professional-level instruction with verified credentials
              </p>
            </div>

            {/* Personalized */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                Personalized
              </div>
              <p className="text-gray-700">
                Customized learning paths tailored to your goals
              </p>
            </div>

            {/* Results-Focused */}
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                Results-Focused
              </div>
              <p className="text-gray-700">
                Proven track record of student success and confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProof />

      {/* Courses Preview Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Training Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner Fundamentals */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Beginner Fundamentals
              </h3>
              <p className="text-gray-700 mb-4">
                Start your journey safely with core concepts
              </p>
              <p className="text-sm text-gray-600">
                4-6 weeks | 8 sessions
              </p>
            </div>

            {/* Concealed Carry */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Concealed Carry
              </h3>
              <p className="text-gray-700 mb-4">
                Master self-defense and carry techniques
              </p>
              <p className="text-sm text-gray-600">
                6-8 weeks | 12 sessions
              </p>
            </div>

            {/* Competitive Shooting */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Competitive Shooting
              </h3>
              <p className="text-gray-700 mb-4">
                Develop advanced accuracy and speed
              </p>
              <p className="text-sm text-gray-600">
                8-12 weeks | 16 sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Training?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Take a quick assessment to find your perfect training path
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
