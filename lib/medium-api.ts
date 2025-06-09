/**
 * Medium API Integration using RapidAPI Medium2
 * 
 * This service fetches real Medium data using the Medium2 API from RapidAPI
 */

const RAPID_API_KEY = "f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a";
const RAPID_API_HOST = "medium2.p.rapidapi.com";
const BASE_URL = "https://medium2.p.rapidapi.com";

// Baha's real Medium user ID
const BAHA_USER_ID = "60a0e4269377";

interface MediumAPIResponse {
  [key: string]: any;
}

interface ArticleInfo {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  published_at: string;
  claps: number;
  voters: number;
  word_count: number;
  responses_count: number;
  reading_time: number;
  tags: string[];
  topics: string[];
  image_url?: string;
}

async function makeAPIRequest(endpoint: string, params?: Record<string, string>): Promise<MediumAPIResponse> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  try {
    console.log(`🌐 Making API request to: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Medium API request failed:', error);
    throw error;
  }
}

export async function getUserArticles(userId: string = BAHA_USER_ID): Promise<string[]> {
  try {
    const response = await makeAPIRequest(`/user/${userId}/articles`);
    console.log('📚 Medium User Articles Response:', {
      id: response.id,
      count: response.count,
      total_articles: response.associated_articles?.length || 0
    });
    return response.associated_articles || [];
  } catch (error) {
    console.error('Failed to get user articles:', error);
    throw error;
  }
}

export async function getArticleInfo(articleId: string): Promise<ArticleInfo> {
  try {
    const response = await makeAPIRequest(`/article/${articleId}`);
    console.log(`📄 Article ${articleId}:`, {
      title: response.title?.substring(0, 50) + '...',
      claps: response.claps,
      voters: response.voters,
      responses: response.responses_count
    });
    
    return {
      id: response.id || articleId,
      title: response.title || '',
      subtitle: response.subtitle || '',
      url: response.url || '',
      published_at: response.published_at || '',
      claps: response.claps || 0,
      voters: response.voters || 0,
      word_count: response.word_count || 0,
      responses_count: response.responses_count || 0,
      reading_time: response.reading_time || 0,
      tags: response.tags || [],
      topics: response.topics || [],
      image_url: response.image_url || ''
    };
  } catch (error) {
    console.error('Failed to get article info:', error);
    throw error;
  }
}

export async function getMediumArticlesWithRealData(username: string = 'bahakizil') {
  try {
    console.log('🚀 Starting real Medium API data fetch...');
    console.log(`👤 Using user ID: ${BAHA_USER_ID}`);
    
    // Step 1: Get user's articles
    const articleIds = await getUserArticles(BAHA_USER_ID);
    console.log('✅ Got article IDs:', articleIds.slice(0, 10)); // Show first 10
    
    // Step 2: Get detailed info for the most recent articles (limit to first 5)
    const articles = [];
    const recentArticleIds = articleIds.slice(0, 5); // Get most recent 5 articles
    
    for (const articleId of recentArticleIds) {
      try {
        const articleInfo = await getArticleInfo(articleId);
        articles.push(articleInfo);
        console.log(`✅ Fetched: ${articleInfo.title.substring(0, 40)}... - ${articleInfo.claps} claps, ${articleInfo.voters} voters`);
      } catch (error) {
        console.error(`❌ Failed to get article ${articleId}:`, error);
      }
    }
    
    console.log('🎉 Successfully fetched', articles.length, 'articles with real engagement data');
    return articles;
    
  } catch (error) {
    console.error('❌ Medium API integration failed:', error);
    throw error;
  }
} 