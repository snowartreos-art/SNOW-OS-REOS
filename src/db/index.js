const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');
const logger = require('../utils/logger');

let db = null;

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS portfoy (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      baslik TEXT NOT NULL,
      tip TEXT NOT NULL DEFAULT 'satilik',
      fiyat REAL,
      adres TEXT,
      durum TEXT NOT NULL DEFAULT 'aktif',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS musteri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad_soyad TEXT NOT NULL,
      telefon TEXT,
      email TEXT,
      tip TEXT NOT NULL DEFAULT 'alici',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS kira (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfoy_id INTEGER NOT NULL REFERENCES portfoy(id),
      musteri_id INTEGER NOT NULL REFERENCES musteri(id),
      aylik_tutar REAL NOT NULL,
      baslangic_tarihi TEXT,
      bitis_tarihi TEXT,
      durum TEXT NOT NULL DEFAULT 'aktif',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cagri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      call_uuid TEXT NOT NULL UNIQUE,
      arayan_telefon TEXT NOT NULL,
      ofis_telefon TEXT,
      durum TEXT NOT NULL,
      cagri_zamani TEXT,
      sure TEXT,
      kayit_url TEXT,
      slack_ts TEXT,
      musteri_id INTEGER REFERENCES musteri(id),
      mesaj_tipi TEXT,
      mesaj_durumu TEXT NOT NULL DEFAULT 'beklemede',
      mesaj_hata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Opens (once) the SQLite database, ensures its directory exists, and runs
// the idempotent schema migration.
function getDb() {
  if (db) return db;

  const dbPath = config.database.path;
  const dir = path.dirname(dbPath);
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  logger.info(`SQLite database ready at ${dbPath}`);
  return db;
}

module.exports = { getDb };
