#!/usr/bin/env python3
"""
Daily Medium API Data Updater
Fetches real Medium data directly from Medium API and saves to JSON
"""

import json
import requests
from datetime import datetime, timedelta
import logging
import os

# Setup logging
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'medium-api-updater.log')),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Medium API Configuration
RAPID_API_KEY = "f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a"
RAPID_API_HOST = "medium2.p.rapidapi.com"
BASE_URL = "https://medium2.p.rapidapi.com"
USERNAME = "bahakizil"

def make_api_request(endpoint):
    """Make request to Medium API"""
    url = f"{BASE_URL}{endpoint}"
    headers = {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"API request failed for {endpoint}: {e}")
        raise

def fetch_medium_data():
    """Fetch real Medium data from API"""
    try:
        logger.info("🚀 Starting Medium API data fetch...")
        
        # Step 1: Get user ID
        user_data = make_api_request(f"/user/id_for/{USERNAME}")
        user_id = user_data.get('id')
        logger.info(f"✅ Got user ID: {user_id}")
        
        # Step 2: Get user's articles
        articles_data = make_api_request(f"/user/{user_id}/articles")
        article_ids = articles_data.get('associated_articles', [])
        logger.info(f"✅ Got {len(article_ids)} article IDs")
        
        # Step 3: Get detailed info for each article
        articles = []
        for article_id in article_ids:
            try:
                article_info = make_api_request(f"/article/{article_id}")
                
                # Convert to our format
                article = {
                    "title": article_info.get('title', ''),
                    "link": article_info.get('url', ''),
                    "publishedDate": article_info.get('published_at', ''),
                    "description": article_info.get('subtitle', ''),
                    "categories": article_info.get('tags', []),
                    "author": "Baha Kizil",
                    "engagement": {
                        "claps": article_info.get('claps', 0),
                        "responses": article_info.get('responses_count', 0),
                        "views": max(100, int(article_info.get('claps', 0) * 4.5 + 100))  # Estimate views
                    }
                }
                
                articles.append(article)
                logger.info(f"✅ Fetched: {article['title'][:50]}... - {article['engagement']['claps']} claps")
                
            except Exception as e:
                logger.error(f"❌ Failed to fetch article {article_id}: {e}")
                continue
        
        return articles
        
    except Exception as e:
        logger.error(f"❌ Failed to fetch Medium data: {e}")
        return None

def save_medium_data(articles):
    """Save Medium data to JSON file"""
    try:
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(data_dir, exist_ok=True)
        
        formatted_data = {
            "lastUpdated": datetime.now().isoformat(),
            "nextUpdate": (datetime.now() + timedelta(days=1)).isoformat(),
            "source": "medium-api-real-time",
            "articles": articles
        }
        
        file_path = os.path.join(data_dir, 'medium-articles.json')
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Saved {len(articles)} articles to {file_path}")
        
        # Log engagement summary
        total_claps = sum(article['engagement']['claps'] for article in articles)
        total_views = sum(article['engagement']['views'] for article in articles)
        total_responses = sum(article['engagement']['responses'] for article in articles)
        
        logger.info(f"📊 Total engagement: {total_claps} claps, {total_views} views, {total_responses} responses")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to save data: {e}")
        return False

def main():
    """Main function"""
    logger.info("📅 Starting daily Medium API update")
    
    try:
        # Fetch real Medium data
        articles = fetch_medium_data()
        
        if not articles:
            logger.error("❌ No articles fetched, keeping existing data")
            return False
        
        # Save data
        if save_medium_data(articles):
            logger.info("🎉 Daily Medium API update completed successfully")
            return True
        else:
            logger.error("❌ Failed to save data")
            return False
            
    except Exception as e:
        logger.error(f"❌ Daily update failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 