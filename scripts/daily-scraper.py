#!/usr/bin/env python3
"""
Daily Data Scraper
LinkedIn ve Medium'dan günlük veri çekme script'i
Her gün saat 08:00'de çalışacak şekilde ayarlanabilir
"""

import os
import sys
import json
import subprocess
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class DailyScraper:
    def __init__(self):
        self.linkedin_email = os.getenv("LINKEDIN_EMAIL")
        self.linkedin_password = os.getenv("LINKEDIN_PASSWORD")
        self.notification_email = os.getenv("NOTIFICATION_EMAIL", "kizilbaha26@gmail.com")
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
    def log(self, message):
        """Log mesajını timestamp ile yazdır"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {message}")

    def run_linkedin_scraper(self):
        """LinkedIn scraper'ı çalıştır"""
        self.log("🔵 LinkedIn scraper başlatılıyor...")
        
        if not self.linkedin_email or not self.linkedin_password:
            self.log("❌ LinkedIn credentials eksik (LINKEDIN_EMAIL, LINKEDIN_PASSWORD)")
            return False
        
        try:
            # LinkedIn scraper'ı çalıştır
            cmd = [
                sys.executable, 
                os.path.join(self.script_dir, "linkedin-scraper.py")
            ]
            
            env = os.environ.copy()
            env.update({
                "LINKEDIN_EMAIL": self.linkedin_email,
                "LINKEDIN_PASSWORD": self.linkedin_password
            })
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                env=env,
                timeout=300  # 5 dakika timeout
            )
            
            if result.returncode == 0:
                self.log("✅ LinkedIn scraper başarıyla tamamlandı")
                self.log(f"LinkedIn output: {result.stdout[-200:]}")  # Son 200 karakter
                return True
            else:
                self.log(f"❌ LinkedIn scraper hatası: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            self.log("⏰ LinkedIn scraper timeout (5 dakika)")
            return False
        except Exception as e:
            self.log(f"❌ LinkedIn scraper exception: {e}")
            return False

    def run_medium_scraper(self):
        """Medium scraper'ı çalıştır"""
        self.log("🟠 Medium scraper başlatılıyor...")
        
        try:
            # Medium scraper'ı çalıştır
            cmd = [sys.executable, os.path.join(self.script_dir, "medium-scraper.py")]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True,
                timeout=300  # 5 dakika timeout
            )
            
            if result.returncode == 0:
                self.log("✅ Medium scraper başarıyla tamamlandı")
                self.log(f"Medium output: {result.stdout[-200:]}")  # Son 200 karakter
                return True
            else:
                self.log(f"❌ Medium scraper hatası: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            self.log("⏰ Medium scraper timeout (5 dakika)")
            return False
        except Exception as e:
            self.log(f"❌ Medium scraper exception: {e}")
            return False

    def check_data_freshness(self):
        """Çekilen verilerin güncellik durumunu kontrol et"""
        data_dir = os.path.join(self.script_dir, "..", "data")
        
        linkedin_file = os.path.join(data_dir, "linkedin-posts.json")
        medium_file = os.path.join(data_dir, "medium-articles.json")
        
        results = {
            "linkedin": {"exists": False, "fresh": False, "posts": 0, "engagement": {}},
            "medium": {"exists": False, "fresh": False, "articles": 0, "engagement": {}}
        }
        
        # LinkedIn verisini kontrol et
        if os.path.exists(linkedin_file):
            try:
                with open(linkedin_file, 'r', encoding='utf-8') as f:
                    linkedin_data = json.load(f)
                
                results["linkedin"]["exists"] = True
                results["linkedin"]["posts"] = len(linkedin_data.get("posts", []))
                
                # Engagement toplamları
                total_likes = sum(post.get("engagement", {}).get("likes", 0) for post in linkedin_data.get("posts", []))
                total_comments = sum(post.get("engagement", {}).get("comments", 0) for post in linkedin_data.get("posts", []))
                total_shares = sum(post.get("engagement", {}).get("shares", 0) for post in linkedin_data.get("posts", []))
                
                results["linkedin"]["engagement"] = {
                    "likes": total_likes,
                    "comments": total_comments,
                    "shares": total_shares
                }
                
                # Güncellik kontrolü (son 24 saat içinde mi?)
                last_updated = linkedin_data.get("lastUpdated")
                if last_updated:
                    from dateutil import parser
                    updated_time = parser.parse(last_updated)
                    now = datetime.now(updated_time.tzinfo) if updated_time.tzinfo else datetime.now()
                    results["linkedin"]["fresh"] = (now - updated_time).total_seconds() < 86400  # 24 saat
                
            except Exception as e:
                self.log(f"⚠️ LinkedIn veri kontrolü hatası: {e}")
        
        # Medium verisini kontrol et
        if os.path.exists(medium_file):
            try:
                with open(medium_file, 'r', encoding='utf-8') as f:
                    medium_data = json.load(f)
                
                results["medium"]["exists"] = True
                results["medium"]["articles"] = len(medium_data.get("articles", []))
                
                # Engagement toplamları
                total_claps = sum(article.get("engagement", {}).get("claps", 0) for article in medium_data.get("articles", []))
                total_responses = sum(article.get("engagement", {}).get("responses", 0) for article in medium_data.get("articles", []))
                total_views = sum(article.get("engagement", {}).get("views", 0) for article in medium_data.get("articles", []))
                
                results["medium"]["engagement"] = {
                    "claps": total_claps,
                    "responses": total_responses,
                    "views": total_views
                }
                
                # Güncellik kontrolü
                last_updated = medium_data.get("lastUpdated")
                if last_updated:
                    from dateutil import parser
                    updated_time = parser.parse(last_updated)
                    now = datetime.now(updated_time.tzinfo) if updated_time.tzinfo else datetime.now()
                    results["medium"]["fresh"] = (now - updated_time).total_seconds() < 86400  # 24 saat
                
            except Exception as e:
                self.log(f"⚠️ Medium veri kontrolü hatası: {e}")
        
        return results

    def send_notification(self, success_count, total_count, data_stats):
        """E-mail bildirimi gönder (opsiyonel)"""
        try:
            # Basit log mesajı (e-mail gönderimi opsiyonel)
            if success_count == total_count:
                self.log(f"📧 Bildirim: {success_count}/{total_count} scraper başarılı")
            else:
                self.log(f"⚠️ Bildirim: {success_count}/{total_count} scraper başarılı")
            
            # Data istatistikleri
            linkedin_stats = data_stats.get("linkedin", {})
            medium_stats = data_stats.get("medium", {})
            
            self.log(f"📊 LinkedIn: {linkedin_stats.get('posts', 0)} posts, {linkedin_stats.get('engagement', {}).get('likes', 0)} likes")
            self.log(f"📊 Medium: {medium_stats.get('articles', 0)} articles, {medium_stats.get('engagement', {}).get('claps', 0)} claps")
            
        except Exception as e:
            self.log(f"📧 Bildirim gönderme hatası: {e}")

    def run(self):
        """Ana scraping işlemini çalıştır"""
        self.log("🚀 Daily Scraper başlatılıyor...")
        self.log(f"📅 Tarih: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        success_count = 0
        total_count = 2
        
        # LinkedIn scraper'ı çalıştır
        if self.run_linkedin_scraper():
            success_count += 1
        
        # Medium scraper'ı çalıştır
        if self.run_medium_scraper():
            success_count += 1
        
        # Veri durumunu kontrol et
        data_stats = self.check_data_freshness()
        
        # Bildirim gönder
        self.send_notification(success_count, total_count, data_stats)
        
        # Özet rapor
        self.log("=" * 50)
        self.log("📋 GÜNLÜK SCRAPER RAPORU")
        self.log("=" * 50)
        self.log(f"✅ Başarılı: {success_count}/{total_count}")
        
        linkedin_stats = data_stats.get("linkedin", {})
        medium_stats = data_stats.get("medium", {})
        
        self.log(f"🔵 LinkedIn: {linkedin_stats.get('posts', 0)} posts")
        if linkedin_stats.get("engagement"):
            eng = linkedin_stats["engagement"]
            self.log(f"   📊 {eng.get('likes', 0)} likes, {eng.get('comments', 0)} comments, {eng.get('shares', 0)} shares")
        
        self.log(f"🟠 Medium: {medium_stats.get('articles', 0)} articles")
        if medium_stats.get("engagement"):
            eng = medium_stats["engagement"]
            self.log(f"   📊 {eng.get('claps', 0)} claps, {eng.get('responses', 0)} responses, {eng.get('views', 0)} views")
        
        self.log("=" * 50)
        
        # Exit code
        if success_count == total_count:
            self.log("🎉 Tüm scraper'lar başarıyla tamamlandı!")
            return True
        else:
            self.log("⚠️ Bazı scraper'lar başarısız oldu")
            return False

if __name__ == "__main__":
    scraper = DailyScraper()
    success = scraper.run()
    sys.exit(0 if success else 1) 