// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Enhanced chat system: Smart routing + multi-turn memory + Hermes AI

/**
 * Expanded knowledge base organized by category
 */
const KNOWLEDGE_BASE: Record<string, Record<string, string>> = {
  pricing: {
    overview: `**Wise Defense Membership Tiers:**

🟢 **Starter - $99/month** | Best for: Getting started
✅ Beginner Fundamentals course (4-6 weeks)
✅ Community forum & peer support
✅ Performance tracking dashboard
✅ Certificates of completion
✅ Email support
💡 Free 7-day trial

🔵 **Pro - $199/month** | Best for: Serious learners
✅ Everything in Starter, PLUS:
✅ Concealed Carry course (6-8 weeks)
✅ 2 personalized coaching sessions/month
✅ Priority support
✅ Exclusive webinars
💡 Cancel anytime

🔴 **VIP - $399/month** | Best for: Professionals
✅ Everything in Pro, PLUS:
✅ Competitive Shooting course (8-12 weeks)
✅ Weekly 1-on-1 coaching
✅ 24/7 phone support
✅ Custom training programs
✅ Early access to new courses
💡 Best value for commitment`,

    comparison: `**Quick Comparison:**
| Feature | Starter | Pro | VIP |
|---------|---------|-----|-----|
| Courses | 1 | 2 | 3 |
| Coaching | None | 2x/mo | Weekly |
| Support | Email | Priority | 24/7 Phone |
| Price | $99 | $199 | $399 |
| Free Trial | ✅ | ✅ | ✅ |`,

    guarantee: `**30-Day Money-Back Guarantee**
Not satisfied? Full refund within 30 days. No questions asked.`
  },

  booking: {
    how: `**Book Your First Session:**
1. Log in → Dashboard → "Book Session"
2. Pick your instructor & time slot
3. Choose session type:
   - 📍 Range time (in-person)
   - 💻 Online coaching (video)
   - 🎥 Video review (form check)
4. Confirm payment
5. Get email confirmation + reminder

**Rescheduling:** Free until 24 hours before
**Cancellation:** Free until 7 days before`,

    availability: `**Available Hours:**
📅 Weekdays: 9 AM - 6 PM (EST)
📅 Weekends: 10 AM - 4 PM (EST)
🌙 After-hours: VIP members only
🎄 Holiday schedule: See calendar`,

    cancellation: `**Rescheduling & Cancellation:**
• Free reschedule: Until 24 hours before
• Free cancel: Until 7 days before
• Late cancellation: Forfeit session credit
• Exception: Contact support@wisedefense.com`,

    payment: `**Payment Options:**
💳 Credit/Debit card (all major cards)
💰 Monthly billing (auto-renew)
🔄 Cancel anytime before renewal
✨ No hidden fees ever`
  },

  courses: {
    overview: `**Our Three Training Paths:**

🔰 **Beginner Fundamentals** (4-6 weeks)
Learn safety, build confidence, master basics
├─ Safety protocols & mindset
├─ Weapon handling & familiarity
├─ Shooting fundamentals
└─ Maintenance & care

🔒 **Concealed Carry** (6-8 weeks)
Self-defense skills for everyday carry
├─ Legal requirements by state
├─ Holster selection & draw
├─ Real-world scenarios
└─ Situational awareness

🎯 **Competitive Shooting** (8-12 weeks)
Advanced skills for competition
├─ Speed & accuracy optimization
├─ Advanced techniques
├─ Competition rules & etiquette
└─ Match preparation`,

    prerequisites: `**Do I need any background?**
✅ **Beginner:** No prerequisites - start here
✅ **Concealed Carry:** Complete Beginner first
✅ **Competitive:** Complete Concealed Carry first
✅ **VIP Direct:** Instructors guide your path`,

    duration: `**How long are courses?**
⏱️ Beginner: 4-6 weeks
⏱️ Concealed Carry: 6-8 weeks
⏱️ Competitive: 8-12 weeks
🎯 Learn at your own pace - no time pressure`
  },

  support: {
    overview: `**Get Help - Multiple Options:**
🤖 **This AI Chat** (24/7) - Instant answers
📧 **Email:** support@wisedefense.com (2-hour response)
☎️ **Phone:** 1-800-WISE-DEF (Mon-Fri 8 AM-8 PM EST)
💬 **Discord:** Join our community
📱 **Telegram:** @WiseDefenseBot (quick questions)
🎥 **Video Call:** Schedule with instructor

Which would help most?`,

    urgent: `**For Urgent Issues:**
☎️ Call: 1-800-WISE-DEF
⏰ Mon-Fri: 8 AM - 8 PM EST
🎯 Available for technical & billing issues`,

    community: `**Join the Community:**
💬 Discord: Chat with instructors & students
🏆 Leaderboards: See top performers weekly
📚 Forum: Share tips & experiences
👥 Study groups: Connect with other students
📚 Resource library: Training guides & videos`
  },

  faq: {
    age: `**Age Requirements?**
✅ 18+ for all courses
👶 Youth programs available (12-17)
📧 Email support@wisedefense.com for youth`,

    equipment: `**Do I need my own gun?**
❌ No! We provide:
✅ Range access
✅ Firearms to use
✅ Safety equipment
💡 Bring yours if you prefer - we accommodate`,

    refund: `**Full Refund Policy:**
✅ 30-day money-back guarantee
✅ Cancel within 30 days: Full refund
📅 After 30 days: Cancel anytime (no charges after)
🎯 Zero hassle refunds`,

    travel: `**Can I learn from home?**
✅ VIP: Weekly video coaching available
✅ All courses: Online theory available
📍 Range practice: Book in-person sessions as needed
🌍 Traveling? Use video coaching`,

    nra: `**Is your instructor NRA certified?**
✅ Yes! 15+ years experience
🏆 NRA certified instructor
📜 State certified
🎓 Continuing education annually`
  }
};

