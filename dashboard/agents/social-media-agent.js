/**
 * Social Media Posting Agent
 * PM2-managed service that posts generated content to social platforms
 * Runs every 2 hours to batch-post high-quality 2nd Amendment content
 */

const pg = require('pg');
const axios = require('axios');

// Clean HTML entities and heading markup from content
function cleanContent(text) {
  if (!text) return '';
  return text
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<h[1-6][^>]*>/gi, '')
    .replace(/<\/h[1-6]>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Initialize database pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/wisedefense',
  ssl: false,
});

// Agent state tracking
const postalState = {
  isRunning: false,
  lastRun: null,
  postsPublished: 0,
  platformStats: {},
  errors: [],
};

/**
 * Get pending posts for platform
 */
async function getPendingPosts(platform, limit = 5) {
  try {
    const result = await pool.query(
      `SELECT * FROM social_posts_generated
       WHERE platform = $1 AND status = 'pending'
       ORDER BY created_at DESC
       LIMIT $2`,
      [platform, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('[SOCIAL] Error fetching pending posts:', error.message);
    return [];
  }
}

/**
 * Mark post as posted
 */
async function markPostPosted(postId, platform, postUrl) {
  try {
    await pool.query(
      `UPDATE social_posts_generated
       SET status = 'posted', posted_at = NOW(), post_url = $1
       WHERE id = $2 AND platform = $3`,
      [postUrl, postId, platform]
    );
    return true;
  } catch (error) {
    console.error('[SOCIAL] Error marking post:', error.message);
    return false;
  }
}

/**
 * Post to Telegram
 */
async function postToTelegram(post) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChannelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!telegramBotToken || !telegramChannelId) {
    console.log('[SOCIAL] Telegram not configured');
    return null;
  }

  try {
    const cleanedContent = cleanContent(post.content_text);
    const message = `${cleanedContent}\n\n${post.hashtags}`;
    const response = await axios.post(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        chat_id: telegramChannelId,
        text: message,
        parse_mode: 'HTML',
      }
    );
    console.log('[SOCIAL] Posted to Telegram');
    return { platform: 'telegram', status: 'posted', postUrl: `telegram-${response.data.result.message_id}` };
  } catch (error) {
    console.error('[SOCIAL] Telegram error:', error.message);
    return null;
  }
}

/**
 * Post to Discord
 */
async function postToDiscord(post) {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!discordWebhookUrl) {
    console.log('[SOCIAL] Discord not configured');
    return null;
  }

  try {
    const message = {
      content: `${post.content_text}\n\n${post.hashtags}`,
      embeds: [{
        title: 'New 2nd Amendment News',
        description: post.content_text.substring(0, 200),
        color: 15158332,
        fields: [{
          name: 'Call to Action',
          value: post.call_to_action,
        }],
        timestamp: new Date().toISOString(),
      }],
    };

    await axios.post(discordWebhookUrl, message);
    console.log('[SOCIAL] Posted to Discord');
    return { platform: 'discord', status: 'posted', postUrl: 'discord' };
  } catch (error) {
    console.error('[SOCIAL] Discord error:', error.message);
    return null;
  }
}

/**
 * Post content
 */
async function postContent(post) {
  console.log(`[SOCIAL] Processing ${post.platform} post from article ${post.article_id}`);

  let result = null;

  switch (post.platform) {
    case 'telegram':
      result = await postToTelegram(post);
      break;
    case 'discord':
      result = await postToDiscord(post);
      break;
    case 'twitter':
    case 'instagram':
    case 'linkedin':
      // These require API credentials - ready for integration
      result = { platform: post.platform, status: 'ready' };
      console.log(`[SOCIAL] ${post.platform} post ready (awaiting API credentials)`);
      break;
  }

  if (result && result.status === 'posted') {
    await markPostPosted(post.id, post.platform, result.postUrl);
    if (!postalState.platformStats[post.platform]) {
      postalState.platformStats[post.platform] = 0;
    }
    postalState.platformStats[post.platform]++;
    postalState.postsPublished++;
    console.log(`[SOCIAL] ✅ Posted to ${post.platform}`);
  }

  return result;
}

/**
 * Run posting cycle
 */
async function runPostingCycle() {
  if (postalState.isRunning) {
    console.log('[SOCIAL] Cycle running, skipping');
    return;
  }

  postalState.isRunning = true;
  postalState.postsPublished = 0;
  postalState.platformStats = {};
  postalState.errors = [];

  const startTime = Date.now();

  try {
    console.log('[SOCIAL] ========================================');
    console.log('[SOCIAL] Starting social media posting cycle');
    console.log('[SOCIAL] ========================================');

    const platforms = ['twitter', 'instagram', 'linkedin', 'telegram', 'discord'];

    for (const platform of platforms) {
      try {
        const pendingPosts = await getPendingPosts(platform, 3);
        console.log(`[SOCIAL] Found ${pendingPosts.length} pending posts for ${platform}`);

        for (const post of pendingPosts) {
          await postContent(post);
        }
      } catch (error) {
        console.error(`[SOCIAL] ${platform} error:`, error.message);
        postalState.errors.push({ platform, error: error.message });
      }
    }

    const duration = Date.now() - startTime;

    console.log('[SOCIAL] ========================================');
    console.log(`[SOCIAL] Posts published: ${postalState.postsPublished}`);
    Object.entries(postalState.platformStats).forEach(([p, c]) => {
      console.log(`[SOCIAL]   ${p}: ${c}`);
    });
    console.log(`[SOCIAL] Duration: ${duration}ms`);
    console.log(`[SOCIAL] Errors: ${postalState.errors.length}`);
    console.log('[SOCIAL] ========================================');

    postalState.lastRun = new Date();
  } catch (error) {
    console.error('[SOCIAL] Fatal error:', error);
  } finally {
    postalState.isRunning = false;
  }
}

/**
 * Initialize and start
 */
async function start() {
  console.log('[SOCIAL] Social Media Posting Agent starting...');

  try {
    const testResult = await pool.query('SELECT NOW() as now');
    console.log('[SOCIAL] Database connected:', testResult.rows[0].now);

    console.log('[SOCIAL] Running initial posting cycle...');
    await runPostingCycle();

    const POSTING_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours

    setInterval(async () => {
      await runPostingCycle();
    }, POSTING_INTERVAL);

    console.log('[SOCIAL] Agent ready - next posting in 2 hours');
  } catch (error) {
    console.error('[SOCIAL] Startup error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SOCIAL] Shutting down...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SOCIAL] Shutting down...');
  await pool.end();
  process.exit(0);
});

start();
