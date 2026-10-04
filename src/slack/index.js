const { App, ExpressReceiver } = require('@slack/bolt');
const config = require('../config');
const registerListeners = require('./listeners');

// Builds the Slack integration, or returns null when credentials are absent
// so the backend can still run without Slack configured.
function createSlack() {
  if (!config.slack.enabled) return null;

  const receiver = new ExpressReceiver({
    signingSecret: config.slack.signingSecret,
    endpoints: '/slack/events',
  });

  const app = new App({
    token: config.slack.botToken,
    receiver,
  });

  registerListeners(app);

  return {
    app,
    receiver,
    // Backend -> Slack: post an outbound message to a channel.
    async notify({ channel, text, blocks } = {}) {
      const target = channel || config.slack.defaultChannel;
      return app.client.chat.postMessage({
        channel: target,
        text: text || '',
        ...(blocks ? { blocks } : {}),
      });
    },
  };
}

module.exports = { createSlack };
