# Portfolio Setup Guide - Static Data System

## 📋 Overview

Bu portfölio sitesi artık **static data cache sistemi** kullanıyor. Data, günde 1 kere otomatik olarak çekiliyor ve dosyalara kaydediliyor. Bu sayede:

- ✅ **Hızlı sayfa yükleme** - Her ziyaretçi için API çağrısı yok
- ✅ **API rate limiting yok** - GitHub/Medium API'lerinden korunuyor
- ✅ **Güvenilir performans** - API down olsa bile site çalışıyor
- ✅ **Güncel data** - Günde 1 kere taze data

## 🔧 Sistem Nasıl Çalışıyor?

### 1. Data Sync Process
```bash
# Manuel sync
npm run sync-data

# Otomatik günlük sync (cron job)
./scripts/daily-sync.sh
```

### 2. Data Dosyaları
- `data/portfolio-data.json` - Tüm data burada saklanıyor
- `logs/sync-*.log` - Sync logları (7 gün saklanıyor)

### 3. API Endpoints
- `/api/repos` - GitHub repositories (static)
- `/api/medium` - Medium articles (static)  
- `/api/linkedin` - LinkedIn posts (static)

## 🚀 Production Setup

### 1. Environment Variables
`.env.local` dosyasına ekle:
```env
GITHUB_USERNAME=bahakizil
GITHUB_TOKEN=your_github_token
MEDIUM_USERNAME=@bahakizil
```

### 2. İlk Data Sync
```bash
npm run sync-data
```

### 3. Cron Job Setup (Günlük Otomatik Sync)

#### macOS/Linux:
```bash
# Crontab'ı aç
crontab -e

# Her gün saat 02:00'da çalışacak şekilde ekle
0 2 * * * /Users/bahakizil/Downloads/mypage/scripts/daily-sync.sh

# Crontab'ı kaydet ve çık
```

#### Windows (Task Scheduler):
1. Task Scheduler'ı aç
2. "Create Basic Task" tıkla
3. Daily, 02:00 olarak ayarla
4. Script: `scripts/daily-sync.sh`

### 4. Build Process
Build sırasında otomatik sync:
```bash
npm run build  # Otomatik olarak npm run sync-data çalışır
```

## 📊 Data Kaynakları

### GitHub Repositories
- **Kaynak**: GitHub API
- **Limit**: Authenticated: 5000/saat, Unauthenticated: 60/saat
- **Cache**: 24 saat
- **Fallback**: Mock data

### Medium Articles  
- **Kaynak**: RSS Feed
- **Limit**: Yok
- **Cache**: 24 saat
- **Fallback**: Mock data

### LinkedIn Posts
- **Kaynak**: Scraped JSON file veya mock data
- **Cache**: 24 saat
- **Real Data**: `scripts/linkedin-scraper.py` ile

## 🔍 Troubleshooting

### Data Güncellenmiyorsa:
```bash
# Manuel sync test
npm run sync-data

# Log kontrolü
tail -f logs/sync-$(date +%Y%m%d).log

# Cache temizle
rm -f data/portfolio-data.json
npm run sync-data
```

### API Hatalarında:
- GitHub: Rate limit kontrolü
- Medium: RSS feed erişimi kontrolü
- LinkedIn: Mock data kullanılıyor

### Cron Job Çalışmıyorsa:
```bash
# Cron job listesi
crontab -l

# Cron service durumu (Linux)
systemctl status cron

# Log kontrolü
grep CRON /var/log/syslog
```

## 📈 Monitoring

### Sync Status
```bash
# Son sync zamanı
cat data/portfolio-data.json | grep lastUpdated

# Log dosyaları
ls -la logs/
```

### Performance
- **İlk yükleme**: ~2-3 saniye
- **Sonraki yüklemeler**: ~200-500ms (cache sayesinde)
- **API response**: ~50-100ms (static files)

## 🔄 Manual Update

Acil veri güncellemesi gerekirse:
```bash
# Data sync
npm run sync-data

# Development server restart (gerekirse)
npm run dev
```

## 📝 Maintenance

### Haftalık:
- Log dosyalarını kontrol et
- Sync başarı oranını kontrol et

### Aylık:  
- GitHub token'ı kontrol et
- Medium RSS feed'i test et
- LinkedIn scraper'ı güncelle

### API Token Yenileme:
1. GitHub: Settings > Developer settings > Personal access tokens
2. Medium: RSS feed, token gerektirmiyor
3. LinkedIn: Manuel scraping, token yok

## 🎯 Next Steps

1. **Real LinkedIn Data**: `scripts/linkedin-scraper.py` kullan
2. **CDN Setup**: Cloudflare ile cache optimization
3. **Webhook Integration**: Auto-deploy on data changes
4. **Analytics**: Data sync success tracking 