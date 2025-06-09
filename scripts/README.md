# Data Scraping Scripts

Bu klasör LinkedIn ve Medium'dan gerçek engagement verilerini çekmeye yarayan script'leri içerir.

## 📋 İçindekiler

- `linkedin-scraper.py` - LinkedIn postlarını gerçek likes, comments, shares verileriyle çeker
- `medium-scraper.py` - Medium makalelerini gerçek claps, responses, views verileriyle çeker
- `daily-scraper.py` - Her iki scraper'ı koordine eden ana script
- `setup-cron.sh` - Günlük otomatik çalıştırma kurulumu
- `requirements.txt` - Python kütüphaneleri

## 🚀 Kurulum

### 1. Gereksinimler

```bash
# Python 3.8+ ve pip gerekli
python3 --version
pip3 --version

# Chrome browser gerekli (headless mode için)
google-chrome --version
```

### 2. Kütüphaneleri Yükle

```bash
cd scripts
pip install -r requirements.txt
```

### 3. Environment Variables

LinkedIn scraper için giriş bilgileri gerekli:

```bash
export LINKEDIN_EMAIL="your-email@example.com"
export LINKEDIN_PASSWORD="your-password"
```

## 🔧 Kullanım

### Manuel Çalıştırma

```bash
# LinkedIn scraper'ı çalıştır
cd scripts
LINKEDIN_EMAIL="email" LINKEDIN_PASSWORD="pass" python linkedin-scraper.py

# Medium scraper'ı çalıştır
python medium-scraper.py

# Her ikisini birden çalıştır
LINKEDIN_EMAIL="email" LINKEDIN_PASSWORD="pass" python daily-scraper.py
```

### Otomatik Günlük Çalıştırma

```bash
# Cron job kurulumu (her gün saat 08:00)
cd scripts
./setup-cron.sh

# Manuel test
python daily-scraper.py

# Log'ları kontrol et
tail -f ../logs/daily-scraper.log
```

## 📊 Çıktı Verileri

### LinkedIn Posts (`data/linkedin-posts.json`)

```json
{
  "lastUpdated": "2024-01-15T08:00:00Z",
  "nextUpdate": "2024-01-16T08:00:00Z",
  "source": "selenium-scraper-enhanced",
  "posts": [
    {
      "id": "real-1705320000-0",
      "text": "I'm happy to share that I've been accepted...",
      "publishedAt": "2024-01-10T10:30:00Z",
      "author": {
        "name": "Baha Kizil",
        "headline": "AI Engineer & Computer Vision Specialist"
      },
      "engagement": {
        "likes": 89,
        "comments": 12,
        "shares": 7
      },
      "url": "https://www.linkedin.com/posts/bahakizil_ai-bootcamp-...",
      "scrapedAt": "2024-01-15T08:00:00Z"
    }
  ]
}
```

### Medium Articles (`data/medium-articles.json`)

```json
{
  "lastUpdated": "2024-01-15T08:05:00Z",
  "nextUpdate": "2024-01-16T08:05:00Z",
  "source": "selenium-scraper-enhanced",
  "articles": [
    {
      "title": "Building Production-Ready AI Applications...",
      "link": "https://medium.com/@bahakizil/building-scalable...",
      "publishedDate": "2024-01-10T14:20:00Z",
      "description": "A comprehensive guide to building...",
      "categories": ["AI", "Next.js", "Production"],
      "author": "Baha Kizil",
      "engagement": {
        "claps": 47,
        "responses": 8,
        "views": 340
      },
      "scrapedAt": "2024-01-15T08:05:00Z"
    }
  ]
}
```

## 🛡️ Güvenlik

- LinkedIn credentials'ları environment variable'larda saklayın
- Script'leri private repository'lerde tutun
- Rate limiting aktif (2 saniye bekleme)
- Headless browser kullanımı
- User-agent rotation

## 🔍 Troubleshooting

### Chrome Driver Hatası

```bash
# ChromeDriver'ı manuel yükle
pip install webdriver-manager
```

### LinkedIn Giriş Problemi

```bash
# 2FA aktifse app password kullanın
# IP whitelist kontrolü yapın
# Şüpheli aktivite uyarısı varsa bekleyin
```

### Medium Scraping Hatası

```bash
# RSS fallback aktif
# Rate limiting nedeniyle yavaş çalışabilir
# VPN kullanarak deneyin
```

### Cron Job Çalışmıyor

```bash
# Cron job'ları kontrol et
crontab -l

# Log'ları kontrol et
tail -f ../logs/daily-scraper.log

# Manuel test
cd scripts && python daily-scraper.py
```

## 📅 Güncelleme Planı

- **Günlük**: LinkedIn ve Medium verileri otomatik güncellenir
- **Haftalık**: Scraper performansı log'lardan kontrol edilir
- **Aylık**: Script'ler ve kütüphaneler güncellenir

## 🔧 Geliştirme

### Yeni Platform Ekleme

1. `new-platform-scraper.py` oluştur
2. `daily-scraper.py`'a entegre et
3. `requirements.txt`'e kütüphaneleri ekle
4. API interface'ini güncelle

### Performans Optimizasyonu

- Paralel scraping implementasyonu
- Caching mekanizması
- Incremental updates
- Error recovery

## 📞 Destek

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Manual test çalıştırın
3. GitHub Issues açın
4. Documentation güncelleyin

---

**Not**: Bu script'ler web scraping kullanır. Platform'ların terms of service'lerini kontrol edin ve respectful usage yapın. 