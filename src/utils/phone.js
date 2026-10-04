// Normalizes Turkish phone numbers to international digits (90XXXXXXXXXX),
// the format WhatsApp expects. Returns '' when nothing usable is left.
function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = `90${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('5')) digits = `90${digits}`;
  return digits;
}

module.exports = { normalizePhone };
