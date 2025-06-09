#!/usr/bin/env python3
"""
Fix saved data format to match expected API structure
"""

import json
import os
from datetime import datetime, timedelta

def fix_medium_data():
    """Convert raw API response to expected format"""
    try:
        with open('../data/medium-articles.json', 'r') as f:
            raw_data = json.load(f)
        
        formatted_data = {
            "lastUpdated": datetime.now().isoformat(),
            "nextUpdate": (datetime.now() + timedelta(days=1)).isoformat(),
            "source": "real-time-api-cached",
            "articles": raw_data
        }
        
        with open('../data/medium-articles.json', 'w') as f:
            json.dump(formatted_data, f, indent=2)
        
        print(f"✅ Fixed Medium data format - {len(raw_data)} articles")
        
    except Exception as e:
        print(f"❌ Error fixing Medium data: {e}")

def fix_linkedin_data():
    """Convert raw API response to expected format"""
    try:
        with open('../data/linkedin-posts.json', 'r') as f:
            raw_data = json.load(f)
        
        formatted_data = {
            "lastUpdated": datetime.now().isoformat(),
            "nextUpdate": (datetime.now() + timedelta(days=1)).isoformat(),
            "source": "real-time-api-cached",
            "posts": raw_data
        }
        
        with open('../data/linkedin-posts.json', 'w') as f:
            json.dump(formatted_data, f, indent=2)
        
        print(f"✅ Fixed LinkedIn data format - {len(raw_data)} posts")
        
    except Exception as e:
        print(f"❌ Error fixing LinkedIn data: {e}")

if __name__ == "__main__":
    print("🔧 Fixing saved data format...")
    fix_medium_data()
    fix_linkedin_data()
    print("🎯 Data format fixed!") 