// Parses the call notifications Bulutfon posts to Slack, e.g.
//   *Kaçan Çağrı:* *905321234567*, *902321234567* numaranızı aradı ve *cevap alamadı*.
//   *Zaman:* 14:05:12 | *Süre*: 00:00:00 | <https://oim.bulutfon.com/account/pbx/call-records/2026/10/04/<uuid>>
const CALL_PATTERN =
  /(?:\*Kaçan Çağrı:\*\s*)?\*(?<caller>\d{10,15})\*,\s*\*(?<office>\d{10,15})\*\s*numaranızı\s*(?<status>aradı(?:\s+ve\s+\*cevap alamadı\*)?)\.\s*\*Zaman:\*\s*(?<time>\d{2}:\d{2}:\d{2})\s*\|\s*\*Süre\*:\s*(?<duration>\d{2}:\d{2}:\d{2})\s*\|\s*<?(?<url>https:\/\/oim\.bulutfon\.com\/account\/pbx\/call-records\/(?<year>\d{4})\/(?<month>\d{2})\/(?<day>\d{2})\/(?<uuid>[0-9a-fA-F-]+))>?/s;

// Returns null when the text is not a Bulutfon call notification.
function parseCallMessage(text) {
  const m = CALL_PATTERN.exec(String(text || ''));
  if (!m) return null;
  const g = m.groups;
  const missed = /cevap alamadı/.test(g.status) || /Kaçan Çağrı/.test(text);
  return {
    call_uuid: g.uuid,
    arayan_telefon: g.caller,
    ofis_telefon: g.office,
    durum: missed ? 'cevapsiz' : 'cevaplandi',
    cagri_zamani: `${g.year}-${g.month}-${g.day} ${g.time}`,
    sure: g.duration,
    kayit_url: g.url,
  };
}

module.exports = { parseCallMessage };
