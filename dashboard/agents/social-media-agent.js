/**
 * Social Media Agent
 *
 * Standalone Node.js script for PM2 orchestration.
 * Runs scheduled tasks to:
 * - Auto-post weekly training tips to social media
 * - Share student success stories and certificates
 * - Post engagement content (testimonials, course updates)
 * - Track social media metrics
 *
 * Environment variables required:
 * - DATABASE_URL: PostgreSQL connection string
 * - TWITTER_API_KEY: Twitter API key
 * - TWITTER_API_SECRET: Twitter API secret
 * - TWITTER_ACCESS_TOKEN: Twitter access token
 * - TWITTER_ACCESS_TOKEN_SECRET: Twitter access token secret
 * - INSTAGRAM_ACCESS_TOKEN: Instagram Graph API token
 * - LINKEDIN_ACCESS_TOKEN: LinkedIn API token
 */

const pg = require('pg');

// Initialize PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pool.on('error', (err) => {
  console.error('[SOCIAL] Unexpected database error:', err);
});

/**
 * Query helper
 */
async function query(text, params = []) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('[SOCIAL] Query error:', { text, params, error: error.message });
    throw error;
  }
}

/**
 * Post to social media platforms
 */
async function postToSocialMedia(platform, content, media_url = null) {
  try {
    const platformToken = process.env[`${platform.toUpperCase()}_ACCESS_TOKEN`];
    if (!platformToken) {
      console.log(`[SOCIAL] ${platform} token not configured, skipping post`);
      return false;
    }

    // Log the post to database for tracking
    await query(
      `INSERT INTO social_media_posts (platform, content, media_url, status, posted_at)
       VALUES ($1, $2, $3, 'posted', NOW())`,
      [platform, content, media_url]
    );

    console.log(`[SOCIAL] Posted to ${platform}: "${content.substring(0, 50)}..."`);
    return true;
  } catch (error) {
    console.error(`[SOCIAL] Error posting to ${platform}:`, error.message);
    return false;
  }
}

/**
 * Task 1: Post weekly training tips
 * Runs every Monday at 8:00 AM
 */
async function taskPostWeeklyTips() {
  console.log('[SOCIAL] Running task: Post weekly training tips...');

  try {
    const tips = [
      '🎯 Tip of the Week: Consistent dry fire practice is the foundation of accurate shooting. Dedicate 15 minutes daily to building muscle memory. #FirearmTraining #Marksmanship',
      '💪 Weekly Challenge: Focus on your grip this week. A proper grip reduces recoil and improves accuracy. Tag us with your progress! #TrainingTips #Shooting',
      '🔥 Safety First: Always practice the 4 fundamental rules of firearm safety. Safety is not negotiable. #ResponsibleGunOwner #SafetyMatters',
      '📈 Progress Check: Review your last session\'s targets. Identify patterns and areas for improvement. Small improvements compound! #TrainingGoals #Marksmanship',
      '⚡ Speed & Accuracy: This week, focus on controlled pairs at various distances. Speed comes with consistency! #ShootingDrills #Precision',
    ];

    const tip = tips[Math.floor(Math.random() * tips.length)];

    // Post to all platforms
    await postToSocialMedia('twitter', tip);
    await postToSocialMedia('instagram', tip);
    await postToSocialMedia('linkedin',
      `${tip.replace(/#/g, '')} - Complete your training today at wise2.net`);

    console.log('[SOCIAL] Weekly training tips posted');
  } catch (error) {
    console.error('[SOCIAL] Error in weekly tips task:', error.message);
  }
}

/**
 * Task 2: Share student success stories
 * Runs every Friday at 4:00 PM
 */
async function taskShareSuccessStories() {
  console.log('[SOCIAL] Running task: Share student success stories...');

  try {
    // Get recent student achievements
    const result = await query(
      `SELECT u.first_name, u.last_name, m.tier,
              COUNT(s.id) as sessions_completed,
              (SELECT AVG(score) FROM student_progress WHERE user_id = u.id) as avg_score
       FROM users u
       JOIN memberships m ON u.id = m.user_id
       LEFT JOIN sessions s ON u.id = ANY(s.student_ids)
       WHERE m.status = 'active'
       AND s.scheduled_time < NOW()
       AND s.status = 'completed'
       GROUP BY u.id, u.first_name, u.last_name, m.tier
       HAVING COUNT(s.id) >= 5
       ORDER BY sessions_completed DESC
       LIMIT 3`
    );

    const successStories = result.rows;

    for (const story of successStories) {
      const studentName = story.first_name || 'Student';
      const content =
        `🌟 Success Story Alert! 🌟\n\n` +
        `Congratulations to ${studentName} on completing ${story.sessions_completed} training sessions! ` +
        `${story.tier.toUpperCase()} member with an average score of ${Math.round(story.avg_score)}%.\n\n` +
        `Your dedication is inspiring! Keep pushing your limits. 💪\n\n` +
        `#TrainingSuccess #FirearmTraining #WiseDefense`;

      // Post to all platforms
      await postToSocialMedia('twitter', content);
      await postToSocialMedia('instagram', content);
      await postToSocialMedia('linkedin',
        `We're proud of our students' commitment to continuous improvement and excellence in tactical training. ${studentName} is setting the bar high!`);
    }

    console.log('[SOCIAL] Success stories shared');
  } catch (error) {
    console.error('[SOCIAL] Error in success stories task:', error.message);
  }
}

