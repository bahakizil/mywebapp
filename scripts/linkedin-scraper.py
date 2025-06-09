#!/usr/bin/env python3
"""
LinkedIn Posts Scraper
Günlük çalışan Selenium ile LinkedIn posts verilerini çeken script
Gerçek engagement verilerini (likes, comments, shares) çeker
"""

import json
import time
import os
import re
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class LinkedInScraper:
    def __init__(self):
        self.driver = None
        self.output_file = "../data/linkedin-posts.json"
        self.profile_url = "https://www.linkedin.com/in/bahakizil"
        
    def setup_driver(self):
        """Chrome driver'ı headless modda başlat"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self.driver.implicitly_wait(10)

    def login_to_linkedin(self, email, password):
        """LinkedIn'e giriş yap"""
        try:
            self.driver.get("https://www.linkedin.com/login")
            time.sleep(3)
            
            # Email ve password alanlarını doldur
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "username"))
            )
            password_field = self.driver.find_element(By.ID, "password")
            
            email_field.clear()
            email_field.send_keys(email)
            time.sleep(1)
            
            password_field.clear()
            password_field.send_keys(password)
            time.sleep(1)
            
            # Giriş butonuna tıkla
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Giriş kontrolü - farklı element'ler dene
            login_success = False
            for selector in [".global-nav", ".feed-container", "[data-urn*='urn:li:page:d_flagship3_feed']"]:
                try:
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    login_success = True
                    break
                except TimeoutException:
                    continue
            
            if login_success:
                print("✅ LinkedIn'e başarıyla giriş yapıldı")
                return True
            else:
                print("❌ LinkedIn giriş kontrolü başarısız")
                return False
            
        except Exception as e:
            print(f"❌ LinkedIn giriş hatası: {e}")
            return False

    def extract_number_from_text(self, text):
        """Text'ten sayı çıkar (1.2K -> 1200, 5M -> 5000000)"""
        if not text:
            return 0
            
        text = text.strip().replace(',', '').replace('.', '')
        
        # K, M gibi kısaltmaları işle
        multipliers = {'K': 1000, 'M': 1000000, 'B': 1000000000}
        
        for suffix, multiplier in multipliers.items():
            if suffix in text.upper():
                try:
                    number = float(re.findall(r'[\d.]+', text)[0])
                    return int(number * multiplier)
                except:
                    continue
        
        # Normal sayı
        try:
            numbers = re.findall(r'\d+', text)
            return int(numbers[0]) if numbers else 0
        except:
            return 0

    def scrape_posts(self):
        """Profil sayfasından posts'ları scrape et"""
        posts = []
        
        try:
            # Feed sayfasına git
            self.driver.get("https://www.linkedin.com/feed/")
            time.sleep(5)
            
            # Profil activity sayfasına git
            activity_url = "https://www.linkedin.com/in/bahakizil/recent-activity/all/"
            self.driver.get(activity_url)
            print(f"📄 Sayfa yükleniyor: {activity_url}")
            time.sleep(8)
            
            # Sayfayı aşağı kaydır
            for i in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(3)
            
            # Post container'larını bul
            post_selectors = [
                ".feed-shared-update-v2",
                ".occludable-update",  
                "[data-urn*='urn:li:activity']",
                ".artdeco-card",
                ".update-components-linkedinvideo",
                ".feed-shared-article",
                ".profile-creator-shared-feed-update__container"
            ]
            
            post_elements = []
            for selector in post_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        post_elements = elements
                        print(f"✅ {len(elements)} post bulundu - selector: {selector}")
                        break
                except:
                    continue
            
            if not post_elements:
                print("❌ Post element'leri bulunamadı, alternatif yöntem deneniyor...")
                # Tüm post-benzeri div'leri bul
                all_divs = self.driver.find_elements(By.TAG_NAME, "div")
                post_elements = [div for div in all_divs if div.text and len(div.text) > 100][:10]
                print(f"📄 {len(post_elements)} alternatif element bulundu")
            
            for i, post_element in enumerate(post_elements[:6]):
                try:
                    print(f"🔍 Post {i+1} işleniyor...")
                    
                    # Post text'ini al
                    post_text = ""
                    text_selectors = [
                        ".feed-shared-text",
                        ".attributed-text-segment-list__content",
                        ".break-words",
                        ".feed-shared-inline-show-more-text",
                        "[data-test-id='post-text']"
                    ]
                    
                    for text_selector in text_selectors:
                        try:
                            text_elements = post_element.find_elements(By.CSS_SELECTOR, text_selector)
                            if text_elements:
                                post_text = text_elements[0].text.strip()
                                if post_text:
                                    break
                        except:
                            continue
                    
                    # Eğer text bulunamazsa, element'in genel text'ini al
                    if not post_text:
                        post_text = post_element.text.strip()
                        # Çok uzun ise sadece ilk kısmını al
                        post_text = post_text.split('\n')[0][:500]
                    
                    # Tarih bilgisini al
                    post_time = None
                    time_selectors = [
                        "time[datetime]",
                        ".feed-shared-actor__sub-description time",
                        "[data-test-id='time-stamp']"
                    ]
                    
                    for time_selector in time_selectors:
                        try:
                            time_elements = post_element.find_elements(By.CSS_SELECTOR, time_selector)
                            for time_elem in time_elements:
                                datetime_attr = time_elem.get_attribute("datetime")
                                if datetime_attr:
                                    post_time = datetime_attr
                                    break
                            if post_time:
                                break
                        except:
                            continue
                    
                    # Engagement verilerini al
                    likes = 0
                    comments = 0
                    shares = 0
                    
                    # Likes
                    like_selectors = [
                        ".social-counts-reactions__count",
                        "[aria-label*='reaction']",
                        ".social-counts-reactions",
                        "[data-test-id='social-action-counts-reactions']"
                    ]
                    
                    for like_selector in like_selectors:
                        try:
                            like_elements = post_element.find_elements(By.CSS_SELECTOR, like_selector)
                            for like_elem in like_elements:
                                like_text = like_elem.text.strip()
                                if like_text:
                                    likes = self.extract_number_from_text(like_text)
                                    if likes > 0:
                                        break
                            if likes > 0:
                                break
                        except:
                            continue
                    
                    # Comments
                    comment_selectors = [
                        ".social-counts-comments",
                        "[aria-label*='comment']",
                        "[data-test-id='social-action-counts-comments']"
                    ]
                    
                    for comment_selector in comment_selectors:
                        try:
                            comment_elements = post_element.find_elements(By.CSS_SELECTOR, comment_selector)
                            for comment_elem in comment_elements:
                                comment_text = comment_elem.text.strip()
                                if comment_text:
                                    comments = self.extract_number_from_text(comment_text)
                                    if comments > 0:
                                        break
                            if comments > 0:
                                break
                        except:
                            continue
                    
                    # Shares/Reposts
                    share_selectors = [
                        ".social-counts-shares",
                        "[aria-label*='repost']",
                        "[data-test-id='social-action-counts-shares']"
                    ]
                    
                    for share_selector in share_selectors:
                        try:
                            share_elements = post_element.find_elements(By.CSS_SELECTOR, share_selector)
                            for share_elem in share_elements:
                                share_text = share_elem.text.strip()
                                if share_text:
                                    shares = self.extract_number_from_text(share_text)
                                    if shares > 0:
                                        break
                            if shares > 0:
                                break
                        except:
                            continue
                    
                    # Post URL'ini bul (gerçek LinkedIn post URL'i)
                    post_url = f"https://www.linkedin.com/posts/bahakizil_activity-{int(time.time())}-{i}"
                    
                    # Gerçek post link'ini bulmaya çalış
                    link_selectors = [
                        "a[href*='/posts/']",
                        "a[href*='activity']",
                        ".feed-shared-control-menu__trigger"
                    ]
                    
                    for link_selector in link_selectors:
                        try:
                            link_elements = post_element.find_elements(By.CSS_SELECTOR, link_selector)
                            for link_elem in link_elements:
                                href = link_elem.get_attribute("href")
                                if href and ("/posts/" in href or "activity" in href):
                                    post_url = href
                                    break
                            if "/posts/" in post_url or "activity" in post_url:
                                break
                        except:
                            continue
                    
                    # Post'u kaydet (sadece anlamlı content varsa)
                    if post_text and len(post_text) > 20:
                        post_id = f"real-{int(time.time())}-{i}"
                        
                        post_data = {
                            "id": post_id,
                            "text": post_text[:500] + ("..." if len(post_text) > 500 else ""),
                            "publishedAt": post_time or datetime.now().isoformat(),
                            "author": {
                                "name": "Baha Kizil",
                                "headline": "AI Engineer & Computer Vision Specialist"
                            },
                            "engagement": {
                                "likes": likes,
                                "comments": comments,
                                "shares": shares
                            },
                            "url": post_url,
                            "scrapedAt": datetime.now().isoformat()
                        }
                        
                        posts.append(post_data)
                        print(f"✅ Post {i+1}: {likes} likes, {comments} comments, {shares} shares")
                        print(f"   Text: {post_text[:100]}...")
                    
                except Exception as e:
                    print(f"⚠️ Post {i+1} scrape hatası: {e}")
                    continue
            
        except Exception as e:
            print(f"❌ Posts scraping hatası: {e}")
        
        return posts

    def save_posts(self, posts):
        """Posts'ları JSON dosyasına kaydet"""
        try:
            # Data klasörünü oluştur
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            
            # Metadata ekle
            data = {
                "lastUpdated": datetime.now().isoformat(),
                "nextUpdate": (datetime.now() + timedelta(days=1)).isoformat(),  # Günlük güncelleme
                "source": "selenium-scraper-enhanced",
                "posts": posts
            }
            
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ {len(posts)} posts kaydedildi: {self.output_file}")
            
        except Exception as e:
            print(f"❌ Dosya kaydetme hatası: {e}")

    def run(self, email, password):
        """Ana scraping işlemini çalıştır"""
        try:
            print("🚀 LinkedIn Scraper başlatılıyor...")
            
            self.setup_driver()
            
            if self.login_to_linkedin(email, password):
                posts = self.scrape_posts()
                
                if posts:
                    self.save_posts(posts)
                    print(f"✅ Scraping tamamlandı! {len(posts)} posts alındı")
                    
                    # İstatistikleri göster
                    total_likes = sum(post['engagement']['likes'] for post in posts)
                    total_comments = sum(post['engagement']['comments'] for post in posts)
                    total_shares = sum(post['engagement']['shares'] for post in posts)
                    
                    print(f"📊 Toplam engagement: {total_likes} likes, {total_comments} comments, {total_shares} shares")
                else:
                    print("⚠️ Hiç post bulunamadı")
                    
                return len(posts) > 0
            
        except Exception as e:
            print(f"❌ Scraper hatası: {e}")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()
                print("🔐 Browser kapatıldı")

if __name__ == "__main__":
    # LinkedIn credentials'larını environment variable'lardan al
    linkedin_email = os.getenv("LINKEDIN_EMAIL")
    linkedin_password = os.getenv("LINKEDIN_PASSWORD")
    
    if not linkedin_email or not linkedin_password:
        print("❌ LINKEDIN_EMAIL ve LINKEDIN_PASSWORD environment variable'ları gerekli")
        print("Kullanım: LINKEDIN_EMAIL=email LINKEDIN_PASSWORD=pass python linkedin-scraper.py")
        exit(1)
    
    scraper = LinkedInScraper()
    success = scraper.run(linkedin_email, linkedin_password)
    exit(0 if success else 1) 