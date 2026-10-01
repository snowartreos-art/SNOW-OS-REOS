# SNOW-OS-REOS

Snow Art RE.OS Gayrimenkul yonetim ve otomasyon sistemi.

## Proje Amaci

Portfoy, musteri, danisman, kira ve WhatsApp bildirim sureclerini tek merkezden yonetmek.

## V1 Backend

Node.js (Express) tabanli V1 backend; SQLite veritabani katmani ve Slack
entegrasyonu ile birlikte gelir.

### Kurulum

```bash
npm install
cp .env.example .env   # degerleri doldurun
npm start
```

### Ortam Degiskenleri

| Degisken | Aciklama |
| --- | --- |
| `PORT` | Sunucu portu (varsayilan 3000) |
| `DATABASE_PATH` | SQLite veritabani dosya yolu (varsayilan `./data/reos.db`) |
| `SLACK_BOT_TOKEN` | Slack Bot User OAuth Token (`xoxb-...`) |
| `SLACK_SIGNING_SECRET` | Slack uygulamasinin Signing Secret degeri |
| `SLACK_DEFAULT_CHANNEL` | Giden bildirimler icin varsayilan kanal |

Slack kimlik bilgileri tanimlanmazsa backend yine calisir; yalnizca Slack
entegrasyonu devre disi kalir.

### Veritabani

SQLite (`better-sqlite3`) kullanilir. Ilk calistirmada `DATABASE_PATH`
altinda dosya ve tablolar (`portfoy`, `musteri`, `kira`) otomatik olusturulur.

### API Uc Noktalari

| Metot | Yol | Aciklama |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Saglik kontrolu ve Slack baglanti durumu |
| `POST` | `/api/v1/notifications` | Backend'den Slack'e serbest bildirim gonderir |
| `GET` / `POST` | `/api/v1/portfoy` | Portfoy listesi / ekleme |
| `GET` | `/api/v1/portfoy/:id` | Tekil portfoy |
| `GET` / `POST` | `/api/v1/musteri` | Musteri listesi / ekleme |
| `GET` | `/api/v1/musteri/:id` | Tekil musteri |
| `GET` / `POST` | `/api/v1/kira` | Kira sozlesmesi listesi / ekleme |
| `GET` | `/api/v1/kira/:id` | Tekil kira kaydi |

**Otomatik Slack bildirimi:** `portfoy`, `musteri` veya `kira` kaydi
olusturuldugunda (ilgili `POST`), Slack yapilandirilmissa varsayilan kanala
otomatik bir bildirim gonderilir.

Ornek istek govdeleri:

```json
// POST /api/v1/portfoy
{ "baslik": "Deniz manzarali 3+1", "tip": "satilik", "fiyat": 4500000, "adres": "Cesme" }

// POST /api/v1/musteri
{ "ad_soyad": "Ayse Yilmaz", "telefon": "0532...", "tip": "alici" }

// POST /api/v1/kira
{ "portfoy_id": 1, "musteri_id": 1, "aylik_tutar": 25000 }
```

### Slack Entegrasyonu

Slack -> Backend yonu icin uygulamanizin Event Subscriptions ve Slash Commands
istek URL'sini `https://<sunucu>/slack/events` olarak ayarlayin.

- **Event:** `app_mention` - bota mention atildiginda yanit verir.
- **Slash komutu:** `/reos` - `status` ve `help` alt komutlarini destekler.

Backend -> Slack yonu icin `/api/v1/notifications` uc noktasi ve yukaridaki
otomatik domain bildirimleri kullanilir.
