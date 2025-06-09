#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// GitHub API
async function fetchGitHubRepos() {
  try {
    const username = process.env.GITHUB_USERNAME || 'bahakizil';
    const token = process.env.GITHUB_TOKEN;
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=10`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at,
      topics: repo.topics || []
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

// Medium RSS
async function fetchMediumArticles() {
  try {
    const username = process.env.MEDIUM_USERNAME || '@bahakizil';
    const rssUrl = `https://medium.com/feed/${username}`;
    
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Medium RSS error: ${response.status} ${response.statusText}`);
    }

    const rssText = await response.text();
    const items = rssText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    const articles = items.slice(0, 6).map((item, index) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 
                   item.match(/<title>(.*?)<\/title>/)?.[1] || 
                   `Article ${index + 1}`;
      
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '#';
      
      const pubDateRaw = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();
      
      // Parse date safely
      let publishedDate;
      try {
        const parsedDate = new Date(pubDateRaw);
        if (isNaN(parsedDate.getTime())) {
          publishedDate = new Date().toISOString();
        } else {
          publishedDate = parsedDate.toISOString();
        }
      } catch (error) {
        publishedDate = new Date().toISOString();
      }
      
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                         item.match(/<description>(.*?)<\/description>/)?.[1] ||
                         'No description available';
      
      return {
        title: title.trim(),
        link: link.trim(),
        publishedDate,
        description: description.replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...',
        author: 'Baha Kizil'
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
}

// LinkedIn Data (from existing scraped file or fallback)
function getLinkedInPosts() {
  try {
    const dataFile = path.join(process.cwd(), 'scripts', 'linkedin_posts.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return data;
    }
    
    // Fallback mock LinkedIn posts
    return [
      {
        id: "mock-1",
        text: "I'm happy to share that I've been accepted into the AI Bootcamp organized by Kairu. It's a great opportunity to improve my skills in AI engineering.\n\nThanks to the Kairu team for this opportunity!",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        likes: 0,
        comments: 0,
        url: "https://linkedin.com/in/bahakizil"
      },
      {
        id: "mock-2",
        text: "🚦Real-Time Traffic Management with Computer Vision 🕶️\n\nAn innovative project that turns ordinary CCTV cameras into powerful traffic analysis tools! 🚦🔍\n\n• Integrated Supervision Polygon Tool with CCTV footage\n• Used OpenCV for image processing and analysis\n• Implemented lane-by-lane traffic monitoring capabilities\n\nReal-Time Insights Delivered:\n🚓 Unauthorized emergency lane usage detection\n🔄 Lane-specific traffic flow analysis (speed and density)\n🚕 Vehicle counting with classification\n📊 Traffic pattern analysis",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        likes: 0,
        comments: 0,
        url: "https://linkedin.com/in/bahakizil"
      },
      {
        id: "mock-3",
        text: "𝗦𝗺𝗮𝗿𝘁 𝗧𝗿𝗮𝗳𝗳𝗶𝗰 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴: 𝗥𝗲𝗮𝗹-𝗧𝗶𝗺𝗲 𝗖𝗖𝗧𝗩 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 🚗📊\n\nI am excited to share my latest project, which aims to detect traffic violations and contribute to smart city infrastructure.\n\nKey Features:\n• Real-time vehicle detection using YOLOv12N\n• Traffic flow analysis and monitoring\n• Emergency lane violation detection\n• Performance optimization for edge deployment",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        likes: 0,
        comments: 0,
        url: "https://linkedin.com/in/bahakizil"
      }
    ];
  } catch (error) {
    console.error('Error reading LinkedIn data:', error);
    return [];
  }
}

// Main sync function
async function syncData() {
  console.log('🔄 Starting data synchronization...');
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  
  // Fetch all data
  console.log('📦 Fetching GitHub repositories...');
  const repos = await fetchGitHubRepos();
  
  console.log('📰 Fetching Medium articles...');
  const articles = await fetchMediumArticles();
  
  console.log('💼 Reading LinkedIn posts...');
  const linkedinPosts = getLinkedInPosts();

  // Create data structure
  const data = {
    lastUpdated: timestamp,
    repos: repos.slice(0, 6), // Top 6 repos
    articles: articles.slice(0, 6), // Top 6 articles
    linkedinPosts: linkedinPosts.slice(0, 6) // Top 6 posts
  };

  // Write to files
  const dataFile = path.join(dataDir, 'portfolio-data.json');
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  console.log('✅ Data synchronization completed!');
  console.log(`📊 Synced: ${repos.length} repos, ${articles.length} articles, ${linkedinPosts.length} LinkedIn posts`);
  console.log(`📁 Data saved to: ${dataFile}`);
  console.log(`⏰ Last updated: ${timestamp}`);
}

// Run sync
syncData().catch(console.error); 