'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Thread {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  post_count: number;
}

export default function CommunityPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', description: '' });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      router.push('/auth/login');
      return;
    }
    setToken(t);
    fetchThreads();
  }, [router]);

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/community/threads');
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newThread.title || !newThread.description) return;

    try {
      const response = await fetch('/api/community/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newThread),
      });

      if (response.ok) {
        setNewThread({ title: '', description: '' });
        setShowNewThread(false);
        fetchThreads();
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  return (
    <main className="bg-black min-h-screen">
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo-w2.png" alt="Wise Defense" width={160} height={50} className="h-12 w-auto" />
          </Link>
          <nav className="flex gap-6">
            <Link href="/dashboard" className="text-gray hover:text-neon-red transition-glow">
              Dashboard
            </Link>
            <Link href="/booking" className="text-gray hover:text-neon-red transition-glow">
              Booking
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="heading-silver text-4xl">Community Forum</h1>
            <button
              onClick={() => setShowNewThread(!showNewThread)}
              className="btn-primary"
            >
              {showNewThread ? 'Cancel' : 'New Thread'}
            </button>
          </div>

          {showNewThread && (
            <div className="card mb-8">
              <h2 className="heading-silver text-xl mb-4">Start a New Discussion</h2>
              <form onSubmit={handleCreateThread} className="space-y-4">
                <input
                  type="text"
                  placeholder="Thread Title"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full"
                  required
                />
                <textarea
                  placeholder="Describe your topic..."
                  value={newThread.description}
                  onChange={(e) => setNewThread({ ...newThread, description: e.target.value })}
                  className="w-full"
                  rows={4}
                  required
                />
                <button type="submit" className="btn-primary">
                  Create Thread
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-gray text-center py-12">Loading threads...</div>
          ) : threads.length === 0 ? (
            <div className="text-gray text-center py-12">
              No discussions yet. Be the first to start one!
            </div>
          ) : (
            <div className="space-y-4">
              {threads.map((thread) => (
                <Link key={thread.id} href={`/community/${thread.id}`}>
                  <div className="card cursor-pointer hover:shadow-lg transition">
                    <h3 className="heading-silver text-lg mb-2">{thread.title}</h3>
                    <p className="text-gray mb-3">{thread.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-muted">
                        {new Date(thread.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-neon-red font-semibold">
                        {thread.post_count} replies
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
