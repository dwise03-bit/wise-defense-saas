/**
 * Member Leaderboards
 * Competitive rankings: points, streaks, viral content
 */

'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  id: number;
  first_name: string;
  tier: string;
  total_points?: number;
  engagement_count?: number;
  streak_current?: number;
  streak_longest?: number;
  streak_badge?: string;
  viral_posts?: number;
  total_engagement?: number;
  avg_engagement?: number;
}

type LeaderboardType = 'points' | 'streaks' | 'viral';
type Period = 'all' | 'week' | 'month';

export default function LeaderboardsPage() {
  const [type, setType] = useState<LeaderboardType>('points');
  const [period, setPeriod] = useState<Period>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams();
        params.append('type', type);
        if (type === 'points') {
          params.append('period', period);
        }

        const response = await fetch(`/api/leaderboards?${params}`);
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [type, period]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '•';
  };

  const getTierColor = (tier: string) => {
    if (tier === 'enterprise') return 'text-purple-500';
    if (tier === 'pro') return 'text-blue-500';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">🏆 Member Leaderboards</h1>
      <p className="text-gray-400 mb-8">Compete, engage, and earn recognition</p>

      {/* Type Selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setType('points')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            type === 'points' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          💰 Points
        </button>
        <button
          onClick={() => setType('streaks')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            type === 'streaks' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          🔥 Streaks
        </button>
        <button
          onClick={() => setType('viral')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            type === 'viral' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          📱 Viral
        </button>
      </div>

      {/* Period Selector (for points only) */}
      {type === 'points' && (
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setPeriod('all')}
            className={`px-4 py-2 rounded text-sm ${
              period === 'all' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded text-sm ${
              period === 'month' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded text-sm ${
              period === 'week' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            This Week
          </button>
        </div>
      )}

      {/* Leaderboard */}
      {loading ? (
        <div className="text-center">Loading leaderboard...</div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className="bg-gray-900 p-4 rounded-lg border border-red-600 border-opacity-30 flex items-center justify-between hover:border-opacity-60 transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-2xl w-8">{getMedalEmoji(entry.rank)}</span>
                <div>
                  <div className="font-semibold">{entry.first_name}</div>
                  <span className={`text-sm ${getTierColor(entry.tier)}`}>
                    {entry.tier.toUpperCase()}
                  </span>
                </div>
              </div>

              {type === 'points' && (
                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-500">{entry.total_points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">🔥 {entry.streak_current}</div>
                    <div className="text-xs text-gray-400">streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">💬 {entry.engagement_count}</div>
                    <div className="text-xs text-gray-400">actions</div>
                  </div>
                </div>
              )}

              {type === 'streaks' && (
                <div className="flex gap-8 items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{entry.streak_current}</div>
                    <div className="text-xs text-gray-400">current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{entry.streak_badge}</div>
                    <div className="text-xs text-gray-400">best: {entry.streak_longest}</div>
                  </div>
                </div>
              )}

              {type === 'viral' && (
                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-500">{entry.viral_posts}</div>
                    <div className="text-xs text-gray-400">viral posts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">{entry.total_engagement}</div>
                    <div className="text-xs text-gray-400">total engagement</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">{Math.round(entry.avg_engagement || 0)}</div>
                    <div className="text-xs text-gray-400">avg per post</div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No entries yet. Start engaging to earn a spot!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
