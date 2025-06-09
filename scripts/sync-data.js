#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Static GitHub data (no API calls during build)
function getGitHubRepos() {
  return [
    {
      id: 1,
      name: "ai-traffic-monitoring",
      full_name: "bahakizil/ai-traffic-monitoring",
      description: "Real-time traffic monitoring system using computer vision and YOLO",
      html_url: "https://github.com/bahakizil/ai-traffic-monitoring",
      stargazers_count: 15,
      language: "Python",
      updated_at: "2024-12-01T10:00:00Z",
      topics: ["computer-vision", "yolo", "traffic-monitoring", "opencv"]
    },
    {
      id: 2,
      name: "fire-detection-system",
      full_name: "bahakizil/fire-detection-system", 
      description: "AI-powered fire detection system using deep learning",
      html_url: "https://github.com/bahakizil/fire-detection-system",
      stargazers_count: 8,
      language: "Python",
      updated_at: "2024-11-28T15:30:00Z",
      topics: ["deep-learning", "fire-detection", "opencv", "tensorflow"]
    },
    {
      id: 3,
      name: "portfolio-website",
      full_name: "bahakizil/portfolio-website",
      description: "Modern AI Engineer portfolio built with Next.js and React",
      html_url: "https://github.com/bahakizil/portfolio-website",
      stargazers_count: 5,
      language: "TypeScript",
      updated_at: "2024-12-09T18:00:00Z",
      topics: ["nextjs", "react", "portfolio", "ai-engineer"]
    }
  ];
}

// Static Medium articles (no API calls during build)
function getMediumArticles() {
  return [
    {
      title: "Building Real-Time Traffic Monitoring with Computer Vision",
      link: "https://medium.com/@bahakizil/traffic-monitoring-cv",
      publishedDate: "2024-11-25T09:00:00Z",
      description: "Learn how to build a comprehensive traffic monitoring system using computer vision, YOLO object detection, and real-time analytics...",
      author: "Baha Kizil"
    },
    {
      title: "Introduction to RAG Systems for AI Applications",
      link: "https://medium.com/@bahakizil/rag-systems-intro",
      publishedDate: "2024-11-15T14:30:00Z", 
      description: "A comprehensive guide to Retrieval-Augmented Generation (RAG) systems and their implementation in modern AI applications...",
      author: "Baha Kizil"
    },
    {
      title: "YOLOv8 Optimizations for Edge Deployment",
      link: "https://medium.com/@bahakizil/yolov8-edge-optimization",
      publishedDate: "2024-11-10T11:15:00Z",
      description: "Techniques for optimizing YOLOv8 models for deployment on edge devices, including quantization and pruning strategies...",
      author: "Baha Kizil"
    }
  ];
}

// LinkedIn Data (from existing data)
function getLinkedInPosts() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'linkedin-posts.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return data;
    }
  } catch (error) {
    console.log('Using fallback LinkedIn data');
  }
  
  // Fallback LinkedIn posts
  return [
    {
      id: "static-1",
      text: "I'm happy to share that I've been accepted into the AI Bootcamp organized by Kairu. It's a great opportunity to improve my skills in AI engineering.\n\nThanks to the Kairu team for this opportunity!",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 0,
      comments: 0,
      url: "https://linkedin.com/in/bahakizil"
    },
    {
      id: "static-2", 
      text: "🚦Real-Time Traffic Management with Computer Vision 🕶️\n\nAn innovative project that turns ordinary CCTV cameras into powerful traffic analysis tools! 🚦🔍\n\n• Integrated Supervision Polygon Tool with CCTV footage\n• Used OpenCV for image processing and analysis\n• Implemented lane-by-lane traffic monitoring capabilities",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 0,
      comments: 0,
      url: "https://linkedin.com/in/bahakizil"
    },
    {
      id: "static-3",
      text: "𝗦𝗺𝗮𝗿𝘁 𝗧𝗿𝗮𝗳𝗳𝗶𝗰 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴: 𝗥𝗲𝗮𝗹-𝗧𝗶𝗺𝗲 𝗖𝗖𝗧𝗩 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 🚗📊\n\nI am excited to share my latest project, which aims to detect traffic violations and contribute to smart city infrastructure.\n\nKey Features:\n• Real-time vehicle detection using YOLOv12N\n• Traffic flow analysis and monitoring",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 0,
      comments: 0,
      url: "https://linkedin.com/in/bahakizil"
    }
  ];
}

// Main sync function (no API calls)
async function syncData() {
  console.log('🔄 Starting data synchronization...');
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  
  // Get static data
  console.log('📦 Loading GitHub repositories (static data)...');
  const repos = getGitHubRepos();
  
  console.log('📰 Loading Medium articles (static data)...');
  const articles = getMediumArticles();
  
  console.log('💼 Loading LinkedIn posts (static data)...');
  const linkedinPosts = getLinkedInPosts();

  // Create data structure
  const data = {
    lastUpdated: timestamp,
    repos: repos.slice(0, 6),
    articles: articles.slice(0, 6), 
    linkedinPosts: Array.isArray(linkedinPosts) ? linkedinPosts.slice(0, 6) : []
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