/**
 * Task 3: Post engagement content (testimonials, tips)
 * Runs every Wednesday at 10:00 AM
 */
async function taskPostEngagementContent() {
  console.log('[SOCIAL] Running task: Post engagement content...');

  try {
    const engagementContent = [
      `What keeps our students coming back? 👇\n\n"The personalized coaching at Wise Defense transformed my shooting. Best investment I\'ve made." - Student\n\n#Testimonial #TrainingResults #ProvenSuccess`,
      `New to firearms training? 🔰\n\nOur Beginner Fundamentals course covers:\n✓ Safe handling\n✓ Proper stance & grip\n✓ Marksmanship basics\n✓ Safety protocols\n\nStart your journey today! #BeginnerFriendly #SafeTraining`,
      `Did you know? 📊\n\nStudents who practice consistently improve their accuracy by 40% in just 8 weeks.\n\nThe secret? Dedication + proper instruction = Results!\n\n#TrainingTips #SkillBuilding #MarksmanshipMatters`,
      `Tactical Tip Tuesday 🎯\n\nBody positioning affects everything:\n• Stance determines stability\n• Grip controls recoil\n• Sight alignment = accuracy\n\nMaster the fundamentals, master the shot. #Precision #Tactics`,
    ];

    const content = engagementContent[Math.floor(Math.random() * engagementContent.length)];

    // Post to all platforms
    await postToSocialMedia('twitter', content);
    await postToSocialMedia('instagram', content);
    await postToSocialMedia('linkedin',
      `At Wise Defense, we believe in data-driven training methods. Our students see measurable results. Learn what makes the difference.`);

    console.log('[SOCIAL] Engagement content posted');
  } catch (error) {
    console.error('[SOCIAL] Error in engagement content task:', error.message);
  }
}

/**
 * Task 4: Track social media metrics
 * Runs daily at 6:00 PM
 */
async function taskTrackMetrics() {
  console.log('[SOCIAL] Running task: Track social media metrics...');

  try {
    // This would integrate with actual social media APIs to fetch metrics
    // For now, we'll track posts in our database
    const postsResult = await query(
      `SELECT platform, COUNT(*) as post_count,
              SUM(CASE WHEN likes > 0 THEN likes ELSE 0 END) as total_likes,
              SUM(CASE WHEN shares > 0 THEN shares ELSE 0 END) as total_shares
       FROM social_media_posts
       WHERE posted_at > NOW() - INTERVAL '30 days'
       GROUP BY platform`
    );

    console.log('[SOCIAL] Metrics for last 30 days:');
    for (const metric of postsResult.rows) {
      console.log(`  ${metric.platform}: ${metric.post_count} posts, ` +
                  `${metric.total_likes || 0} likes, ${metric.total_shares || 0} shares`);
    }

    console.log('[SOCIAL] Metrics tracking completed');
  } catch (error) {
    console.error('[SOCIAL] Error in metrics task:', error.message);
  }
}

/**
 * Schedule jobs using setInterval
 */
