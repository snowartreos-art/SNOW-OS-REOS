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
    // Channel ID (C...) where Bulutfon posts call notifications. Empty means
    // call messages are accepted from any channel the bot is in.
    callsChannel: process.env.SLACK_CALLS_CHANNEL || '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    templateLang: process.env.WHATSAPP_TEMPLATE_LANG || 'tr',
    // Approved template names. Business-initiated messages outside the 24h
    // window must use a template; when a name is empty, plain text is sent.
    templates: {
      karsilama: process.env.WHATSAPP_TEMPLATE_KARSILAMA || '',
      cevapsiz: process.env.WHATSAPP_TEMPLATE_CEVAPSIZ || '',
    },
  },
  calls: {
    officeName: process.env.OFFICE_NAME || 'Snow Art Gayrimenkul',
    // The same message type is not re-sent to the same number within this window.
    dedupeHours: parseFloat(process.env.CALL_MESSAGE_DEDUPE_HOURS || '24'),
    karsilamaText:
      process.env.CALL_KARSILAMA_TEXT ||
      'Merhaba, {office} olarak aradiginiz icin tesekkur ederiz. ' +
        'Size en kisa surede yardimci olacagiz.',
    cevapsizText:
      process.env.CALL_CEVAPSIZ_TEXT ||
      'Merhaba, {office} olarak aramanizi kacirdik. ' +
        'En kisa surede sizi geri arayacagiz.',
  },
};

config.slack.enabled = Boolean(config.slack.botToken && config.slack.signingSecret);

config.whatsapp.enabled = Boolean(config.whatsapp.token && config.whatsapp.phoneNumberId);

module.exports = config;
