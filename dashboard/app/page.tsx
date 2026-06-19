'use client';

import Link from 'next/link';
import Image from 'next/image';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <main className="w-full">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" priority />
          </Link>
          <nav className="flex gap-6">
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">Log In</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/hero-vr.webp" alt="VR Training" fill className="object-cover" priority />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium Firearms Training
          </h1>
          <div className="flex justify-center mb-6">
            <Image src="/badge.png" alt="NRA Certified" width={120} height={120} className="h-20 w-auto" />
          </div>
          <p className="text-xl md:text-2xl mb-2 opacity-95 font-semibold">
            NRA Certified Instructor
          </p>
          <p className="text-lg mb-12 opacity-90 max-w-2xl mx-auto">
            Professional-grade firearms training with personalized coaching tailored to your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-white text-blue-900 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition text-lg">
                Start Training
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition text-lg">
                View Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials Section with Founder */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Wise Defense?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left: Founder Image */}
            <div className="relative">
              <Image src="/founder.webp" alt="Instructor" width={400} height={500} className="rounded-lg shadow-lg" />
            </div>
            {/* Right: Credentials */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-2">NRA Certified</h3>
                <p className="text-gray-700">
                  Professional-level instruction with verified NRA credentials and years of real-world experience
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Personalized Coaching</h3>
                <p className="text-gray-700">
                  Customized learning paths tailored to your goals, skill level, and training objectives
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Results-Focused Training</h3>
                <p className="text-gray-700">
                  Proven track record of student success, confidence, and skill mastery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProof />

      {/* Training Paths Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Training Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner Fundamentals */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Beginner Fundamentals
              </h3>
              <p className="text-gray-700 mb-6">
                Start your journey safely with core concepts, safety protocols, and foundational skills
              </p>
              <p className="text-sm font-semibold text-blue-600">
                4-6 weeks | 8 sessions
              </p>
            </div>

            {/* Concealed Carry */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Concealed Carry
              </h3>
              <p className="text-gray-700 mb-6">
                Master self-defense techniques, carry methods, and tactical scenarios for real-world readiness
              </p>
              <p className="text-sm font-semibold text-blue-600">
                6-8 weeks | 12 sessions
              </p>
            </div>

            {/* Competitive Shooting */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Competitive Shooting
              </h3>
              <p className="text-gray-700 mb-6">
                Develop advanced accuracy, speed, and competition-ready skills with expert coaching
              </p>
              <p className="text-sm font-semibold text-blue-600">
                8-12 weeks | 16 sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Training?
          </h2>
          <p className="text-lg mb-10 opacity-95">
            Join hundreds of students who've transformed their skills and confidence with personalized coaching
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-blue-900 font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition text-lg">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
