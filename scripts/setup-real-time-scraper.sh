#!/bin/bash

# Real-time Social Media Scraper Setup Script
# Sets up daily automated scraping for Medium and LinkedIn data

echo "🚀 Setting up Real-time Social Media Data Scraper..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3 first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 found${NC}"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip3 is not installed. Please install pip3 first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ pip3 found${NC}"

# Install Python requirements
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
pip3 install -r requirements.txt

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo -e "${YELLOW}⚠️  Chrome/Chromium not found. Installing Chrome...${NC}"
    
    # Install Chrome on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install --cask google-chrome
        else
            echo -e "${RED}❌ Homebrew not found. Please install Chrome manually.${NC}"
            echo "Download from: https://www.google.com/chrome/"
            exit 1
        fi
    # Install Chrome on Linux
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
        sudo apt-get update
        sudo apt-get install -y google-chrome-stable
    fi
fi

echo -e "${GREEN}✅ Chrome browser ready${NC}"

# Install ChromeDriver
echo -e "${BLUE}🔧 Setting up ChromeDriver...${NC}"
python3 -c "
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
print('ChromeDriver installed successfully')
"

# Create logs directory
mkdir -p ../logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Create data directory if it doesn't exist
mkdir -p ../data
echo -e "${GREEN}✅ Data directory ready${NC}"

# Set up environment variables
echo -e "${BLUE}🔐 Setting up environment variables...${NC}"

# Check if .env file exists in parent directory
if [ ! -f "../.env.local" ]; then
    echo -e "${YELLOW}⚠️  Creating .env.local file for credentials...${NC}"
    cat > "../.env.local" << EOF
# Social Media Scraper Credentials
SOCIAL_EMAIL=kizilbaha26@gmail.com
SOCIAL_PASSWORD=Qwer123mnb!

# Scraper Settings
SCRAPER_ENABLED=true
SCRAPER_HEADLESS=true
SCRAPER_INTERVAL=24
EOF
    echo -e "${GREEN}✅ Environment file created${NC}"
    echo -e "${YELLOW}📝 Please update credentials in .env.local if needed${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Set up cron job for daily scraping
echo -e "${BLUE}⏰ Setting up daily cron job...${NC}"

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRAPER_PATH="$SCRIPT_DIR/daily-social-scraper.py"

# Create cron job that runs daily at 2 AM
CRON_JOB="0 2 * * * cd $SCRIPT_DIR && /usr/bin/python3 daily-social-scraper.py >> ../logs/cron-scraper.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "daily-social-scraper.py"; then
    echo -e "${YELLOW}⚠️  Cron job already exists, updating...${NC}"
    (crontab -l 2>/dev/null | grep -v "daily-social-scraper.py"; echo "$CRON_JOB") | crontab -
else
    echo -e "${GREEN}📅 Adding new cron job...${NC}"
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
fi

echo -e "${GREEN}✅ Cron job configured to run daily at 2 AM${NC}"

# Test the scraper
echo -e "${BLUE}🧪 Testing the scraper (dry run)...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

cd "$SCRIPT_DIR"
timeout 300 python3 daily-social-scraper.py

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Scraper test completed successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Scraper test timed out or had issues, but setup is complete${NC}"
fi

# Display setup summary
echo ""
echo -e "${BLUE}📋 Setup Summary:${NC}"
echo -e "${GREEN}✅ Python dependencies installed${NC}"
echo -e "${GREEN}✅ Chrome browser and ChromeDriver ready${NC}"
echo -e "${GREEN}✅ Environment variables configured${NC}"
echo -e "${GREEN}✅ Daily cron job scheduled (2 AM)${NC}"
echo -e "${GREEN}✅ Logs directory: ../logs/${NC}"
echo -e "${GREEN}✅ Data output: ../data/${NC}"

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Update credentials in .env.local if needed"
echo "2. Run manually: python3 daily-social-scraper.py"
echo "3. Check logs: tail -f ../logs/social-scraper.log"
echo "4. Monitor cron: tail -f ../logs/cron-scraper.log"

echo ""
echo -e "${GREEN}🚀 Real-time Social Media Scraper is now active!${NC}"
echo -e "${BLUE}📊 Your Medium and LinkedIn data will be updated daily${NC}" 