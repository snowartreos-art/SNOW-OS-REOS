const { getDb } = require('../db');

module.exports = {
  // Inserts the call once per call_uuid; returns null when it already exists
  // (Slack retries and edited messages deliver the same call again).
  createIfNew(call) {
    const info = getDb()
      .prepare(
        `INSERT OR IGNORE INTO cagri
           (call_uuid, arayan_telefon, ofis_telefon, durum, cagri_zamani, sure, kayit_url, slack_ts, musteri_id)
         VALUES
           (@call_uuid, @arayan_telefon, @ofis_telefon, @durum, @cagri_zamani, @sure, @kayit_url, @slack_ts, @musteri_id)`
      )
      .run({ slack_ts: null, musteri_id: null, ...call });
    return info.changes ? this.findById(info.lastInsertRowid) : null;
  },
  setMessageResult(id, { mesaj_tipi, mesaj_durumu, mesaj_hata }) {
    getDb()
      .prepare(
        `UPDATE cagri SET mesaj_tipi = @mesaj_tipi, mesaj_durumu = @mesaj_durumu,
           mesaj_hata = @mesaj_hata WHERE id = @id`
      )
      .run({ id, mesaj_tipi, mesaj_durumu, mesaj_hata: mesaj_hata || null });
    return this.findById(id);
  },
  // True when a message of this type was already sent to the number recently.
  recentlySent(phone, mesajTipi, hours) {
    return Boolean(
      getDb()
        .prepare(
          `SELECT 1 FROM cagri
            WHERE arayan_telefon = ? AND mesaj_tipi = ? AND mesaj_durumu = 'gonderildi'
              AND created_at >= datetime('now', ?)
            LIMIT 1`
        )
        .get(phone, mesajTipi, `-${hours} hours`)
    );
  },
  findById(id) {
    return getDb().prepare('SELECT * FROM cagri WHERE id = ?').get(id);
  },
  list() {
    return getDb().prepare('SELECT * FROM cagri ORDER BY id DESC').all();
  },
};
