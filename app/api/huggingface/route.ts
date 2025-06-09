import { NextRequest, NextResponse } from 'next/server';

interface HuggingFaceSpace {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  likes: number;
  trending_score: number;
  url: string;
  relevance?: number;
}

// All of Baha's personal spaces
const bahakizilSpaces: HuggingFaceSpace[] = [
  {
    id: "bahakizil/ThreatDetection",
    title: "ThreatDetection",
    description: "YOLOv11n & DeepSeek 1.5B LLM—Running Locally. Advanced threat detection system using computer vision and large language models for real-time security analysis.",
    author: "bahakizil",
    category: "Computer Vision",
    likes: 0,
    trending_score: 1,
    url: "https://hf.co/spaces/bahakizil/ThreatDetection",
    relevance: 100
  },
  {
    id: "bahakizil/FireDetection",
    title: "FireDetection",
    description: "Advanced fire detection system using computer vision and machine learning algorithms for real-time fire monitoring and early warning systems.",
    author: "bahakizil",
    category: "Computer Vision",
    likes: 4,
    trending_score: 1,
    url: "https://hf.co/spaces/bahakizil/FireDetection",
    relevance: 100
  },
  {
    id: "bahakizil/VehicleDetectionModel",
    title: "VehicleDetectionModel",
    description: "AI-powered vehicle detection and classification system for traffic monitoring, parking management, and autonomous driving applications.",
    author: "bahakizil",
    category: "Computer Vision",
    likes: 0,
    trending_score: 1,
    url: "https://hf.co/spaces/bahakizil/VehicleDetectionModel",
    relevance: 100
  },
  {
    id: "bahakizil/Transcript_Creater",
    title: "Transcript Creater",
    description: "Automatic speech-to-text transcription service using advanced AI models for converting audio and video content into accurate text transcripts.",
    author: "bahakizil",
    category: "Audio Processing",
    likes: 0,
    trending_score: 1,
    url: "https://hf.co/spaces/bahakizil/Transcript_Creater",
    relevance: 100
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';

    let filteredSpaces = [...bahakizilSpaces];

    // Filter by search query
    if (query) {
      filteredSpaces = filteredSpaces.filter(space => 
        space.title.toLowerCase().includes(query) ||
        space.description.toLowerCase().includes(query) ||
        space.author.toLowerCase().includes(query) ||
        space.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredSpaces = filteredSpaces.filter(space => 
        space.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by likes first, then by trending score
    filteredSpaces.sort((a, b) => {
      if (a.likes !== b.likes) {
        return b.likes - a.likes;
      }
      return b.trending_score - a.trending_score;
    });

    // Get unique categories from bahakizil's spaces
    const categories = Array.from(new Set(bahakizilSpaces.map(s => s.category))).sort();

    return NextResponse.json({
      spaces: filteredSpaces,
      total: filteredSpaces.length,
      categories: categories
    });

  } catch (error) {
    console.error('HuggingFace API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spaces', spaces: [], total: 0, categories: [] },
      { status: 500 }
    );
  }
} 