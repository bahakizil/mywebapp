#!/bin/bash

# Daily Scraper Cron Setup
# Her gün saat 08:00'de LinkedIn ve Medium scraper'larını çalıştırır

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DAILY_SCRAPER="$SCRIPT_DIR/daily-scraper.py"
LOG_DIR="$PROJECT_DIR/logs"

echo "🔧 Daily Scraper Cron Job Kurulumu"
echo "=================================="

# Log klasörünü oluştur
mkdir -p "$LOG_DIR"

# Python gereksinimlerini kontrol et
echo "📦 Python kütüphanelerini kontrol ediliyor..."
cd "$SCRIPT_DIR"

if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt bulunamadı"
    exit 1
fi

# Virtual environment oluştur (yoksa)
if [ ! -d "venv" ]; then
    echo "🐍 Python virtual environment oluşturuluyor..."
    python3 -m venv venv
fi

# Virtual environment'ı aktive et
source venv/bin/activate

# Gereksinimleri yükle
echo "📦 Gereksinimler yükleniyor..."
pip install -r requirements.txt

# Environment variables kontrolü
echo "🔐 Environment variables kontrol ediliyor..."

if [ -z "$LINKEDIN_EMAIL" ] || [ -z "$LINKEDIN_PASSWORD" ]; then
    echo "⚠️  UYARI: LinkedIn credentials eksik"
    echo "   LINKEDIN_EMAIL ve LINKEDIN_PASSWORD environment variable'ları gerekli"
    echo "   Örnek kullanım:"
    echo "   export LINKEDIN_EMAIL='your-email@example.com'"
    echo "   export LINKEDIN_PASSWORD='your-password'"
    echo ""
fi

# Cron job tanımı
CRON_COMMAND="0 8 * * * cd $SCRIPT_DIR && source venv/bin/activate && LINKEDIN_EMAIL=\$LINKEDIN_EMAIL LINKEDIN_PASSWORD=\$LINKEDIN_PASSWORD python daily-scraper.py >> $LOG_DIR/daily-scraper.log 2>&1"

echo "📅 Cron job kurulumu:"
echo "   Zaman: Her gün saat 08:00"
echo "   Script: $DAILY_SCRAPER"
echo "   Log: $LOG_DIR/daily-scraper.log"
echo ""

# Mevcut cron job'ları al
crontab -l > /tmp/mycron 2>/dev/null || touch /tmp/mycron

# Eski daily-scraper job'ı varsa kaldır
sed -i '/daily-scraper.py/d' /tmp/mycron

# Yeni job'ı ekle
echo "$CRON_COMMAND" >> /tmp/mycron

# Cron job'ı yükle
crontab /tmp/mycron

# Temizlik
rm /tmp/mycron

echo "✅ Cron job başarıyla kuruldu!"
echo ""
echo "📋 Kontrol komutları:"
echo "   crontab -l              # Aktif cron job'ları görüntüle"
echo "   tail -f $LOG_DIR/daily-scraper.log  # Log'ları takip et"
echo "   cd $SCRIPT_DIR && source venv/bin/activate && python daily-scraper.py  # Manuel test"
echo ""
echo "🔧 Cron job'ı kaldırmak için:"
echo "   crontab -e              # Düzenleyiciyi aç ve daily-scraper satırını sil"
echo ""

# Test çalıştırma seçeneği
read -p "🚀 Test çalıştırması yapmak ister misiniz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧪 Test çalıştırması başlatılıyor..."
    cd "$SCRIPT_DIR"
    source venv/bin/activate
    python daily-scraper.py
    echo ""
    echo "📊 Test tamamlandı!"
fi

echo "🎉 Kurulum tamamlandı!" 