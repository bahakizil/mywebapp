#!/bin/bash

# Daily Portfolio Data Sync Script
# This script should be run once per day via cron job

# Set project directory (adjust this path)
PROJECT_DIR="/Users/bahakizil/Downloads/mypage"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Load environment variables if .env.local exists
if [ -f .env.local ]; then
    source .env.local
fi

# Log file
LOG_FILE="$PROJECT_DIR/logs/sync-$(date +%Y%m%d).log"

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_message "🔄 Starting daily portfolio data sync..."

# Run data sync
if npm run sync-data >> "$LOG_FILE" 2>&1; then
    log_message "✅ Data sync completed successfully"
    
    # Optional: Restart development server if running
    if pgrep -f "next dev" > /dev/null; then
        log_message "🔄 Restarting development server..."
        pkill -f "next dev"
        sleep 2
        nohup npm run dev > /dev/null 2>&1 &
        log_message "✅ Development server restarted"
    fi
    
    # Clean up old log files (keep last 7 days)
    find "$PROJECT_DIR/logs" -name "sync-*.log" -mtime +7 -delete
    
    log_message "📊 Daily sync process completed"
else
    log_message "❌ Data sync failed, check log for details"
    exit 1
fi 