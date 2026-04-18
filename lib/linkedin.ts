import type { LinkedInPost as SharedLinkedInPost } from "@/types/portfolio";

export type LinkedInPost = SharedLinkedInPost & {
  id: string;
  text: string;
  publishedAt: string;
  author: { name: string; headline: string };
  engagement: { likes: number; comments: number; shares: number };
  url: string;
  image_url?: string;
};

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
const RAPID_API_HOST = "linkedin-data-scraper.p.rapidapi.com";
const BASE_URL = "https://linkedin-data-scraper.p.rapidapi.com";
const PROFILE_URL = "https://www.linkedin.com/in/bahakizil";

const realLinkedInPosts: LinkedInPost[] = [
  {
    id: "7337890647703486465",
    text: "🎓 Capstone Project – Smart Growbox: AI-Powered Autonomous Plant Monitoring & Cultivation System. An AI-enhanced cultivation platform designed for indoor and small-scale farming — integrating IoT sensing, edge AI, computer vision and GPT-driven decision intelligence.",
    publishedAt: "2025-06-09T17:17:41.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 12, comments: 1, shares: 0 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7337890647703486465",
  },
  {
    id: "7335017540236075008",
    text: "I'm happy to share that I've been accepted into the AI Bootcamp organized by Kairu. It's a great opportunity to improve my skills in AI engineering. Thanks to the Kairu team!",
    publishedAt: "2025-06-01T19:00:59.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 44, comments: 5, shares: 0 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7335017540236075008",
  },
  {
    id: "7304154595822338049",
    text: "🚦Real-Time Traffic Management with Computer Vision — turning ordinary CCTV cameras into powerful traffic analysis tools. Lane-level flow, classification, and violations.",
    publishedAt: "2025-03-08T15:02:40.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 537, comments: 15, shares: 47 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7304154595822338049",
    image_url: "/images/traffic-monitoring.png",
  },
  {
    id: "7303829659937341440",
    text: "Smart Traffic Monitoring: Real-Time CCTV Analysis. Integrating Roboflow's polygon tool with CCTV footage, YOLOv12N trained for 250 epochs for real-time traffic violation detection.",
    publishedAt: "2025-03-07T17:31:29.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 751, comments: 22, shares: 49 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7303829659937341440",
    image_url: "/images/traffic-monitoring.png",
  },
  {
    id: "7301633709449863168",
    text: "🚀 Fine-Tuning YOLOv12n for Fire & Smoke Detection. 250 epochs on Google Colab A100. Enhanced detection accuracy, high-performance real-time analysis.",
    publishedAt: "2025-03-01T16:05:34.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 811, comments: 22, shares: 40 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7301633709449863168",
    image_url: "/images/fire-detection.png",
  },
  {
    id: "7301252813429387264",
    text: "I'm happy to share that I have earned a new certification: AI Agents Fundamentals — Hugging Face!",
    publishedAt: "2025-02-28T14:52:01.000Z",
    author: { name: "Baha Kızıl", headline: "AI Engineer" },
    engagement: { likes: 46, comments: 6, shares: 0 },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7301252813429387264",
  },
];

interface RapidApiPost {
  postText?: string;
  postLink: string;
  imageComponent?: string[];
  linkedInVideoComponent?: { thumbnail: string };
  actor?: { actorName?: string; actorDescription?: string };
  socialCount: { numLikes: number; numComments: number; numShares: number };
  postedAt: string;
  urn?: string;
}

interface RapidApiResponse {
  success: boolean;
  response: RapidApiPost[];
}

async function fetchFromRapidApi(): Promise<LinkedInPost[] | null> {
  if (!RAPID_API_KEY) return null;

  try {
    const params = new URLSearchParams({
      profile_url: PROFILE_URL,
      page: "1",
      reposts: "1",
      comments: "1",
    });

    const response = await fetch(`${BASE_URL}/profile_updates?${params}`, {
      headers: {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": RAPID_API_HOST,
      },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as RapidApiResponse;
    if (!data.success || !Array.isArray(data.response)) return null;

    return data.response.map((post): LinkedInPost => {
      const id =
        post.urn?.replace("urn:li:activity:", "") ??
        post.postLink?.match(/activity:(\d+)/)?.[1] ??
        String(Date.now());
      return {
        id,
        text: post.postText ?? "",
        publishedAt: post.postedAt,
        author: {
          name: post.actor?.actorName ?? "Baha Kızıl",
          headline: post.actor?.actorDescription ?? "AI Engineer",
        },
        engagement: {
          likes: post.socialCount.numLikes,
          comments: post.socialCount.numComments,
          shares: post.socialCount.numShares,
        },
        url: post.postLink,
        image_url: post.imageComponent?.[0] ?? post.linkedInVideoComponent?.thumbnail,
      };
    });
  } catch {
    return null;
  }
}

function imageForPost(post: LinkedInPost): string | undefined {
  if (post.image_url) return post.image_url;
  const text = post.text.toLowerCase();
  if (text.includes("traffic")) return "/images/traffic-monitoring.png";
  if (text.includes("fire") || text.includes("smoke")) return "/images/fire-detection.png";
  return undefined;
}

function mergeApiWithStatic(apiPosts: LinkedInPost[]): LinkedInPost[] {
  const byId = new Map(apiPosts.map((post) => [post.id, post]));
  const merged: LinkedInPost[] = [];

  for (const staticPost of realLinkedInPosts) {
    const apiPost = byId.get(staticPost.id);
    if (apiPost) {
      merged.push({
        ...staticPost,
        engagement: apiPost.engagement,
        text: apiPost.text || staticPost.text,
        publishedAt: apiPost.publishedAt || staticPost.publishedAt,
        image_url: apiPost.image_url ?? staticPost.image_url,
      });
      byId.delete(staticPost.id);
    } else {
      merged.push(staticPost);
    }
  }

  byId.forEach((post) => merged.push(post));

  return merged
    .map((post) => ({ ...post, image_url: imageForPost(post) }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getLinkedInPosts(): Promise<LinkedInPost[]> {
  const apiPosts = await fetchFromRapidApi();
  if (!apiPosts || apiPosts.length === 0) {
    return realLinkedInPosts.map((post) => ({
      ...post,
      image_url: imageForPost(post),
    }));
  }
  return mergeApiWithStatic(apiPosts);
}
