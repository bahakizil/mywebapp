import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

const HF_AUTHOR = process.env.HUGGINGFACE_USERNAME ?? "bahakizil";

interface HFSpaceRaw {
  id: string;
  likes: number;
  author?: string;
  cardData?: { title?: string; short_description?: string; tags?: string[] };
  lastModified?: string;
  createdAt?: string;
  sdk?: string;
  tags?: string[];
}

interface HFSpace {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  likes: number;
  trending_score: number;
  url: string;
  relevance: number;
}

function categorize(space: HFSpaceRaw): string {
  const tags = [
    ...(space.cardData?.tags ?? []),
    ...(space.tags ?? []),
  ].map((t) => t.toLowerCase());
  if (tags.some((t) => /vision|yolo|image|detect|cv/.test(t))) {
    return "Computer Vision";
  }
  if (tags.some((t) => /audio|speech|asr|tts|transcri/.test(t))) {
    return "Audio Processing";
  }
  if (tags.some((t) => /nlp|llm|text|language|rag/.test(t))) {
    return "Natural Language";
  }
  if (tags.some((t) => /agent|langchain|tool/.test(t))) {
    return "AI Agents";
  }
  return "Other";
}

function humanize(id: string): string {
  const name = id.split("/")[1] ?? id;
  return name.replace(/[-_]/g, " ");
}

function normalize(space: HFSpaceRaw): HFSpace {
  return {
    id: space.id,
    title: space.cardData?.title?.trim() || humanize(space.id),
    description:
      space.cardData?.short_description?.trim() ||
      `Hugging Face space by ${space.author ?? HF_AUTHOR}.`,
    author: space.author ?? HF_AUTHOR,
    category: categorize(space),
    likes: space.likes ?? 0,
    trending_score: 1,
    url: `https://hf.co/spaces/${space.id}`,
    relevance: 100,
  };
}

async function fetchSpaces(): Promise<HFSpace[]> {
  const response = await fetch(
    `https://huggingface.co/api/spaces?author=${HF_AUTHOR}&full=true&limit=50`,
    {
      headers: { "User-Agent": "portfolio-hf-reader" },
      next: { revalidate },
    },
  );
  if (!response.ok) return [];
  const raw = (await response.json()) as HFSpaceRaw[];
  return raw.map(normalize);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() ?? "";
    const category = searchParams.get("category") ?? "";

    const spaces = await fetchSpaces();

    let filtered = spaces;
    if (query) {
      filtered = filtered.filter((s) =>
        [s.title, s.description, s.author, s.category]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }
    if (category && category !== "all") {
      filtered = filtered.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase(),
      );
    }

    filtered.sort((a, b) => b.likes - a.likes);
    const categories = Array.from(new Set(spaces.map((s) => s.category))).sort();

    return NextResponse.json(
      { spaces: filtered, total: filtered.length, categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch HF spaces", details, spaces: [], total: 0, categories: [] },
      { status: 500 },
    );
  }
}
