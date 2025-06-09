#!/usr/bin/env python3
"""
Rate Limited Social Media Data Updater
Updates Medium and LinkedIn data every 2 days to stay within API limits

API Limits:
- Medium2 API: 40 requests/month
- LinkedIn Data Scraper API: 40 requests/month
- Total budget: 80 requests/month
- Strategy: Update every 2 days = ~15 requests/month per API
"""

import json
import requests
import os
import logging
from datetime import datetime, timedelta
from pathlib import Path

# Setup logging
log_dir = Path(__file__).parent / 'logs'
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / 'rate-limited-updater.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# API Configuration
MEDIUM_API_KEY = "f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a"
LINKEDIN_API_KEY = "f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a"

# Rate limiting
LAST_UPDATE_FILE = log_dir / 'last_api_update.json'
UPDATE_INTERVAL_DAYS = 6  # Update every 6 days = ~5 times per month to stay within API limits

def load_last_update():
    """Load last update timestamp"""
    try:
        if LAST_UPDATE_FILE.exists():
            with open(LAST_UPDATE_FILE, 'r') as f:
                data = json.load(f)
                return datetime.fromisoformat(data['last_update'])
    except Exception as e:
        logger.warning(f"Could not load last update: {e}")
    
    return None

def save_last_update():
    """Save current timestamp as last update"""
    try:
        with open(LAST_UPDATE_FILE, 'w') as f:
            json.dump({
                'last_update': datetime.now().isoformat(),
                'next_update': (datetime.now() + timedelta(days=UPDATE_INTERVAL_DAYS)).isoformat()
            }, f, indent=2)
        logger.info("✅ Saved last update timestamp")
    except Exception as e:
        logger.error(f"Failed to save last update: {e}")

def should_update():
    """Check if we should update based on rate limiting"""
    last_update = load_last_update()
    
    if last_update is None:
        logger.info("🔄 No previous update found, proceeding with update")
        return True
    
    time_since_update = datetime.now() - last_update
    hours_since_update = time_since_update.total_seconds() / 3600
    required_hours = UPDATE_INTERVAL_DAYS * 24
    
    if hours_since_update >= required_hours:
        logger.info(f"🔄 {hours_since_update:.1f} hours since last update (required: {required_hours}), proceeding with update")
        return True
    else:
        next_update_time = last_update + timedelta(days=UPDATE_INTERVAL_DAYS)
        logger.info(f"⏰ Too early to update. Next update scheduled for: {next_update_time}")
        return False

