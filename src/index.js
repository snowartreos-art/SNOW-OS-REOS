const express = require('express');
const config = require('./config');
const { createSlack } = require('./slack');
const apiRouter = require('./routes');
const logger = require('./utils/logger');

function createServer() {
  const app = express();

  // May be null when Slack credentials are not configured.
  const slack = createSlack();

  // Mount Slack's receiver BEFORE express.json() so it can verify raw
  // request signatures. ExpressReceiver handles its own body parsing.
  if (slack) {
    app.use(slack.receiver.router);
    logger.info('Slack integration enabled at /slack/events');
  } else {
    logger.warn(
      'Slack integration disabled (missing SLACK_BOT_TOKEN / SLACK_SIGNING_SECRET)'
    );
  }

  app.use(express.json());

  // Expose the Slack client to routes for outbound notifications.
  app.locals.slack = slack;

  app.use('/api/v1', apiRouter);

  app.get('/', (req, res) => {
    res.json({ name: 'SNOW-OS-REOS', version: 'v1', status: 'ok' });
  });

  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

  return app;
}

function start() {
  const app = createServer();
  app.listen(config.port, () => {
    logger.info(`SNOW-OS-REOS V1 backend listening on port ${config.port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { createServer, start };
