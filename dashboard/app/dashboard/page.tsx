'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SessionCard from '@/components/SessionCard';
import ProgressBar from '@/components/ProgressBar';

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
  status: string;
  title?: string;
  description?: string;
}

interface Progress {
  total_drills: number;
  completed_drills: number;
  quiz_score: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check for token and user in localStorage
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          router.push('/auth/login');
          return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);

        // Fetch sessions
        const sessionsRes = await fetch('/api/sessions/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setSessions(sessionsData.slice(0, 5)); // Limit to first 5 sessions
        } else if (sessionsRes.status !== 401) {
          console.error('Failed to fetch sessions');
        }

        // Fetch progress
        const progressRes = await fetch('/api/students/progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        } else if (progressRes.status !== 401) {
          console.error('Failed to fetch progress');
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('Failed to load dashboard');
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Wise Defense Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600 mb-4">
            You're on the <span className="font-semibold capitalize">{user.tier}</span> plan
          </p>

          <Link
            href="/booking"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Book a Session
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sessions Column (2 cols on md) */}
          <div className="md:col-span-2">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Upcoming Sessions
              </h3>

              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No upcoming sessions booked</p>
                  <Link
                    href="/booking"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Book your first session
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/drills"
                  className="block text-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <p className="font-medium text-gray-900">View Drills</p>
                  <p className="text-sm text-gray-600">Practice your skills</p>
                </Link>
                <Link
                  href="/community"
                  className="block text-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <p className="font-medium text-gray-900">Community Forum</p>
                  <p className="text-sm text-gray-600">Connect with others</p>
                </Link>
                <Link
                  href="/sessions"
                  className="block text-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <p className="font-medium text-gray-900">All Sessions</p>
                  <p className="text-sm text-gray-600">View all available</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Progress Sidebar (1 col on md) */}
          <div>
            {progress && <ProgressBar progress={progress} />}
          </div>
        </div>
      </main>
    </div>
  );
}
