import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Hybrid approach: Cache + Ollama (completely free)

/**
 * Cached answers for instant response
 * These are pre-written by support team
 */
const ANSWER_CACHE: Record<string, string> = {
  pricing: `Wise Defense offers 3 membership tiers:

**Starter - $99/month**
✅ Beginner Fundamentals course
✅ Community forum access
✅ Performance tracking
✅ Certificate upon completion

**Pro - $199/month**
✅ Everything in Starter, PLUS:
✅ Concealed Carry course
✅ Personalized coaching
✅ Priority support

**VIP - $399/month**
✅ Everything in Pro, PLUS:
✅ Competitive Shooting course
✅ 1-on-1 coaching sessions
✅ Priority phone support
✅ Custom training programs`,

  booking: `**How to Book a Session:**
1. Sign in to your dashboard
2. Go to "Booking"
3. Select your date and time
4. Choose session type (Beginner/Intermediate/Advanced)
5. Click "Confirm Booking"
6. Receive confirmation email

Free reschedule up to 24 hours before!`,

  cancellation: `**Cancellation Policy:**
- Cancel anytime with 7 days notice
- No refund for partial months
- Retain access through end of billing cycle
- No long-term contracts

Contact support@wisedefense.com for special circumstances.`,

  achievements: `**Earn Achievements:**
🏆 First Shot (10 pts) - Complete first drill
🎯 Perfect Accuracy (50 pts) - 100% score
⚡ Speedster (30 pts) - 10 drills
💪 Dedicated (100 pts) - 50 drills
🔥 Week Warrior (75 pts) - 7-day streak
🌟 Unstoppable (200 pts) - 30-day streak
📢 Influencer (25 pts) - Social share
🤝 Recruiter (150 pts) - Refer 5 friends

Compete on real-time leaderboards!`,

  courses: `**Available Courses:**
• Beginner Fundamentals (4-6 weeks)
• Concealed Carry (6-8 weeks)
• Competitive Shooting (8-12 weeks)

All taught by NRA Certified instructor.
Custom programs available for VIP members.`,

  support: `**Getting Help:**
🤖 This AI Chat (24/7)
📧 support@wisedefense.com (2-hour response)
💬 Discord server (community)
📱 Telegram (quick messages)
☎️ 1-800-WISE-DEF (urgent)

Which would you prefer?`
};

/**
 * Detect if question is in cache
 */
function detectCategory(message: string): string | null {
  const lower = message.toLowerCase();

  if (lower.match(/how much|price|cost|tier|membership|fee/)) return 'pricing';
  if (lower.match(/book|session|schedule|when|time|appointment/)) return 'booking';
  if (lower.match(/cancel|refund|stop|unsubscribe/)) return 'cancellation';
  if (lower.match(/achievement|badge|points|leaderboard|rank/)) return 'achievements';
  if (lower.match(/course|training|beginner|concealed|competitive/)) return 'courses';
  if (lower.match(/help|contact|support|email|phone|discord/)) return 'support';

  return null;
}

/**
 * Call Ollama for complex questions
 */
async function callOllama(userMessage: string): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'mistral',
        prompt: `You are a helpful customer service representative for Wise Defense, a firearms training academy.

Answer this customer question briefly and helpfully:
${userMessage}`,
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('Ollama error:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error('Ollama call failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.slice(7);

    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = String(payload.userId);
      }
    }

    // Allow unauthenticated access with guest user ID
    if (!userId) {
      userId = 'guest';
    }

    const { message, conversationId, channel = 'web' } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create conversation (optional - for logging)
    let convId = conversationId;
    if (!convId) {
      try {
        const convResult = await query(
          `INSERT INTO conversations (user_id, channel, status, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING id`,
          [userId, channel, 'active']
        );
        convId = convResult.rows[0].id;
      } catch (dbError) {
        // Database not available - generate local ID
        convId = Date.now().toString();
      }
    }

    let assistantMessage = '';
    let source = 'cache';

    // STEP 1: Check cache for instant response
    const category = detectCategory(message);
    if (category && ANSWER_CACHE[category]) {
      console.log(`[CHAT] Cache hit: ${category}`);
      assistantMessage = ANSWER_CACHE[category];
      source = 'cache';
    } else {
      // STEP 2: Try Ollama for complex questions
      console.log('[CHAT] Cache miss - trying Ollama');
      const ollamaResponse = await callOllama(message);

      if (ollamaResponse) {
        assistantMessage = ollamaResponse;
        source = 'ollama';
      } else {
        // STEP 3: Fallback response
        assistantMessage = `I'm not sure about that. Let me connect you with our support team:

📧 support@wisedefense.com
📱 Telegram: @WiseDefenseBot
☎️ 1-800-WISE-DEF

They'll help you right away!`;
        source = 'fallback';
      }
    }

    // Save messages (optional - for logging)
    try {
      await query(
        `INSERT INTO conversation_messages (conversation_id, sender, content, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [convId, 'user', message]
      );

      await query(
        `INSERT INTO conversation_messages (conversation_id, sender, content, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [convId, 'assistant', assistantMessage]
      );
    } catch (dbError) {
      // Database not available - continue without logging
      console.log('[CHAT] Database logging skipped:', dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    // Check if escalation needed
    const needsEscalation = message.toLowerCase().includes('escalate') ||
                           message.toLowerCase().includes('human') ||
                           message.toLowerCase().includes('agent');

    if (needsEscalation) {
      await query(
        `INSERT INTO support_tickets (conversation_id, user_id, status, priority, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [convId, userId, 'open', 'medium']
      );

      await query(
        `UPDATE conversations SET status = $1 WHERE id = $2`,
        ['escalated', convId]
      );
    }

    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantMessage,
      escalated: needsEscalation,
      source: source
    }, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', message: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.slice(7);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Get conversation history
    const result = await query(
      `SELECT message, role, created_at FROM conversation_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json({
      success: true,
      messages: result.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 });
  }
}
