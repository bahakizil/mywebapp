#!/bin/bash
# LinkedIn Scraper Setup Script
# Bu script LinkedIn scraper'ı kurar ve ayda bir çalışacak cron job oluşturur

echo "🚀 LinkedIn Scraper Setup başlatılıyor..."

# 1. Python dependencies'leri kur
echo "📦 Python dependencies kuruluyor..."
pip install -r requirements.txt

# 2. ChromeDriver'ı otomatik indir (webdriver-manager ile)
echo "🌐 ChromeDriver kontrol ediliyor..."
python -c "from selenium import webdriver; from selenium.webdriver.chrome.options import Options; options = Options(); options.add_argument('--headless'); driver = webdriver.Chrome(options=options); driver.quit(); print('✅ ChromeDriver hazır')"

# 3. Data klasörünü oluştur
echo "📁 Data klasörü oluşturuluyor..."
mkdir -p ../data

# 4. LinkedIn credentials'larını sor
echo ""
echo "🔐 LinkedIn Credentials Gerekli:"
echo "LinkedIn email ve password'ünüzü girerek scraper'ı test edeceğiz"
echo ""

read -p "LinkedIn Email: " LINKEDIN_EMAIL
read -s -p "LinkedIn Password: " LINKEDIN_PASSWORD
echo ""

# 5. Test scraper'ı çalıştır
echo "🧪 Scraper test ediliyor..."
LINKEDIN_EMAIL="$LINKEDIN_EMAIL" LINKEDIN_PASSWORD="$LINKEDIN_PASSWORD" python linkedin-scraper.py

# 6. Cron job oluştur (ayda bir, 1. günü saat 02:00'da)
echo ""
echo "⏰ Cron job oluşturuluyor (ayda bir çalışacak)..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRON_COMMAND="0 2 1 * * cd $SCRIPT_DIR && LINKEDIN_EMAIL=\"$LINKEDIN_EMAIL\" LINKEDIN_PASSWORD=\"$LINKEDIN_PASSWORD\" python linkedin-scraper.py >> ../logs/linkedin-scraper.log 2>&1"

# Mevcut cron job'ları al
(crontab -l 2>/dev/null | grep -v "linkedin-scraper.py"; echo "$CRON_COMMAND") | crontab -

echo "✅ Cron job eklendi: Her ayın 1'inde saat 02:00'da çalışacak"

# 7. Log klasörünü oluştur
mkdir -p ../logs

echo ""
echo "🎉 LinkedIn Scraper kurulumu tamamlandı!"
echo ""
echo "📋 Yapılanlar:"
echo "  ✅ Python dependencies kuruldu"
echo "  ✅ ChromeDriver hazırlandı"
echo "  ✅ İlk scraping testi yapıldı"
echo "  ✅ Ayda bir çalışacak cron job eklendi"
echo ""
echo "📊 Manual çalıştırma:"
echo "  cd scripts"
echo "  LINKEDIN_EMAIL=email LINKEDIN_PASSWORD=pass python linkedin-scraper.py"
echo ""
echo "📅 Otomatik güncelleme: Her ayın 1'inde saat 02:00"
echo "📝 Loglar: logs/linkedin-scraper.log" 