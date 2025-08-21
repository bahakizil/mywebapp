import { NextResponse } from 'next/server';
import { getStaticData } from '@/lib/static-data';

export async function GET() {
  try {
    const data = getStaticData();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error serving static data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to load data',
        repos: [],
        articles: [],
        linkedinPosts: []
      },
      { status: 500 }
    );
  }
}