/**
 * Discord Check-In Poll Command
 * Daily check-in poll to track member activity
 */

const { EmbedBuilder } = require('discord.js');

// Import engagement functions (these will be available via Node.js module loading)
async function getEngagementFunctions() {
  try {
    // Using require for Node.js environment
    return require('../../lib/botEngineering/engagement');
  } catch (error) {
    console.error('[CHECKIN] Error loading engagement module:', error);
    return null;
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
          const engagementModule = await getEngagementFunctions();
          if (!engagementModule) {
            console.error('[CHECKIN] Cannot load engagement module');
            return;
          }

          const memberId = user.id;
          await engagementModule.awardPoints(memberId, 'check_in', 1);
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
