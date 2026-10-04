const config = require('../config');
const logger = require('../utils/logger');
const { parseCallMessage } = require('../services/callParser');
const { handleCall } = require('../services/calls');

const RESULT_TEXT = {
  gonderildi: (c) => `✅ ${c.mesaj_tipi === 'cevapsiz' ? 'Cevapsiz cagri' : 'Karsilama'} mesaji musteriye gonderildi.`,
  atlandi: (c) => `⏭️ Mesaj gonderilmedi: ${c.mesaj_hata}`,
  hata: (c) => `⚠️ Mesaj gonderilemedi: ${c.mesaj_hata}`,
};

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

  // Bulutfon call notifications -> welcome / missed-call WhatsApp to the caller.
  // Bulutfon posts as a bot, so this listens to every message event (bot
  // messages included) and keeps only the ones that parse as a call.
  app.event('message', async ({ event, client }) => {
    if (event.subtype && event.subtype !== 'bot_message') return;
    if (config.slack.callsChannel && event.channel !== config.slack.callsChannel) return;

    const parsed = parseCallMessage(event.text);
    if (!parsed) return;

    const call = await handleCall(parsed, { slackTs: event.ts });
    if (!call) return;

    try {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.ts,
        text: RESULT_TEXT[call.mesaj_durumu](call),
      });
    } catch (err) {
      logger.error('Cagri sonucu Slack thread\'ine yazilamadi:', (err.data && err.data.error) || err.message);
    }
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
