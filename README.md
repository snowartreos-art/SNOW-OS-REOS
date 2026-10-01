# SNOW-OS-REOS

Snow Art RE.OS Gayrimenkul yonetim ve otomasyon sistemi.

## Proje Amaci

Portfoy, musteri, danisman, kira ve WhatsApp bildirim sureclerini tek merkezden yonetmek.

## V1 Backend

Node.js (Express) tabanli V1 backend, Slack entegrasyonu ile birlikte gelir.

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
| `SLACK_BOT_TOKEN` | Slack Bot User OAuth Token (`xoxb-...`) |
| `SLACK_SIGNING_SECRET` | Slack uygulamasinin Signing Secret degeri |
| `SLACK_DEFAULT_CHANNEL` | Giden bildirimler icin varsayilan kanal |

Slack kimlik bilgileri tanimlanmazsa backend yine calisir; yalnizca Slack entegrasyonu devre disi kalir.

### API Uc Noktalari

| Metot | Yol | Aciklama |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Saglik kontrolu ve Slack baglanti durumu |
| `POST` | `/api/v1/notifications` | Backend'den Slack'e bildirim gonderir |

`POST /api/v1/notifications` govde ornegi:

```json
{ "channel": "#reos-bildirim", "text": "Yeni portfoy eklendi" }
```

### Slack Entegrasyonu

Slack -> Backend yonu icin uygulamanizin Event Subscriptions ve Slash Commands
istek URL'sini `https://<sunucu>/slack/events` olarak ayarlayin.

- **Event:** `app_mention` - bota mention atildiginda yanit verir.
- **Slash komutu:** `/reos` - `status` ve `help` alt komutlarini destekler.

Backend -> Slack yonu icin `/api/v1/notifications` uc noktasi kullanilir.
