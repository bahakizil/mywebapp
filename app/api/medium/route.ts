import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 0; // No cache - always fresh data

interface MediumUserResponse {
  id: string;
  associated_articles: string[];
  total_pinned_articles: number;
  count: number;
  next: string;
}

interface MediumArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publication_id: string;
  published_at: string;
  last_modified_at: string;
  boosted_at: string;
  tags: string[];
  topics: string[];
  claps: number;
  voters: number;
  reads: number;
  views: number;
  word_count: number;
  responses_count: number;
  reading_time: number;
  url: string;
  unique_slug: string;
  image_url: string;
  lang: string;
  is_series: boolean;
  is_locked: boolean;
  is_shortform: boolean;
  top_highlight: string;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a';
const USER_ID = '60a0e4269377';

async function fetchMediumUserArticles(): Promise<string[]> {
  try {
    const response = await fetch(`https://medium2.p.rapidapi.com/user/${USER_ID}/articles`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'medium2.p.rapidapi.com',
      }
    });

    if (!response.ok) {
      throw new Error(`Medium user API error: ${response.status} ${response.statusText}`);
    }

    const data: MediumUserResponse = await response.json();
    console.log(`📰 Found ${data.count} Medium articles for user ${USER_ID}`);
    
    return data.associated_articles || [];
  } catch (error) {
    console.error('Error fetching Medium user articles:', error);
    return [];
  }
}

async function fetchArticleDetails(articleId: string): Promise<MediumArticle | null> {
  try {
    const response = await fetch(`https://medium2.p.rapidapi.com/article/${articleId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'medium2.p.rapidapi.com',
      }
    });

    if (!response.ok) {
      console.error(`Article API error for ${articleId}: ${response.status}`);
      return null;
    }

    const article: MediumArticle = await response.json();
    console.log(`📄 Fetched article: ${article.title}`);
    
    return article;
  } catch (error) {
    console.error(`Error fetching article ${articleId}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    console.log('🔄 Starting Medium API fetch...');
    
    // First, get the list of article IDs
    const articleIds = await fetchMediumUserArticles();
    
    if (articleIds.length === 0) {
      console.log('⚠️ No articles found, returning empty array');
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    console.log(`📰 Fetching details for ${articleIds.length} articles...`);
    
    // Then, fetch details for each article
    const articlePromises = articleIds.map(id => fetchArticleDetails(id));
    const articles = await Promise.all(articlePromises);
    
    // Filter out failed requests and format the data
    const validArticles = articles
      .filter(article => article !== null)
      .map(article => ({
        title: article!.title,
        subtitle: article!.subtitle,
        link: article!.url,
        publishedDate: article!.published_at,
        description: article!.subtitle || `${article!.word_count} words • ${Math.ceil(article!.reading_time)} min read`,
        thumbnail: article!.image_url,
        claps: article!.claps,
        reads: article!.reads,
        views: article!.views,
        responses: article!.responses_count,
        author: "Baha Kizil",
        categories: article!.tags,
        word_count: article!.word_count,
        reading_time: Math.ceil(article!.reading_time),
        lang: article!.lang
      }));

    console.log(`✅ Successfully processed ${validArticles.length} Medium articles`);
    
    return NextResponse.json(validArticles, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ Error in Medium API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Medium articles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}