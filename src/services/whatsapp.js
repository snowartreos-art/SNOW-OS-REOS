const config = require('../config');

// Sends a WhatsApp message through the Cloud API. Uses the approved template
// when one is configured for the message type, otherwise plain text.
async function sendWhatsApp({ to, type, text }) {
  if (!config.whatsapp.enabled) {
    throw new Error('WhatsApp yapilandirilmamis (WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID)');
  }

  const template = config.whatsapp.templates[type];
  const body = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: { name: template, language: { code: config.whatsapp.templateLang } },
      }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } };

  const url = `https://graph.facebook.com/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.whatsapp.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = (data.error && data.error.message) || `HTTP ${res.status}`;
    throw new Error(`WhatsApp gonderimi basarisiz: ${detail}`);
  }
  return data;
}

module.exports = { sendWhatsApp };
