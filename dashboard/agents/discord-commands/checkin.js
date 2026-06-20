/**
 * Discord Check-In Poll Command
 * Daily check-in poll to track member activity
 */

const { EmbedBuilder } = require('discord.js');
const pg = require('pg');

// Initialize PostgreSQL pool for direct database access
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Award points directly via database
async function awardPoints(memberId, action, points) {
  try {
    await pool.query(
      `INSERT INTO member_progress (member_id, total_points)
       VALUES ($1, $2)
       ON CONFLICT (member_id) DO UPDATE
       SET total_points = member_progress.total_points + $2,
           updated_at = NOW()`,
      [memberId, points]
    );

    await pool.query(
      `INSERT INTO member_engagement (member_id, platform, action_type, metadata)
       VALUES ($1, $2, $3, $4)`,
      [memberId, 'discord', action, JSON.stringify({ points_awarded: points })]
    );

    console.log(`[CHECKIN] Awarded ${points} points to ${memberId}`);
  } catch (error) {
    console.error('[CHECKIN] Error awarding points:', error);
  }
}

module.exports = {
  name: 'Check-In Poll',
  description: 'Daily check-in poll to track member activity',

  async execute(client, channelId) {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.error('[CHECKIN] Channel not found:', channelId);
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#ff1744')
        .setTitle('🎯 Daily Check-In')
        .setDescription('Are you ready to train today?')
        .addFields(
          { name: 'React to vote:', value: '✅ Yes\n❌ No\n🤔 Maybe' }
        )
        .setTimestamp();

      const message = await channel.send({ embeds: [embed] });

      // Add reactions
      await message.react('✅');
      await message.react('❌');
      await message.react('🤔');

      console.log('[CHECKIN] Daily poll posted');

      // Track reaction collectors for 24 hours
      const collector = message.createReactionCollector({ time: 24 * 60 * 60 * 1000 });

      collector.on('collect', async (reaction, user) => {
        if (user.bot) return;

        try {
          const memberId = user.id;
          await awardPoints(memberId, 'check_in', 1);
          console.log(`[CHECKIN] ${user.username} awarded +1 point`);
        } catch (error) {
          console.error('[CHECKIN] Error awarding points:', error);
        }
      });

      collector.on('end', () => {
        console.log('[CHECKIN] Daily poll collection ended');
      });
    } catch (error) {
      console.error('[CHECKIN] Error posting poll:', error);
    }
  },
};
