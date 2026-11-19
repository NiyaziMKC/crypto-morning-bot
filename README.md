# 🌅 Crypto Morning Bot

Her sabah 08:00 (Türkiye saati) Telegram'a kısa, net ve okunabilir kripto piyasa özeti gönderen otomasyon botu.

## ✨ Özellikler

- **BTC & ETH**: Güncel fiyat, 24h değişim, market cap, dominans
- **Genel Piyasa**: Toplam market cap, 24h hacim
- **Fear & Greed Index**: Günlük korku & açgözlülük endeksi (Türkçe)
- **Haberler**: Son 24 saatin öne çıkan kripto haberleri (CryptoPanic + NewsAPI)
- **AI Özet**: NVIDIA NIM (OpenAI uyumlu) ile ~60 saniyelik Türkçe özet
- **Sunucusuz**: GitHub Actions ile her sabah otomatik çalışır
- **Güvenli**: Tüm secret'lar GitHub Secrets / .env'de, kodda yok

## 📋 Gereksinimler

- Node.js 20+
- GitHub hesabı (Actions için)
- Telegram Bot (BotFather'dan)
- NVIDIA NIM API Key (build.nvidia.com)
- İsteğe bağlı: CryptoPanic API Key, NewsAPI Key

## 🚀 Kurulum

### 1. Repository Oluşturun

```bash
# Bu repoyu fork edin veya yeni bir repo oluşturup dosyaları yükleyin
git clone https://github.com/KULLANICI/crypto-morning-bot.git
cd crypto-morning-bot
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

**Gerekli değişkenler:**

| Değişken | Açıklama | Nasıl Alınır |
|----------|----------|--------------|
| `TELEGRAM_BOT_TOKEN` | BotFather token | @BotFather → `/newbot` |
| `TELEGRAM_CHAT_ID` | Hedef chat/channel ID | @userinfobot ile öğrenin |
| `NVIDIA_API_KEY` | NIM API key | https://build.nvidia.com/ |
| `NVIDIA_BASE_URL` | NIM endpoint | Model sayfasından kopyalayın |
| `NVIDIA_MODEL` | Model adı | Örn: `meta/llama-3.1-70b-instruct` |

**İsteğe bağlı (en az biri önerilir):**
- `CRYPTOPANIC_API_KEY` → https://cryptopanic.com/developers/api/
- `NEWSAPI_KEY` → https://newsapi.org/register

### 4. Yerel Test Edin

```bash
# Development modu (tsx ile doğrudan çalıştırır)
npm run dev

# Veya derleyip çalıştırın
npm run build && npm start
```

Başarılıysa Telegram'a test mesajı gelecektir.

### 5. GitHub Secrets Ekleyin

GitHub repo sayfasında:
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** butonuna tıklayın
3. Aşağıdaki secret'ları tek tek ekleyin:

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
NVIDIA_API_KEY
NVIDIA_BASE_URL
NVIDIA_MODEL
CRYPTOPANIC_API_KEY (opsiyonel)
NEWSAPI_KEY (opsiyonel)
```

### 6. Workflow'u Etkinleştirin

- **Actions** sekmesine gidin
- "Daily Crypto Morning Report" workflow'unu görün
- "Enable workflow" butonuna tıklayın (varsa)
- "Run workflow" → "Run workflow" ile manuel test edin

## ⏰ Zamanlama

- **Cron**: `0 5 * * *` (UTC) = **08:00 UTC+3** (Türkiye saati)
- Türkiye yıl boyunca UTC+3 kullanır (yaz saati uygulamaz)
- Manuel tetikleme: Actions → Run workflow

## 🛠 Geliştirme

```bash
# TypeScript watch modu
npx tsx watch src/index.ts

# Lint / format (opsiyonel)
npx eslint src/
npx prettier --write src/
```

## 📁 Proje Yapısı

```
crypto-morning-bot/
├── .github/workflows/daily-report.yml  # GitHub Actions
├── src/
│   ├── index.ts                        # Ana entry point
│   ├── config.ts                       # Env validasyonu
│   ├── fetchers/
│   │   ├── market.ts                   # CoinGecko (fiyat, hacim, dominans)
│   │   ├── fear-greed.ts               # Alternative.me (Fear & Greed)
│   │   └── news.ts                     # CryptoPanic + NewsAPI (haberler)
│   ├── summarizer/
│   │   └── nim.ts                      # NVIDIA NIM özetleyici
│   ├── sender/
│   │   └── telegram.ts                 # Telegram gönderici (Telegraf)
│   └── utils/
│       ├── format.ts                   # MarkdownV2 formatlama
│       └── time.ts                     # Türkiye saati yardımcıları
├── .env.example                        # Örnek env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Özelleştirme

### Farklı Saat
`.github/workflows/daily-report.yml` dosyasında cron ifadesini değiştirin:
```yaml
# Örn: 07:00 UTC+3 = 04:00 UTC
- cron: '0 4 * * *'
```

### Farklı Coinler
`src/fetchers/market.ts` → `fetchBtcEthData()` fonksiyonunda CoinGecko ID'lerini değiştirin.

### Farklı Model
`.env` / GitHub Secrets'te `NVIDIA_MODEL` değiştirin:
- `meta/llama-3.1-70b-instruct` (varsayılan)
- `mistralai/mixtral-8x7b-instruct`
- `google/gemma-2-27b-it`
- Diğer NIM modelleri için: https://build.nvidia.com/explore/discover

### Mesaj Formatı
`src/utils/format.ts` → `buildReportMessage()` fonksiyonunu düzenleyin.

## ❗ Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| "Missing required environment variable" | GitHub Secrets / .env kontrol edin |
| "NVIDIA NIM API error: 401" | API key ve base URL doğru mu? |
| "Telegram send error: 400" | Chat ID doğru mu? Bot kanala eklendi mi? |
| Haber gelmiyor | En az bir news API key ekleyin |
| Actions çalışmıyor | Workflow enabled mı? Secrets doğru mu? |

## 📄 Lisans

MIT License - Serbest kullanım, dağıtım ve değişiklik.

## ⚠️ Yasal Uyarı

Bu bot **sadece bilgi amaçlıdır**. Yatırım tavsiyesi **değildir**. Kripto para yatırımları yüksek risklidir. Kendi araştırmanızı yapın.