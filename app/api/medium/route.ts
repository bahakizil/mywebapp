import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const USER_ID = process.env.MEDIUM_USER_ID ?? "60a0e4269377";

interface MediumUserResponse {
  associated_articles: string[];
  count: number;
}

interface MediumArticle {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  published_at: string;
  image_url: string;
  tags: string[];
  claps: number;
  voters: number;
  reads: number;
  views: number;
  word_count: number;
  responses_count: number;
  reading_time: number;
  lang: string;
}

const headers = {
  "X-RapidAPI-Key": RAPIDAPI_KEY ?? "",
  "X-RapidAPI-Host": "medium2.p.rapidapi.com",
};

async function fetchArticleIds(): Promise<string[]> {
  const res = await fetch(
    `https://medium2.p.rapidapi.com/user/${USER_ID}/articles`,
    { headers },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as MediumUserResponse;
  return data.associated_articles ?? [];
}

async function fetchArticle(id: string): Promise<MediumArticle | null> {
  const res = await fetch(`https://medium2.p.rapidapi.com/article/${id}`, {
    headers,
  });
  if (!res.ok) return null;
  return (await res.json()) as MediumArticle;
}

export async function GET() {
  if (!RAPIDAPI_KEY) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-cache" },
    });
  }

  try {
    const ids = await fetchArticleIds();
    if (ids.length === 0) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-cache" },
      });
    }

    const articles = await Promise.all(ids.slice(0, 8).map(fetchArticle));
    const formatted = articles
      .filter((a): a is MediumArticle => a !== null)
      .map((article) => ({
        title: article.title,
        subtitle: article.subtitle,
        link: article.url,
        publishedDate: article.published_at,
        description:
          article.subtitle ||
          `${article.word_count} words • ${Math.ceil(article.reading_time)} min read`,
        thumbnail: article.image_url,
        image_url: article.image_url,
        categories: article.tags,
        claps: article.claps ?? 0,
        views: article.views ?? 0,
        reads: article.reads ?? 0,
        responses: article.responses_count ?? 0,
        word_count: article.word_count,
        reading_time: Math.ceil(article.reading_time),
        lang: article.lang,
      }));

    return NextResponse.json(formatted, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch Medium articles", details },
      { status: 500 },
    );
  }
}
