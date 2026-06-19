'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingCalendar from '@/components/BookingCalendar';

interface User {
  id: number;
  email: string;
  name: string;
  tier: string;
}

interface BookedSession {
  id: number;
  title: string;
  time: string;
  type: string;
  date: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [sessionBookedMessage, setSessionBookedMessage] = useState('');

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/auth/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleSessionBooked = (session: any) => {
    const newBookedSession: BookedSession = {
      id: session.id,
      title: session.title,
      time: session.time,
      type: session.type,
      date: session.date,
    };

    setBookedSessions((prev) => [newBookedSession, ...prev]);
    setSessionBookedMessage('Session booked successfully!');

    setTimeout(() => {
      setSessionBookedMessage('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Wise Defense Training</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/auth/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Book Your Training Session</h2>
          <p className="mt-2 text-gray-600">
            Select a date and book from available sessions below
          </p>
        </div>

        {/* Success Message Area */}
        {sessionBookedMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {sessionBookedMessage}
          </div>
        )}

        {/* Booked Sessions Count */}
        {bookedSessions.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-medium">
              You have booked {bookedSessions.length} session{bookedSessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <BookingCalendar onSessionBooked={handleSessionBooked} />
            </div>
          </div>

          {/* Booked Sessions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">My Booked Sessions</h3>

              {bookedSessions.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  No sessions booked yet. Select a date and book a session to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {bookedSessions.map((session) => (
                    <div
                      key={`${session.id}-${session.date}`}
                      className="border rounded p-3 bg-gray-50"
                    >
                      <p className="font-medium text-sm text-gray-900">{session.date}</p>
                      <p className="text-sm text-gray-600">{session.time}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">
                        {session.type.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
