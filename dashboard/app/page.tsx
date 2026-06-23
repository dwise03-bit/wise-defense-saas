'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Shield, Users, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  const [showTierModal, setShowTierModal] = useState(false);
  const router = useRouter();

  const handleTierSelect = (tier: string) => {
    setShowTierModal(false);
    router.push(`/auth/signup?tier=${tier}`);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Wise Defense
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">
              Pricing
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Premium Firearms Training
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Learn from an NRA-certified instructor. Personalized coaching designed to elevate your skills, confidence, and safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <button className="btn-primary text-base px-8 py-3">
                Start Training
              </button>
            </Link>
            <button
              onClick={() => setShowTierModal(true)}
              className="btn-secondary text-base px-8 py-3"
            >
              Explore Plans
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="/hero-vr.webp"
              alt="Premium Training"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-16">
            Why Wise Defense
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                NRA Certified
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Learn from a professional instructor with verified credentials and years of real-world experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Personalized Coaching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Customized training paths tailored to your goals, skill level, and learning pace.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Proven Results
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress with measurable milestones and join hundreds of successful students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Paths */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-16">
            Training Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Path 1 */}
            <div className="card group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Beginner Fundamentals
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Master the essentials with core concepts, safety protocols, and foundational techniques.
              </p>
              <p className="text-sm text-gray-500 font-medium">4-6 weeks • 8 sessions</p>
            </div>

            {/* Path 2 */}
            <div className="card group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Concealed Carry
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Learn advanced techniques, carry methods, and real-world tactical scenarios.
              </p>
              <p className="text-sm text-gray-500 font-medium">6-8 weeks • 12 sessions</p>
            </div>

            {/* Path 3 */}
            <div className="card group hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                Competitive Shooting
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Develop advanced accuracy, speed, and competition-ready skills with expert coaching.
              </p>
              <p className="text-sm text-gray-500 font-medium">8-12 weeks • 16 sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-heading mb-6">
            Ready to Elevate Your Skills?
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join hundreds of students who've transformed their confidence and competence through personalized training.
          </p>
          <Link href="/auth/signup">
            <button className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Start Your Journey
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/community" className="hover:text-gray-900">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Training</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/booking" className="hover:text-gray-900">Book Session</Link></li>
                <li><Link href="/leaderboards" className="hover:text-gray-900">Leaderboards</Link></li>
                <li><Link href="/auth/login" className="hover:text-gray-900">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Discord</a></li>
                <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-900">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 Wise Defense LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
