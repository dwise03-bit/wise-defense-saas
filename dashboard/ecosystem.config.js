/**
 * PM2 Configuration File
 *
 * This file configures PM2 process management for background agents.
 * Deploy with: pm2 start ecosystem.config.js
 *
 * Agents in this project:
 * - scheduler-agent: Sends reminder emails and cancellation notifications
 * - engagement-agent: Tracks user engagement and member progress
 * - news-scraper: Scrapes 2nd Amendment news every 4 hours
 * - content-reviewer: Reviews scraped articles for relevance and sentiment
 * - social-media-agent: Generates and posts social media content
 * - telegram-bot: Sends Telegram notifications and tips
 * - discord-bot: Discord server integration and commands
 */

module.exports = {
  apps: [
    {
      name: 'scheduler-agent',
      script: './agents/scheduler-agent.js',
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'engagement-agent',
      script: './agents/engagement-agent.js',
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'news-scraper',
      script: './agents/news-scraper.js',
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        NEWS_API_KEY: process.env.NEWS_API_KEY,
      },
    },
    // Planned agents
    // {
    //   name: 'content-reviewer',
    //   script: './agents/content-reviewer.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
    // {
    //   name: 'social-media-agent',
    //   script: './agents/social-media-agent.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
    // {
    //   name: 'telegram-bot',
    //   script: './agents/telegram-bot.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
    // {
    //   name: 'discord-bot',
    //   script: './agents/discord-bot.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
  ],
};
