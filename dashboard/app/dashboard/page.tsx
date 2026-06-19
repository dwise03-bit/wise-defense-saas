'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  name: string;
  tier: string;
}

interface Session {
  id: number;
  date: string;
  time: string;
  type: string;
}

interface Progress {
  total_drills: number;
  completed_drills: number;
  quiz_score: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setUser({
      id: 1,
      email: 'student@example.com',
      name: 'John Doe',
      tier: 'pro',
    });

    fetch('/api/sessions/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSessions(data));

    fetch('/api/students/progress', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gray">Loading...</div>;
  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-gray">Not authenticated</div>;

  const drillPercentage = progress ? (progress.completed_drills / progress.total_drills) * 100 : 0;

  return (
    <main className="bg-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
            }}
            className="text-gray hover:text-neon-red transition-glow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-silver text-3xl mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray mb-6">You're on the <span className="text-neon-red font-bold">{user.tier.toUpperCase()}</span> plan</p>
          <Link href="/booking">
            <button className="btn-primary">Book a Session</button>
          </Link>
        </div>
      </section>

      {/* Main Grid */}
      <section className="bg-black py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="md:col-span-2">
            <h2 className="section-heading mb-6">Upcoming Sessions</h2>
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="card flex justify-between items-center">
                    <div>
                      <p className="heading-silver">{session.date} at {session.time}</p>
                      <p className="text-gray text-sm capitalize">{session.type} session</p>
                    </div>
                    <span className="text-neon-red text-xs font-bold">BOOKED</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray">
                No sessions booked yet. <Link href="/booking" className="text-neon-red hover:underline">Book one now!</Link>
              </p>
            )}
          </div>

          {/* Progress & Quick Links */}
          <div className="space-y-6">
            {/* Progress */}
            {progress && (
              <div className="card">
                <h3 className="heading-silver mb-6 text-lg">Your Progress</h3>
                <div className="mb-6">
                  <p className="text-gray text-sm mb-2">Drills Completed</p>
                  <div className="bg-secondary-black rounded-sm h-4 overflow-hidden">
                    <div
                      className="bg-neon-red h-4 transition-all duration-500"
                      style={{ width: `${drillPercentage}%` }}
                    />
                  </div>
                  <p className="text-gray text-xs mt-2">
                    {progress.completed_drills} / {progress.total_drills} completed
                  </p>
                </div>
                <div>
                  <p className="text-gray text-sm mb-2">Quiz Score</p>
                  <div className="flex items-center gap-2">
                    <span className="heading-silver text-3xl">{progress.quiz_score}%</span>
                    <span className="text-gray text-sm">Great work!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="card">
              <h3 className="heading-silver mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/content" className="text-neon-red hover:underline">View Drills</Link></li>
                <li><Link href="/community" className="text-neon-red hover:underline">Community Forum</Link></li>
                <li><Link href="/dashboard/my-sessions" className="text-neon-red hover:underline">All Sessions</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