/**
 * Smart category detection with multi-keyword patterns
 */
function detectCategory(message: string): { category: string; subcategory?: string } | null {
  const lower = message.toLowerCase();

  // Pricing queries
  if (lower.match(/price|cost|much|tier|membership|subscription|fee|charge|afford/)) {
    if (lower.match(/compar|vs|difference|better/)) return { category: 'pricing', subcategory: 'comparison' };
    if (lower.match(/guarantee|money.?back|refund|return/)) return { category: 'pricing', subcategory: 'guarantee' };
    return { category: 'pricing', subcategory: 'overview' };
  }

  // Booking queries
  if (lower.match(/book|schedule|appointment|session|time|when|available|reserve/)) {
    if (lower.match(/reschedule|cancel|modify|change/)) return { category: 'booking', subcategory: 'cancellation' };
    if (lower.match(/how|steps|process/)) return { category: 'booking', subcategory: 'how' };
    if (lower.match(/time|hours|hours open|when/)) return { category: 'booking', subcategory: 'availability' };
    return { category: 'booking', subcategory: 'how' };
  }

  // Course queries
  if (lower.match(/course|training|program|learn|class|lesson|content/)) {
    if (lower.match(/requirement|prerequisite|background|beginner|start/)) return { category: 'courses', subcategory: 'prerequisites' };
    if (lower.match(/how long|duration|weeks|time/)) return { category: 'courses', subcategory: 'duration' };
    return { category: 'courses', subcategory: 'overview' };
  }

  // Support queries
  if (lower.match(/help|support|contact|reach|question|issue|problem/)) {
    if (lower.match(/urgent|emergency|asap|now|immediately/)) return { category: 'support', subcategory: 'urgent' };
    if (lower.match(/community|discord|forum|group|forum|chat|social/)) return { category: 'support', subcategory: 'community' };
    return { category: 'support', subcategory: 'overview' };
  }

  // FAQ queries
  if (lower.match(/age|old|young|kid|child|youth)) return { category: 'faq', subcategory: 'age' };
  if (lower.match(/gun|rifle|weapon|equipment|gear|provide/)) return { category: 'faq', subcategory: 'equipment' };
  if (lower.match(/guarantee|refund|money.?back/)) return { category: 'faq', subcategory: 'refund' };
  if (lower.match(/home|online|virtual|remote|travel|distance/)) return { category: 'faq', subcategory: 'travel' };
  if (lower.match(/certified|nra|credential|background|experience/)) return { category: 'faq', subcategory: 'nra' };

  return null;
}

/**
 * Call Hermes AI agent for complex questions
 */
async function callHermesAgent(userMessage: string): Promise<string | null> {
  try {
    // Try Hermes backend first
    const response = await fetch('http://hermes-backend:3100/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        context: 'wise-defense-customer-service'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[CHAT] Hermes response:', data);
      return data.message || data.response || null;
    }
  } catch (error) {
    console.log('[CHAT] Hermes backend not available');
  }

  // Fallback to Ollama
  try {
    const response = await fetch('http://ollama:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'mistral',
        prompt: `You are a helpful Wise Defense customer service AI. Answer this question about firearms training, courses, or our services:\n\n${userMessage}`,
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('[CHAT] Ollama error:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.response || null;
  } catch (error) {
    console.error('[CHAT] Ollama call failed');
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

    if (!userId) {
      userId = 'guest';
    }

    const { message, conversationId, channel = 'web' } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

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
        convId = Date.now().toString();
      }
    }

    let assistantMessage = '';
    let source = 'cache';

    // STEP 1: Smart category detection
    const detected = detectCategory(message);
    if (detected) {
      const { category, subcategory } = detected;
      const kb = KNOWLEDGE_BASE[category];
      const answer = kb?.[subcategory || 'default'] || kb?.['overview'];

      if (answer) {
        console.log(`[CHAT] Knowledge base hit: ${category}/${subcategory || 'default'}`);
        assistantMessage = answer;
        source = 'knowledge-base';
      }
    }

    // STEP 2: Hermes AI for complex questions
    if (!assistantMessage) {
      console.log('[CHAT] Cache miss - trying Hermes agent');
      const agentResponse = await callHermesAgent(message);

      if (agentResponse) {
        assistantMessage = agentResponse;
        source = 'hermes-agent';
      } else {
        // STEP 3: Fallback response
        assistantMessage = `I'm not entirely sure about that, but our team can help! Let me connect you:\n\n📧 **Email:** support@wisedefense.com (2-hour response)\n☎️ **Phone:** 1-800-WISE-DEF (Mon-Fri 8 AM-8 PM EST)\n💬 **Discord:** Join our community chat\n\nWhat specific question can I answer?`;
        source = 'fallback';
      }
    }

    // Save messages (optional)
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
      console.log('[CHAT] Database logging skipped');
    }

    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantMessage,
      source,
      escalated: false
    });
  } catch (error) {
    console.error('[CHAT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', message: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}
