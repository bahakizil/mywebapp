import { NextResponse } from 'next/server';
import { getLinkedInPosts } from '@/lib/linkedin';

// Node.js runtime gerekiyor çünkü fs modülü kullanıyoruz
export const runtime = 'nodejs';
export const revalidate = 0; // No cache for immediate updates

export async function GET() {
  try {
    const posts = await getLinkedInPosts();
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error in linkedin API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn posts' },
      { status: 500 }
    );
  }
}