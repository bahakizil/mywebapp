export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  categories: string[];
}

const stripCdata = (value: string) =>
  value
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .trim();

const decodeEntities = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

function pick(block: string, tag: string): string {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m = block.match(re);
  return m ? decodeEntities(stripCdata(m[1])) : "";
}

export function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const categories = Array.from(
      block.matchAll(/<category>([\s\S]*?)<\/category>/g),
    ).map((m) => decodeEntities(stripCdata(m[1])));

    items.push({
      title: pick(block, "title"),
      link: pick(block, "link"),
      pubDate: pick(block, "pubDate"),
      description: pick(block, "description"),
      content: pick(block, "content:encoded"),
      categories,
    });
  }

  return items;
}

export function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

export function stripHtml(html: string, max = 260): string {
  const text = html
    .replace(/<figure[\s\S]*?<\/figure>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
