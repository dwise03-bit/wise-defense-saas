'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Plus, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredThreads = threads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Wise Defense
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/leaderboards" className="text-sm text-gray-600 hover:text-gray-900">
              Leaderboards
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Community</h1>
          </div>
          <p className="text-lg text-gray-600">
            Connect with other students, share experiences, and learn together.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search & New Thread */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Discussion
          </button>
        </div>

        {/* New Thread Form */}
        {showNewThread && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Start a New Discussion</h2>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <input
                type="text"
                placeholder="Discussion Title"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-red-600"
                required
              />
              <textarea
                placeholder="What would you like to discuss?"
                value={newThread.description}
                onChange={(e) => setNewThread({ ...newThread, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-red-600 h-32"
                required
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Post Discussion
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewThread(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Threads List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading discussions...</p>
          </div>
        ) : filteredThreads.length > 0 ? (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {thread.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {thread.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(thread.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {thread.post_count} replies
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No discussions yet. Be the first to start one!</p>
            <button
              onClick={() => setShowNewThread(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Start Discussion
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
