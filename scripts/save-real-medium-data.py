#!/usr/bin/env python3
"""
Save real Medium API data to JSON file
"""

import json
import requests
from datetime import datetime, timedelta

def save_medium_data():
    """Save current Medium API data to file"""
    try:
        # Fetch current data from API
        response = requests.get('http://localhost:3000/api/medium')
        response.raise_for_status()
        
        articles = response.json()
        
        # Format data
        formatted_data = {
            "lastUpdated": datetime.now().isoformat(),
            "nextUpdate": (datetime.now() + timedelta(days=1)).isoformat(),
            "source": "medium-api-real-time",
            "articles": articles
        }
        
        # Save to file
        with open('../data/medium-articles.json', 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Saved {len(articles)} Medium articles with real engagement data")
        print("🎯 Real engagement data:")
        for article in articles:
            engagement = article.get('engagement', {})
            print(f"   📄 {article['title'][:50]}...")
            print(f"      👏 {engagement.get('claps', 0)} claps, 👁️ {engagement.get('views', 0)} views, 💬 {engagement.get('responses', 0)} responses")
        
        return True
        
    except Exception as e:
        print(f"❌ Error saving Medium data: {e}")
        return False

if __name__ == "__main__":
    save_medium_data() 