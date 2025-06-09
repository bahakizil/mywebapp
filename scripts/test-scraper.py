#!/usr/bin/env python3
"""
Manual Test Script for Social Media Scraper
Quick test to verify scraper functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import importlib.util
import sys

# Load the daily-social-scraper module
spec = importlib.util.spec_from_file_location("daily_social_scraper", "daily-social-scraper.py")
daily_social_scraper = importlib.util.module_from_spec(spec)
sys.modules["daily_social_scraper"] = daily_social_scraper
spec.loader.exec_module(daily_social_scraper)

SocialMediaScraper = daily_social_scraper.SocialMediaScraper
import logging

# Set up detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

def main():
    print("🧪 Testing Social Media Scraper...")
    print("This will attempt to scrape Medium and LinkedIn data")
    print("Press Ctrl+C to cancel\n")
    
    try:
        scraper = SocialMediaScraper()
        
        print("🔥 Testing Medium scraping...")
        medium_data = scraper.scrape_medium_data()
        print(f"✅ Medium: Found {len(medium_data)} articles")
        
        print("\n💼 Testing LinkedIn scraping...")
        linkedin_data = scraper.scrape_linkedin_data()
        print(f"✅ LinkedIn: Found {len(linkedin_data)} posts")
        
        print("\n💾 Testing data saving...")
        scraper.save_data(medium_data, linkedin_data)
        print("✅ Data saved successfully")
        
        print("\n📊 Test Results:")
        print(f"Medium articles: {len(medium_data)}")
        for article in medium_data:
            print(f"  - {article['title']}: {article['engagement']['claps']} claps, {article['engagement']['views']} views")
        
        print(f"\nLinkedIn posts: {len(linkedin_data)}")
        for post in linkedin_data:
            text_preview = post['text'][:50] + "..." if len(post['text']) > 50 else post['text']
            print(f"  - {text_preview}: {post['engagement']['likes']} likes, {post['engagement']['comments']} comments")
        
    except KeyboardInterrupt:
        print("\n⚠️ Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        print("\n🎯 Test completed")

if __name__ == "__main__":
    main() 