/**
 * User Profile
 * Individual member stats and achievements
 */

'use client';

import { useEffect, useState } from 'react';

interface UserStats {
  id: number;
  first_name: string;
  email: string;
  tier: string;
  total_points: number;
  streak_current: number;
  streak_longest: number;
  engagement_count: number;
  last_active_date: string;
  viral_posts_count: number;
  total_engagement: number;
  points_rank: number;
  streak_rank: number;
  viral_rank: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, get current user ID from session/auth
        // For now, fetch user with highest points as demo
        const response = await fetch('/api/profile?userId=1');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  if (!stats) {
    return <div className="text-center text-red-600">Profile not found</div>;
  }

  const getAchievements = () => {
    const achievements = [];
    if (stats.streak_current >= 30) achievements.push({ emoji: '🔥', label: 'Inferno', desc: '30-day streak' });
    if (stats.streak_current >= 14) achievements.push({ emoji: '⚡', label: 'Momentum', desc: '2-week streak' });
    if (stats.total_points >= 500) achievements.push({ emoji: '💰', label: 'High Roller', desc: '500+ points' });
    if (stats.viral_posts_count >= 5) achievements.push({ emoji: '📱', label: 'Viral Master', desc: '5 viral posts' });
    if (stats.engagement_count >= 50) achievements.push({ emoji: '🎯', label: 'Engaged', desc: '50+ actions' });
    return achievements;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 p-8 rounded-lg border border-red-600 border-opacity-30 mb-8">
          <h1 className="text-4xl font-bold mb-2">{stats.first_name}</h1>
          <p className="text-gray-400 mb-4">{stats.email}</p>
          <span className={`px-3 py-1 rounded text-sm font-semibold ${
            stats.tier === 'enterprise' ? 'bg-purple-600' :
            stats.tier === 'pro' ? 'bg-blue-600' :
            'bg-gray-600'
          }`}>
            {stats.tier.toUpperCase()} TIER
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-red-600 border-opacity-30">
            <div className="text-3xl font-bold text-red-500">{stats.total_points}</div>
            <div className="text-sm text-gray-400">Points</div>
            <div className="text-xs text-gray-500">Rank #{stats.points_rank}</div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-red-600 border-opacity-30">
            <div className="text-3xl font-bold text-red-500">🔥 {stats.streak_current}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
            <div className="text-xs text-gray-500">Best: {stats.streak_longest}</div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-red-600 border-opacity-30">
            <div className="text-3xl font-bold text-red-500">{stats.engagement_count}</div>
            <div className="text-sm text-gray-400">Engagements</div>
            <div className="text-xs text-gray-500">Actions taken</div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-red-600 border-opacity-30">
            <div className="text-3xl font-bold text-red-500">📱 {stats.viral_posts_count}</div>
            <div className="text-sm text-gray-400">Viral Posts</div>
            <div className="text-xs text-gray-500">{stats.total_engagement} reach</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900 p-6 rounded-lg border border-red-600 border-opacity-30 mb-8">
          <h2 className="text-xl font-semibold mb-4">🏅 Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getAchievements().length > 0 ? (
              getAchievements().map((achievement, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded text-center">
                  <div className="text-3xl mb-2">{achievement.emoji}</div>
                  <div className="font-semibold">{achievement.label}</div>
                  <div className="text-xs text-gray-400">{achievement.desc}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Keep engaging to unlock achievements!</p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-gray-900 p-6 rounded-lg border border-red-600 border-opacity-30">
          <h2 className="text-xl font-semibold mb-4">📊 Activity</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Last Active:</span>
              <span>{new Date(stats.last_active_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Points Rank:</span>
              <span className="font-semibold">#{stats.points_rank}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Streak Rank:</span>
              <span className="font-semibold">#{stats.streak_rank}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Viral Rank:</span>
              <span className="font-semibold">#{stats.viral_rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
