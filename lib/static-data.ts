import fs from 'fs';
import path from 'path';

export interface PortfolioData {
  lastUpdated: string;
  repos: any[];
  articles: any[];
  linkedinPosts: any[];
}

// Cache for the data
let cachedData: PortfolioData | null = null;
let lastFileCheck = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export function getStaticData(): PortfolioData {
  const now = Date.now();
  
  // Check if we need to reload the file
  if (!cachedData || (now - lastFileCheck) > CACHE_DURATION) {
    try {
      const dataFile = path.join(process.cwd(), 'data', 'portfolio-data.json');
      
      if (fs.existsSync(dataFile)) {
        const fileContent = fs.readFileSync(dataFile, 'utf8');
        cachedData = JSON.parse(fileContent);
        lastFileCheck = now;
        console.log('📊 Loaded static data from file');
      } else {
        console.log('⚠️ No static data file found, using fallback');
        cachedData = getFallbackData();
      }
    } catch (error) {
      console.error('Error reading static data:', error);
      cachedData = getFallbackData();
    }
  }
  
  return cachedData!;
}

// Fallback data when static file is not available
function getFallbackData(): PortfolioData {
  return {
    lastUpdated: new Date().toISOString(),
    repos: [
      {
        id: 944608309,
        name: "Smart-Traffic-Analysis-With-Yolo",
        full_name: "bahakizil/Smart-Traffic-Analysis-With-Yolo",
        description: "Smart Traffic Monitoring: Real-Time CCTV Analysis with YOLOv12N",
        html_url: "https://github.com/bahakizil/Smart-Traffic-Analysis-With-Yolo",
        stargazers_count: 24,
        language: "Python",
        updated_at: "2025-05-12T07:05:44Z",
        topics: []
      },
      {
        id: 828230021,
        name: "Vehicle_Detection",
        full_name: "bahakizil/Vehicle_Detection",
        description: "Fine-tuned YOLOv12N for vehicle detection from CCTV with Gradio interface",
        html_url: "https://github.com/bahakizil/Vehicle_Detection",
        stargazers_count: 19,
        language: "Python",
        updated_at: "2025-04-20T10:30:00Z",
        topics: []
      }
    ],
    articles: [
      {
        title: "Smart Traffic Analysis With Yolo",
        link: "https://medium.com/@bahakizil/smart-traffic-analysiswith-yolo-7eef0441ca91?source=rss-60a0e4269377------2",
        publishedDate: "2025-03-07T17:04:38.000Z",
        description: "Exploring advanced computer vision techniques for traffic monitoring and analysis using YOLO detection models.",
        author: "Baha Kizil"
      },
      {
        title: "Threat Detection",
        link: "https://medium.com/@bahakizil/threat-detection-bde7fff47e06?source=rss-60a0e4269377------2",
        publishedDate: "2025-02-21T16:25:23.000Z",
        description: "Advanced threat detection systems using machine learning and computer vision technologies.",
        author: "Baha Kizil"
      }
    ],
    linkedinPosts: [
      {
        id: "fallback-1",
        text: "I'm excited to share my latest AI engineering project! Working with computer vision and real-time analysis systems.",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        likes: 0,
        comments: 0,
        url: "https://linkedin.com/in/bahakizil"
      }
    ]
  };
}

// Individual data getters for backward compatibility
export function getStaticRepos() {
  return getStaticData().repos;
}

export function getStaticArticles() {
  return getStaticData().articles;
}

export function getStaticLinkedInPosts() {
  return getStaticData().linkedinPosts;
}

// Get last update time
export function getLastUpdateTime() {
  return getStaticData().lastUpdated;
} 