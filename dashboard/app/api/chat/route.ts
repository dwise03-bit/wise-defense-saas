import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert customer service representative for Wise Defense, a premium firearms training academy.

About Wise Defense:
- NRA Certified instructor with 10+ years experience
- Premium firearms training: Beginner Fundamentals, Concealed Carry, Competitive Shooting
- Three membership tiers: Starter ($99/mo), Pro ($199/mo), VIP ($399/mo)
- Features: Online booking, certificates, leaderboards, achievements, community forum
- Personalized one-on-one coaching available

Your role:
✅ Answer questions about courses, pricing, memberships
✅ Help with booking sessions and account management
✅ Provide training tips and best practices
✅ Explain features like achievements and certificates
✅ Handle refunds and cancellations
❌ For complex issues or payment problems, escalate to human agent

Guidelines:
- Be professional, friendly, and personalized
- Keep responses concise but helpful
- If unsure, say "I'll connect you with our support team"
- For urgent issues, immediately offer escalation
- Always provide next steps`;

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.slice(7);

    let userId: string | null = null;
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationId, channel = 'web' } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const convResult = await query(
        `INSERT INTO conversations (user_id, channel, status, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id`,
        [userId, channel, 'active']
      );
      convId = convResult.rows[0].id;
    }

    // Get conversation history
    const historyResult = await query(
      `SELECT message, role FROM conversation_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC
       LIMIT 20`,
      [convId]
    );

    const history = historyResult.rows.map((row: any) => ({
      role: row.role as 'user' | 'assistant',
      content: row.message
    }));

    // Get user context
    const userResult = await query(
      `SELECT u.first_name, m.tier FROM users u
       LEFT JOIN memberships m ON u.id = m.user_id
       WHERE u.id = $1`,
      [userId]
    );

    let userContext = '';
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      userContext = `\n\nCustomer: ${user.first_name || 'there'} | Tier: ${user.tier || 'free'}`;
    }

    // Build messages for Claude
    const messages = [
      ...history,
      { role: 'user' as const, content: message }
    ];

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + userContext,
      messages: messages
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save messages
    await query(
      `INSERT INTO conversation_messages (conversation_id, role, message, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [convId, 'user', message]
    );

    await query(
      `INSERT INTO conversation_messages (conversation_id, role, message, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [convId, 'assistant', assistantMessage]
    );

    // Check if escalation needed
    const needsEscalation = assistantMessage.toLowerCase().includes('human agent') ||
                           assistantMessage.toLowerCase().includes('support team') ||
                           message.toLowerCase().includes('escalate');

    if (needsEscalation) {
      // Create support ticket
      await query(
        `INSERT INTO support_tickets (conversation_id, user_id, status, priority, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [convId, userId, 'open', 'medium']
      );

      // Update conversation status
      await query(
        `UPDATE conversations SET status = $1 WHERE id = $2`,
        ['escalated', convId]
      );
    }

    return NextResponse.json({
      success: true,
      conversationId: convId,
      message: assistantMessage,
      escalated: needsEscalation
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