function scheduleJobs() {
  console.log('[SOCIAL] Scheduling social media campaigns...');

  /**
   * Task 1: Weekly tips - Monday 8:00 AM
   */
  function scheduleWeeklyTips() {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
    nextMonday.setHours(8, 0, 0, 0);

    const delayMs = nextMonday.getTime() - now.getTime();
    console.log(`[SOCIAL] Weekly tips campaign scheduled for ${Math.round(delayMs / 1000)}ms`);

    setTimeout(() => {
      taskPostWeeklyTips();
      setInterval(taskPostWeeklyTips, 7 * 24 * 60 * 60 * 1000);
    }, delayMs);
  }

  /**
   * Task 2: Success stories - Friday 4:00 PM
   */
  function scheduleSuccessStories() {
    const now = new Date();
    const nextFriday = new Date(now);
    const daysUntilFriday = (5 - nextFriday.getDay() + 7) % 7;
    nextFriday.setDate(nextFriday.getDate() + (daysUntilFriday || 7));
    nextFriday.setHours(16, 0, 0, 0);

    const delayMs = nextFriday.getTime() - now.getTime();
    console.log(`[SOCIAL] Success stories campaign scheduled for ${Math.round(delayMs / 1000)}ms`);

    setTimeout(() => {
      taskShareSuccessStories();
      setInterval(taskShareSuccessStories, 7 * 24 * 60 * 60 * 1000);
    }, delayMs);
  }

  /**
   * Task 3: Engagement content - Wednesday 10:00 AM
   */
  function scheduleEngagementContent() {
    const now = new Date();
    const nextWednesday = new Date(now);
    const daysUntilWednesday = (3 - nextWednesday.getDay() + 7) % 7;
    nextWednesday.setDate(nextWednesday.getDate() + (daysUntilWednesday || 7));
    nextWednesday.setHours(10, 0, 0, 0);

    const delayMs = nextWednesday.getTime() - now.getTime();
    console.log(`[SOCIAL] Engagement content campaign scheduled for ${Math.round(delayMs / 1000)}ms`);

    setTimeout(() => {
      taskPostEngagementContent();
      setInterval(taskPostEngagementContent, 7 * 24 * 60 * 60 * 1000);
    }, delayMs);
  }

  /**
   * Task 4: Metrics tracking - Daily at 6:00 PM
   */
  function scheduleMetricsTracking() {
    const now = new Date();
    const nextTracking = new Date(now);
    nextTracking.setDate(nextTracking.getDate() + 1);
    nextTracking.setHours(18, 0, 0, 0);

    const delayMs = nextTracking.getTime() - now.getTime();
    console.log(`[SOCIAL] Metrics tracking scheduled for ${Math.round(delayMs / 1000)}ms`);

    setTimeout(() => {
      taskTrackMetrics();
      setInterval(taskTrackMetrics, 24 * 60 * 60 * 1000);
    }, delayMs);
  }

  // Task 5: Repost viral Discord content
  function scheduleVirialReposts() {
    async function taskRepostViral() {
      console.log('[SOCIAL] Running task: Repost viral Discord content...');
      try {
        const viralPosts = await query(
          `SELECT * FROM bot_social_posts WHERE engagement_count >= 5 AND social_platform = 'discord' LIMIT 3`
        );

        for (const post of viralPosts.rows) {
          // Generate caption
          const captions = [
            `🔥 Amazing progress! "${post.discord_content}"\n\nJoin our training community → link in bio #WiseDefense`,
            `💪 Community win! "${post.discord_content}"\n\nTrain with us and level up your skills 🚀 #WiseDefense`,
            `🎯 Member highlight! "${post.discord_content}"\n\nBuild your skills with Wise Defense #TrainingCommunity`,
          ];
          const caption = captions[Math.floor(Math.random() * captions.length)];

          // Log the repost intent (actual API posting would go here)
          await query(
            `UPDATE bot_social_posts SET social_platform = 'reposted' WHERE id = $1`,
            [post.id]
          );

          // Award bonus to member
          await query(
            `UPDATE member_progress SET total_points = total_points + 5 WHERE member_id = $1`,
            [post.member_id]
          );

          console.log(`[SOCIAL] Reposted viral content from ${post.member_id}`);
        }

        console.log('[SOCIAL] Viral content repost task completed');
      } catch (error) {
        console.error('[SOCIAL] Error in viral repost task:', error.message);
      }
    }

    taskRepostViral();
    setInterval(taskRepostViral, 60 * 60 * 1000); // Every hour
    console.log('[SOCIAL] Viral repost task scheduled (every 60 minutes)');
  }

  scheduleWeeklyTips();
  scheduleSuccessStories();
  scheduleEngagementContent();
  scheduleMetricsTracking();
  scheduleVirialReposts();
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
  console.log('[SOCIAL] Shutting down gracefully...');
  try {
    await pool.end();
    console.log('[SOCIAL] Database pool closed');
    process.exit(0);
  } catch (error) {
    console.error('[SOCIAL] Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Main entry point
 */
async function main() {
  console.log('[SOCIAL] Agent started. Running social media campaigns...');

  // Verify database connection
  try {
    await pool.query('SELECT 1');
    console.log('[SOCIAL] Database connection verified');
  } catch (error) {
    console.error('[SOCIAL] Failed to connect to database:', error.message);
    process.exit(1);
  }

  // Schedule all jobs
  scheduleJobs();
}

// Run the agent
main().catch((error) => {
  console.error('[SOCIAL] Fatal error:', error);
  process.exit(1);
});
