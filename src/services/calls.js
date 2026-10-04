const config = require('../config');
const cagriRepo = require('../repositories/cagriRepo');
const { getDb } = require('../db');
const { normalizePhone } = require('../utils/phone');
const { sendWhatsApp } = require('./whatsapp');
const logger = require('../utils/logger');

function findMusteriByPhone(phone) {
  const rows = getDb().prepare('SELECT * FROM musteri WHERE telefon IS NOT NULL').all();
  return rows.find((r) => normalizePhone(r.telefon) === phone) || null;
}

function buildText(mesajTipi, musteri) {
  const template =
    mesajTipi === 'cevapsiz' ? config.calls.cevapsizText : config.calls.karsilamaText;
  let text = template.replace(/\{office\}/g, config.calls.officeName);
  if (musteri) text = text.replace(/^Merhaba,/, `Merhaba ${musteri.ad_soyad},`);
  return text;
}

// Records an incoming call and sends the caller the welcome (answered) or
// missed-call WhatsApp message. Returns the stored call, or null for a
// duplicate delivery of a call that was already handled.
async function handleCall(parsed, { slackTs } = {}) {
  const phone = normalizePhone(parsed.arayan_telefon);
  const musteri = findMusteriByPhone(phone);
  const call = cagriRepo.createIfNew({
    ...parsed,
    arayan_telefon: phone,
    slack_ts: slackTs || null,
    musteri_id: musteri ? musteri.id : null,
  });
  if (!call) {
    logger.info(`Cagri ${parsed.call_uuid} zaten islenmis, atlandi`);
    return null;
  }

  const mesajTipi = parsed.durum === 'cevapsiz' ? 'cevapsiz' : 'karsilama';

  if (normalizePhone(parsed.ofis_telefon) === phone) {
    return cagriRepo.setMessageResult(call.id, {
      mesaj_tipi: mesajTipi,
      mesaj_durumu: 'atlandi',
      mesaj_hata: 'Ofis numarasi',
    });
  }
  if (cagriRepo.recentlySent(phone, mesajTipi, config.calls.dedupeHours)) {
    return cagriRepo.setMessageResult(call.id, {
      mesaj_tipi: mesajTipi,
      mesaj_durumu: 'atlandi',
      mesaj_hata: `Son ${config.calls.dedupeHours} saatte ayni mesaj gonderildi`,
    });
  }

  try {
    await sendWhatsApp({ to: phone, type: mesajTipi, text: buildText(mesajTipi, musteri) });
    logger.info(`Cagri ${parsed.call_uuid}: ${mesajTipi} mesaji ${phone} numarasina gonderildi`);
    return cagriRepo.setMessageResult(call.id, { mesaj_tipi: mesajTipi, mesaj_durumu: 'gonderildi' });
  } catch (err) {
    logger.error(`Cagri ${parsed.call_uuid}: ${mesajTipi} mesaji gonderilemedi:`, err.message);
    return cagriRepo.setMessageResult(call.id, {
      mesaj_tipi: mesajTipi,
      mesaj_durumu: 'hata',
      mesaj_hata: err.message,
    });
  }
}

module.exports = { handleCall };
