'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BookingCalendar from '@/components/BookingCalendar';

interface AvailableSession {
  id: number;
  date: string;
  time: string;
  type: string;
  title: string;
  student_ids: number[];
  status: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [booked, setBooked] = useState<number[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/auth/login');
      return;
    }
    setToken(t);
  }, [router]);

  const handleSessionBooked = (session: AvailableSession) => {
    setBooked([...booked, session.id]);
  };

  if (!token) return <div className="min-h-screen bg-black flex items-center justify-center text-gray">Loading...</div>;

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
            <Link href="/pricing" className="text-gray hover:text-neon-red transition-glow">Pricing</Link>
            <Link href="/community" className="text-gray hover:text-neon-red transition-glow">Community</Link>
            <Link href="/leaderboards" className="text-gray hover:text-neon-red transition-glow">Leaderboards</Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="section-heading mb-2">Book Your Training Session</h1>
        </div>
      </section>

      {/* Booking Calendar */}
      <section className="bg-black py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <BookingCalendar onSessionBooked={handleSessionBooked} />
          </div>

          {booked.length > 0 && (
            <div className="mt-8 bg-secondary-black border-l-4 border-neon-red p-6 rounded-sm">
              <h2 className="heading-silver text-lg mb-2">Sessions Booked!</h2>
              <p className="text-gray">You have {booked.length} session(s) scheduled.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
