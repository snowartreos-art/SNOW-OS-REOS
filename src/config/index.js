require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  database: {
    path: process.env.DATABASE_PATH || './data/reos.db',
  },
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    defaultChannel: process.env.SLACK_DEFAULT_CHANNEL || '#general',
  },
};

config.slack.enabled = Boolean(config.slack.botToken && config.slack.signingSecret);

module.exports = config;
