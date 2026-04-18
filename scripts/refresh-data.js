#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  // Change this to your production URL after deployment
  PRODUCTION_URL: 'https://bahakizil.vercel.app',
  LOCAL_URL: 'http://localhost:3000',
  TOKEN: process.env.DATA_REFRESH_TOKEN
};

if (!CONFIG.TOKEN) {
  console.error('❌ DATA_REFRESH_TOKEN env var is not set. Export it before running this script.');
  process.exit(1);
}

function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const requestModule = isHttps ? https : http;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    console.log(`🚀 Triggering data refresh at: ${url}/api/refresh-data`);
    console.log(`🔑 Using token: ${token.substring(0, 10)}...`);

    const req = requestModule.request(url + '/api/refresh-data', options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Data refresh successful!');
            console.log(`📊 Updated at: ${response.timestamp}`);
            console.log(`📈 Counts:`, response.counts);
            resolve(response);
          } else {
            console.error(`❌ Request failed with status ${res.statusCode}`);
            console.error('Response:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError.message);
          console.error('Raw response:', data);
          reject(parseError);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.setTimeout(30000, () => {
      console.error('❌ Request timeout');
      req.abort();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const environment = args.includes('--prod') ? 'production' : 'local';
  const customUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
  
  let targetUrl;
  
  if (customUrl) {
    targetUrl = customUrl;
    console.log(`🎯 Using custom URL: ${targetUrl}`);
  } else if (environment === 'production') {
    targetUrl = CONFIG.PRODUCTION_URL;
    console.log(`🌐 Targeting production: ${targetUrl}`);
  } else {
    targetUrl = CONFIG.LOCAL_URL;
    console.log(`🏠 Targeting local development: ${targetUrl}`);
  }

  try {
    await makeRequest(targetUrl, CONFIG.TOKEN);
    console.log('🎉 Data refresh completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Data refresh failed:', error.message);
    console.log('');
    console.log('💡 Usage examples:');
    console.log('  npm run refresh-data                    # Refresh local development');
    console.log('  npm run refresh-data -- --prod          # Refresh production');
    console.log('  npm run refresh-data -- --url=https://your-domain.com  # Custom URL');
    console.log('');
    console.log('🔧 Make sure:');
    console.log('  1. Your server is running (for local)');
    console.log('  2. DATA_REFRESH_TOKEN is set in environment variables');
    console.log('  3. Production URL is correct in the script');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  main();
}