const logger = require('../utils/logger');

function formatCurrency(value) {
  if (value == null) return '-';
  return `${Number(value).toLocaleString('tr-TR')} TL`;
}

const formatters = {
  portfoy: (r) =>
    `🏠 *Yeni portfoy eklendi* (#${r.id})\n` +
    `- Baslik: ${r.baslik}\n` +
    `- Tip: ${r.tip}\n` +
    `- Fiyat: ${formatCurrency(r.fiyat)}` +
    (r.adres ? `\n- Adres: ${r.adres}` : ''),
  musteri: (r) =>
    `👤 *Yeni musteri eklendi* (#${r.id})\n` +
    `- Ad Soyad: ${r.ad_soyad}\n` +
    `- Tip: ${r.tip}` +
    (r.telefon ? `\n- Telefon: ${r.telefon}` : ''),
  kira: (r) =>
    `📄 *Yeni kira sozlesmesi* (#${r.id})\n` +
    `- Portfoy: #${r.portfoy_id}\n` +
    `- Musteri: #${r.musteri_id}\n` +
    `- Aylik tutar: ${formatCurrency(r.aylik_tutar)}`,
};

// Backend -> Slack on a domain event. A Slack failure is logged and swallowed
// so it can never break the API request that triggered it.
async function notifyCreated(slack, resource, record) {
  if (!slack) return;
  const formatter = formatters[resource];
  if (!formatter) return;
  try {
    await slack.notify({ text: formatter(record) });
  } catch (err) {
    const detail = (err.data && err.data.error) || err.message;
    logger.error(`Slack notification failed for ${resource} #${record.id}:`, detail);
  }
}

module.exports = { notifyCreated };
