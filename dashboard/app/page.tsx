'use client';

import Link from 'next/link';
import Image from 'next/image';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" priority />
          </Link>
          <nav className="flex gap-6">
            <Link href="/pricing" className="text-gray hover:text-neon-red transition-glow">Pricing</Link>
            <Link href="/auth/login" className="text-gray hover:text-neon-red transition-glow">Log In</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-black py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/hero-vr.webp" alt="VR Training" fill className="object-cover" priority />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="heading-silver text-6xl mb-6">
            Premium Firearms Training
          </h1>
          <div className="flex justify-center mb-6">
            <Image src="/badge.png" alt="NRA Certified" width={120} height={120} className="h-20 w-auto" />
          </div>
          <p className="text-2xl font-semibold text-white mb-2">
            NRA Certified Instructor
          </p>
          <p className="text-lg text-gray-muted max-w-2xl mx-auto mb-12">
            Professional-grade firearms training with personalized coaching tailored to your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="btn-primary">Start Training</button>
            </Link>
            <Link href="/pricing">
              <button className="btn-secondary">View Plans</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-16">
            Why Choose Wise Defense?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left: Founder Image */}
            <div className="relative">
              <Image src="/founder.webp" alt="Instructor" width={400} height={500} className="rounded-sm shadow-lg" />
            </div>
            {/* Right: Credentials */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="heading-silver text-xl mb-2">NRA Certified</h3>
                <p className="text-gray">
                  Professional-level instruction with verified NRA credentials and years of real-world experience
                </p>
              </div>

              <div className="card">
                <h3 className="heading-silver text-xl mb-2">Personalized Coaching</h3>
                <p className="text-gray">
                  Customized learning paths tailored to your goals, skill level, and training objectives
                </p>
              </div>

              <div className="card">
                <h3 className="heading-silver text-xl mb-2">Results-Focused Training</h3>
                <p className="text-gray">
                  Proven track record of student success, confidence, and skill mastery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Training Paths */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-16">Training Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Beginner Fundamentals</h3>
              <p className="text-gray mb-6">
                Start your journey safely with core concepts, safety protocols, and foundational skills
              </p>
              <p className="text-sm font-semibold text-neon-red">4-6 weeks | 8 sessions</p>
            </div>

            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Concealed Carry</h3>
              <p className="text-gray mb-6">
                Master self-defense techniques, carry methods, and tactical scenarios for real-world readiness
              </p>
              <p className="text-sm font-semibold text-neon-red">6-8 weeks | 12 sessions</p>
            </div>

            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Competitive Shooting</h3>
              <p className="text-gray mb-6">
                Develop advanced accuracy, speed, and competition-ready skills with expert coaching
              </p>
              <p className="text-sm font-semibold text-neon-red">8-12 weeks | 16 sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-silver text-4xl mb-6">Ready to Start Training?</h2>
          <p className="text-gray mb-10">
            Join hundreds of students who've transformed their skills and confidence with personalized coaching
          </p>
          <Link href="/auth/signup">
            <button className="btn-primary">Get Started Today</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
