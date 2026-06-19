module.exports = {
  apps: [
    {
      name: 'scheduler-agent',
      script: './dashboard/agents/scheduler-agent.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/scheduler-agent-error.log',
      out_file: './logs/scheduler-agent.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
    },
    {
      name: 'engagement-agent',
      script: './dashboard/agents/engagement-agent.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/engagement-agent-error.log',
      out_file: './logs/engagement-agent.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
    },
  ],
};
