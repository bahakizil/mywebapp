import { NextResponse } from 'next/server';
import { getRepos } from '@/lib/github';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours (daily cache)

export async function GET() {
  try {
    const repos = await getRepos();
    
    return NextResponse.json(repos, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('Error in repos API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}