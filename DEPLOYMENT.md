# Vercel Deployment Guide

Bu rehber portfolyo uygulamanızı Vercel'e deploy etmek ve monitoring sistemini kurmak için gerekli adımları içermektedir.

## 🚀 Deployment Adımları

### 1. Environment Variables Ayarlama

Vercel dashboard'da aşağıdaki environment variable'ları ayarlayın:

```bash
# Zorunlu
DATA_REFRESH_TOKEN=your-secure-random-token-here
GITHUB_API_TOKEN=ghp_your_github_token_here

# İsteğe bağlı
RESEND_API_KEY=your_resend_api_key
OG_IMAGE_SECRET=your_og_image_secret
LINKEDIN_CLIENT_ID=your-linkedin-app-id
LINKEDIN_CLIENT_SECRET=your-linkedin-secret
```

### 2. Vercel.json Konfigürasyonu

`vercel.json` dosyası zaten hazırlanmıştır ve şunları içermektedir:
- Function timeout ayarları
- Cache headers
- Region optimizasyonu (iad1 - US East)

### 3. Analytics & Monitoring

#### Vercel Analytics
- Otomatik olarak aktif olur
- Page views, unique visitors, referrers izler
- Real-time analytics sunar

#### Vercel Speed Insights
- Core Web Vitals izler
- Performance metrics toplar
- Mobile/desktop performance karşılaştırır

## 📊 Data Management

### Manual Data Refresh

Artık API'ler otomatik çalışmaz. Data güncellemek için:

#### Local Development
```bash
npm run refresh-data
```

#### Production
```bash
# Production URL'i script'te güncellemeyi unutmayın
npm run refresh-data -- --prod
```

#### Custom URL
```bash
npm run refresh-data -- --url=https://your-domain.vercel.app
```

### API Endpoint

Direkt API çağrısı:
```bash
curl -X POST \
  -H "Authorization: Bearer your-token-here" \
  https://your-domain.vercel.app/api/refresh-data
```

## 📈 Monitoring & Analytics

### Vercel Analytics Dashboard
- https://vercel.com/your-username/your-project/analytics
- Real-time visitor data
- Top pages tracking
- Referrer analysis

### Speed Insights Dashboard  
- https://vercel.com/your-username/your-project/speed-insights
- Core Web Vitals scores
- Performance trends
- Device-specific metrics

### Custom Events (İsteğe bağlı)

Analytics'e custom events eklemek için:

```typescript
import { track } from '@vercel/analytics';

// Button click tracking
const handleCVDownload = () => {
  track('cv_download', { location: 'hero_section' });
  // Download logic
};

// Project view tracking  
const handleProjectClick = (projectName: string) => {
  track('project_view', { project: projectName });
};
```

## 🔧 Troubleshooting

### Data Refresh İssues
1. `DATA_REFRESH_TOKEN` environment variable'ın set olduğundan emin olun
2. GitHub API token'ının valid olduğunu kontrol edin
3. Rate limiting için GitHub token kullanın

### Analytics Not Working
1. Vercel Analytics feature'ının enabled olduğunu kontrol edin
2. `@vercel/analytics` package'ının latest version olduğundan emin olun
3. Browser'da analytics events'lerin fire olup olmadığını Network tab'den kontrol edin

### Performance Issues
1. Vercel Speed Insights dashboard'dan bottleneck'leri kontrol edin
2. Image optimization için Next.js Image component kullandığınızdan emin olun
3. Bundle size analiz edin: `npm run build -- --analyze`

## 📋 Deploy Checklist

- [ ] Environment variables set edildi
- [ ] `DATA_REFRESH_TOKEN` güvenli ve complex
- [ ] GitHub API token valid ve permissions correct
- [ ] Production URL script'te güncellendi
- [ ] Analytics dashboard'a erişim var
- [ ] Initial data refresh yapıldı
- [ ] SSL certificate active
- [ ] Custom domain (eğer varsa) configured

## 🎯 Production Best Practices

1. **Security**: API token'larını asla git'e commit etmeyin
2. **Performance**: Image'leri WebP formatında kullanın
3. **Monitoring**: Analytics ve Speed Insights'ı düzenli kontrol edin
4. **Data**: Production data'yı haftada 1-2 kez refresh edin
5. **Backup**: Critical data'nın local backup'larını alın

Deploy olduktan sonra `npm run refresh-data -- --prod` çalıştırmayı unutmayın!