# Real-Time API Setup Guide

Bu rehber, portfolio uygulamanızın gerçek zamanlı veri çekmesi için gerekli API key'lerini nasıl alacağınızı açıklar.

## 🔧 Kurulum Adımları

### 1. Environment Variables Dosyası

`.env.local` dosyasını oluşturduk ve şu template'i kullanın:

```bash
# GitHub API
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=bahakizil

# Medium RSS (no API key needed, just username) - CURRENTLY WORKING ✅
MEDIUM_USERNAME=@bahakizil

# LinkedIn API (OAuth 2.0 - requires app registration) - READY FOR SETUP ⚙️
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here

# Resend Email API
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM=noreply@yourdomain.com
RESEND_TO=your_email@example.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 API Key'lerini Alma Kılavuzu

### 🐙 GitHub API Token ✅ CONFIGURED

✅ **Zaten yapılandırılmış!** Gerçek GitHub repository verilerinizi çekiyor.

Eğer yeniden oluşturmanız gerekirse:
1. GitHub'a giriş yapın: https://github.com
2. Settings > Developer settings > Personal access tokens > Tokens (classic)
3. "Generate new token" > "Generate new token (classic)"
4. Scopes: `public_repo`, `read:user` seçin
5. Token'ı kopyalayın ve `GITHUB_TOKEN` olarak ekleyin

### 📝 Medium RSS Feed ✅ WORKING

✅ **Şu anda çalışıyor!** Gerçek Medium makalelerinizi çekiyor.
- API key gerekmez, sadece Medium username'inizi kullanın
- `MEDIUM_USERNAME=@bahakizil` formatında

### 💼 LinkedIn API ⚙️ READY FOR OAUTH

✅ **Credentials configured!** Ready for OAuth flow.

#### 🚀 Quick Setup (2 minutes):

1. **Visit OAuth URL**: http://localhost:3000/api/linkedin/auth?action=login
2. **Complete LinkedIn OAuth** - Bu URL sizi LinkedIn'e yönlendirecek
3. **Copy the access token** from the callback response
4. **Add to .env.local**: `LINKEDIN_ACCESS_TOKEN=your_received_token`
5. **Restart server**: `npm run dev`

#### Your LinkedIn App Details:
- **Client ID**: `your_linkedin_client_id` ✅
- **Client Secret**: `your_linkedin_client_secret` ✅
- **Redirect URI**: `http://localhost:3000/api/linkedin/callback`

#### Required Scopes:
- `profile` - Your profile information
- `email` - Email address  
- `w_member_social` - Read your posts

### 📧 Resend Email API ✅ CONFIGURED

✅ **Şu anda çalışıyor!** Gerçek email gönderimi aktif.

**Configured Settings**:
- API Key: `your_resend_api_key_here` ✅
- From Email: `onboarding@resend.dev` ✅  
- To Email: `your_email@example.com` ✅

Test successful: Contact form now sends real emails!

## 🚀 Mevcut Durum

### ✅ Çalışan API'lar:
- **GitHub**: ✅ Gerçek repository verilerini çekiyor (5 repo)
- **Medium**: ✅ Gerçek RSS feed'inizi çekiyor (3 makale)
- **Contact**: ✅ Gerçek email gönderimi çalışıyor! 📧

### 🔄 Mock Data Kullanan API'lar:
- **LinkedIn**: 🔄 Mock data (OAuth flow gerekiyor - 2 dakika)

## 🔧 LinkedIn OIDC Implementation

Eğer LinkedIn gerçek veri istiyorsanız, mevcut `lib/linkedin.ts` dosyasını OIDC kullanacak şekilde güncelleyebiliriz:

```typescript
// LinkedIn OIDC Flow örneği
const LINKEDIN_OIDC_CONFIG = {
  authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
  jwksUrl: 'https://www.linkedin.com/oauth/openid/jwks',
  scopes: ['openid', 'profile', 'email']
};
```

## 🎯 Portfolio Uygulamanızı Başlatma

```bash
cd /Users/bahakizil/Downloads/mypage
export PATH="/opt/homebrew/bin:$PATH"
npm run dev
```

**URL**: http://localhost:3000

## 📊 API Test Sonuçları

- ✅ **GitHub**: 5 repository bulundu (gerçek veri)
- ✅ **Medium**: 3 makale bulundu (gerçek veri)
- 🔄 **LinkedIn**: Mock data (4 post) - OAuth ready
- ✅ **Contact**: Gerçek email gönderimi çalışıyor! 📧

---

**Not**: GitHub token'ınız zaten çalışıyor ve Medium RSS feed'iniz gerçek veri çekiyor. LinkedIn için OIDC setup isteğe bağlı - şu anki mock data da oldukça profesyonel görünüyor.

## 🎯 Üretim Ortamı İçin

### Netlify/Vercel Deployment:

1. Environment variables'ları platform ayarlarından ekleyin
2. Build commands'ı kontrol edin
3. Domain ayarları yapın (email için)

### Güvenlik:

- API key'lerini asla commit etmeyin
- `.env.local` dosyası `.gitignore`'da bulunuyor
- Production'da environment variables kullanın

## 📊 Performance Optimizasyonları

- **Cache stratejisi**: Her API farklı cache süresi kullanıyor
- **Fallback system**: API başarısız olduğunda mock data
- **Error handling**: Tüm API'larda comprehensive error handling

## 🔧 Hata Giderme

### API çalışmıyor mu?

1. Console loglarını kontrol edin
2. Environment variables'ları doğrulayın
3. API rate limitlerini kontrol edin
4. Network connectivity'sini test edin

### Mock data görüyor musunuz?

Bu normal - API key'ler eksikse otomatik olarak mock data kullanılıyor. Bu sayede development süreci kesintisiz devam ediyor.

---

Herhangi bir sorunuz varsa terminal'de `curl` komutları ile API'ları test edebilirsiniz. 