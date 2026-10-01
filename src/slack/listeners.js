const logger = require('../utils/logger');

// Slack -> Backend: incoming events and slash commands.
module.exports = function registerListeners(app) {
  // Respond when the bot is mentioned.
  app.event('app_mention', async ({ event, say }) => {
    logger.info(`app_mention from ${event.user}`);
    await say({
      text:
        `Merhaba <@${event.user}>! SNOW-OS-REOS V1 backend bagli ve calisiyor. ` +
        'Kullanilabilir komut: `/reos`',
      thread_ts: event.thread_ts || event.ts,
    });
  });

  // Slash command: /reos
  app.command('/reos', async ({ command, ack, respond }) => {
    await ack();
    const text = (command.text || '').trim();
    logger.info(`/reos command: "${text}" from ${command.user_id}`);

    if (!text || text === 'help') {
      await respond({
        response_type: 'ephemeral',
        text:
          '*SNOW-OS-REOS komutlari*\n' +
          '- `/reos status` - sistem durumu\n' +
          '- `/reos help` - bu yardim mesaji',
      });
      return;
    }

    if (text === 'status') {
      await respond({
        response_type: 'ephemeral',
        text: 'SNOW-OS-REOS V1 backend calisiyor. ✅',
      });
      return;
    }

    await respond({
      response_type: 'ephemeral',
      text: `Bilinmeyen komut: \`${text}\`. \`/reos help\` yazarak komutlari gorebilirsiniz.`,
    });
  });

  app.error(async (error) => {
    logger.error('Slack app error:', error);
  });
};
