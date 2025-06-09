import { NextResponse } from 'next/server';
import { getMediumArticles } from '@/lib/medium';

export const runtime = 'nodejs';
export const revalidate = 0; // No cache - always fresh data

export async function GET() {
  try {
    const articles = await getMediumArticles();
    
    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error in medium API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Medium articles' },
      { status: 500 }
    );
  }
}