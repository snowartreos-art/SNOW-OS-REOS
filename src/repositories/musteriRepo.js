const { getDb } = require('../db');

module.exports = {
  create({ ad_soyad, telefon, email, tip }) {
    const info = getDb()
      .prepare(
        `INSERT INTO musteri (ad_soyad, telefon, email, tip)
         VALUES (@ad_soyad, @telefon, @email, @tip)`
      )
      .run({
        ad_soyad,
        telefon: telefon == null ? null : telefon,
        email: email == null ? null : email,
        tip: tip || 'alici',
      });
    return this.findById(info.lastInsertRowid);
  },
  findById(id) {
    return getDb().prepare('SELECT * FROM musteri WHERE id = ?').get(id);
  },
  list() {
    return getDb().prepare('SELECT * FROM musteri ORDER BY id DESC').all();
  },
};
