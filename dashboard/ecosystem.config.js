/**
 * PM2 Configuration File
 *
 * This file configures PM2 process management for background agents.
 * Deploy with: pm2 start ecosystem.config.js
 *
 * Agents in this project:
 * - scheduler-agent: Sends reminder emails and cancellation notifications
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
    // Add additional agents here as needed
    // {
    //   name: 'notification-agent',
    //   script: './agents/notification-agent.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    // },
  ],
};
