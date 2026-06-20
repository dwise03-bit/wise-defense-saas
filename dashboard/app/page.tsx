'use client';

import Link from 'next/link';
import Image from 'next/image';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gray-900/50 py-5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" priority />
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href="/pricing" className="text-gray hover:text-neon-red transition-glow font-semibold uppercase text-sm tracking-wider">Pricing</Link>
            <Link href="/auth/login" className="text-gray hover:text-neon-red transition-glow font-semibold uppercase text-sm tracking-wider">Log In</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-black py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/hero-vr.webp" alt="VR Training" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-6 animate-fade-in-up">
            <Image src="/badge.png" alt="NRA Certified" width={120} height={120} className="h-24 w-auto mx-auto drop-shadow-lg" />
          </div>
          <h1 className="heading-silver text-7xl mb-4 font-black tracking-tighter">
            Premium Firearms Training
          </h1>
          <p className="text-2xl font-bold text-white mb-3 tracking-wide">
            NRA Certified Instructor
          </p>
          <p className="text-xl text-gray-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Professional-grade firearms training with personalized coaching tailored to your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
      <section className="bg-black py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-heading inline-block text-4xl mb-4">
              Why Choose Wise Defense?
            </h2>
            <p className="text-gray text-lg mt-6 max-w-3xl mx-auto">
              Discover what sets us apart in professional firearms instruction
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Founder Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-red/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <Image src="/founder.webp" alt="Instructor" width={400} height={500} className="rounded-lg shadow-2xl relative z-10" />
            </div>
            {/* Right: Credentials */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="heading-silver text-2xl mb-3">NRA Certified</h3>
                <p className="text-gray text-lg leading-relaxed">
                  Professional-level instruction with verified NRA credentials and years of real-world experience
                </p>
              </div>

              <div className="card">
                <h3 className="heading-silver text-2xl mb-3">Personalized Coaching</h3>
                <p className="text-gray text-lg leading-relaxed">
                  Customized learning paths tailored to your goals, skill level, and training objectives
                </p>
              </div>

              <div className="card">
                <h3 className="heading-silver text-2xl mb-3">Results-Focused Training</h3>
                <p className="text-gray text-lg leading-relaxed">
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
      <section className="bg-black py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-heading inline-block text-4xl mb-4">Training Paths</h2>
            <p className="text-gray text-lg mt-6 max-w-3xl mx-auto">
              Choose the path that matches your goals and experience level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Beginner Fundamentals</h3>
              <p className="text-gray mb-8 text-lg leading-relaxed">
                Start your journey safely with core concepts, safety protocols, and foundational skills
              </p>
              <div className="pt-6 border-t border-neon-red/30">
                <p className="text-sm font-bold text-neon-red tracking-wider uppercase">4-6 weeks | 8 sessions</p>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Concealed Carry</h3>
              <p className="text-gray mb-8 text-lg leading-relaxed">
                Master self-defense techniques, carry methods, and tactical scenarios for real-world readiness
              </p>
              <div className="pt-6 border-t border-neon-red/30">
                <p className="text-sm font-bold text-neon-red tracking-wider uppercase">6-8 weeks | 12 sessions</p>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-silver text-2xl mb-4">Competitive Shooting</h3>
              <p className="text-gray mb-8 text-lg leading-relaxed">
                Develop advanced accuracy, speed, and competition-ready skills with expert coaching
              </p>
              <div className="pt-6 border-t border-neon-red/30">
                <p className="text-sm font-bold text-neon-red tracking-wider uppercase">8-12 weeks | 16 sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-neon-red via-transparent to-transparent blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="heading-silver text-5xl mb-8 font-black">Ready to Start Training?</h2>
          <p className="text-gray mb-12 text-xl leading-relaxed">
            Join hundreds of students who've transformed their skills and confidence with personalized coaching from an NRA-certified instructor
          </p>
          <Link href="/auth/signup">
            <button className="btn-primary inline-block">Get Started Today</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