def update_medium_data():
    """Update Medium data using API"""
    try:
        logger.info("📰 Starting Medium API update...")
        
        # Get user ID
        response = requests.get(
            "https://medium2.p.rapidapi.com/user/id_for/bahakizil",
            headers={
                "x-rapidapi-key": MEDIUM_API_KEY,
                "x-rapidapi-host": "medium2.p.rapidapi.com"
            }
        )
        response.raise_for_status()
        user_data = response.json()
        user_id = user_data.get('id')
        
        if not user_id:
            raise ValueError("Could not get user ID")
        
        logger.info(f"✅ Got user ID: {user_id}")
        
        # Get articles
        response = requests.get(
            f"https://medium2.p.rapidapi.com/user/{user_id}/articles",
            headers={
                "x-rapidapi-key": MEDIUM_API_KEY,
                "x-rapidapi-host": "medium2.p.rapidapi.com"
            }
        )
        response.raise_for_status()
        articles_data = response.json()
        
        logger.info(f"✅ Got {len(articles_data.get('associated_articles', []))} articles")
        
        # Get detailed data for each article
        detailed_articles = []
        for article_id in articles_data.get('associated_articles', [])[:3]:  # Limit to 3 articles
            try:
                response = requests.get(
                    f"https://medium2.p.rapidapi.com/article/{article_id}",
                    headers={
                        "x-rapidapi-key": MEDIUM_API_KEY,
                        "x-rapidapi-host": "medium2.p.rapidapi.com"
                    }
                )
                response.raise_for_status()
                article_data = response.json()
                
                detailed_articles.append({
                    "title": article_data.get('title', ''),
                    "link": article_data.get('url', ''),
                    "publishedDate": article_data.get('published_at', ''),
                    "description": article_data.get('subtitle', ''),
                    "categories": article_data.get('tags', []),
                    "author": "Baha Kizil",
                    "engagement": {
                        "claps": article_data.get('claps', 0),
                        "responses": article_data.get('responses_count', 0),
                        "views": article_data.get('voters', 0) * 7  # Estimate views from voters
                    }
                })
                
                logger.info(f"✅ Processed article: {article_data.get('title', 'Unknown')} - {article_data.get('claps', 0)} claps")
                
            except Exception as e:
                logger.warning(f"Failed to get article {article_id}: {e}")
        
        # Save to file
        data_dir = Path(__file__).parent.parent / 'data'
        data_dir.mkdir(exist_ok=True)
        
        formatted_data = {
            "lastUpdated": datetime.now().isoformat(),
            "nextUpdate": (datetime.now() + timedelta(days=UPDATE_INTERVAL_DAYS)).isoformat(),
            "source": "medium-api-rate-limited",
            "articles": detailed_articles
        }
        
        with open(data_dir / 'medium-articles.json', 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Medium data updated with {len(detailed_articles)} articles")
        return True
        
    except Exception as e:
        logger.error(f"❌ Medium API update failed: {e}")
        return False

def update_linkedin_data():
    """Update LinkedIn data using the new profile_recent_comments API endpoint"""
    try:
        logger.info("💼 Starting LinkedIn API update...")
        
        # Use the new profile_recent_comments endpoint
        payload = {
            "profile_url": "https://www.linkedin.com/in/bahakizil",
            "page": 1
        }
        
        headers = {
            "x-rapidapi-key": LINKEDIN_API_KEY,
            "x-rapidapi-host": "linkedin-data-scraper.p.rapidapi.com",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            "https://linkedin-data-scraper.p.rapidapi.com/profile_recent_comments",
            json=payload,
            headers=headers
        )
        
        response.raise_for_status()
        api_data = response.json()
        
        logger.info(f"🔍 LinkedIn API Response: success={api_data.get('success')}, posts={len(api_data.get('response', []))}")
        
        if api_data.get('success') and api_data.get('response'):
            posts = []
            
            for post in api_data['response']:
                # Extract engagement data
                social_count = post.get('socialCount', {})
                actor = post.get('actor', {})
                
                post_data = {
                    "id": post.get('urn', '').replace('urn:li:activity:', ''),
                    "text": post.get('postText', 'LinkedIn post content'),
                    "url": post.get('postLink', ''),
                    "publishedAt": post.get('postedAt', ''),
                    "author": {
                        "name": actor.get('actorName', 'Baha Kizil'),
                        "headline": actor.get('actorDescription', 'AI Engineer & Computer Vision Specialist')
                    },
                    "engagement": {
                        "likes": social_count.get('numLikes', 0),
                        "comments": social_count.get('numComments', 0),
                        "shares": social_count.get('numShares', 0)
                    },
                    "reactions": [
                        {"type": r.get('reactionType'), "count": r.get('count', 0)}
                        for r in social_count.get('reactionTypeCounts', [])
                    ],
                    "postedAgo": post.get('postedAgo', ''),
                    "fetched_at": datetime.now().isoformat()
                }
                posts.append(post_data)
                
                logger.info(f"📄 LinkedIn Post: {post_data['text'][:50]}... - {post_data['engagement']['likes']} likes, {post_data['engagement']['comments']} comments, {post_data['engagement']['shares']} shares")
            
            # Save LinkedIn data
            data_dir = Path(__file__).parent.parent / 'data'
            data_dir.mkdir(exist_ok=True)
            
            formatted_data = {
                "lastUpdated": datetime.now().isoformat(),
                "nextUpdate": (datetime.now() + timedelta(days=UPDATE_INTERVAL_DAYS)).isoformat(),
                "source": "linkedin-api-profile-comments",
                "posts": posts,
                "total_posts": len(posts)
            }
            
            with open(data_dir / 'linkedin-posts.json', 'w', encoding='utf-8') as f:
                json.dump(formatted_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ LinkedIn data saved: {len(posts)} posts with real engagement data")
            return True
            
        else:
            logger.warning("⚠️ LinkedIn API returned no data")
            return False
        
    except Exception as e:
        logger.error(f"❌ Failed to update LinkedIn data: {e}")
        return False

def main():
    """Main function"""
    import sys
    
    logger.info("🚀 Starting rate-limited social media updater...")
    
    # Check for force flag
    force_update = "--force" in sys.argv
    
    if not force_update and not should_update():
        logger.info("⏸️ Skipping update due to rate limiting")
        logger.info("💡 Use --force flag to bypass rate limiting for testing")
        return
    
    if force_update:
        logger.info("🔥 Force update mode - bypassing rate limits")
    
    logger.info("📊 API Budget: 40 requests/month per service")
    logger.info(f"🔄 Update frequency: Every {UPDATE_INTERVAL_DAYS} days")
    logger.info(f"📈 Monthly usage: ~{30 // UPDATE_INTERVAL_DAYS} requests per service (ayda 5 kere)")
    
    success_count = 0
    
    # Update Medium
    if update_medium_data():
        success_count += 1
    
    # Update LinkedIn  
    if update_linkedin_data():
        success_count += 1
    
    # Save update timestamp
    if success_count > 0:
        save_last_update()
        logger.info(f"✅ Update completed successfully ({success_count}/2 services)")
    else:
        logger.error("❌ All updates failed")

if __name__ == "__main__":
    main() 