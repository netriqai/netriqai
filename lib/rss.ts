export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export function parseRss(xmlText: string, sourceName: string): RssItem[] {
  const items: RssItem[] = [];
  
  // Find all <item> or <entry> (Atom feed compatibility) tags
  const itemBlocks = xmlText.split(/<item>|<entry>/i);
  // Shift off the first part (header content before first item)
  itemBlocks.shift();

  for (const block of itemBlocks) {
    // Clean up end tag
    const cleanBlock = block.split(/<\/item>|<\/entry>/i)[0];
    if (!cleanBlock) continue;

    const title = extractTagContent(cleanBlock, 'title');
    const link = extractLink(cleanBlock);
    const description = extractTagContent(cleanBlock, 'description') || extractTagContent(cleanBlock, 'summary');
    const pubDate = extractTagContent(cleanBlock, 'pubDate') || extractTagContent(cleanBlock, 'published') || extractTagContent(cleanBlock, 'updated');

    if (title && link) {
      items.push({
        title: cleanCdata(title).trim(),
        link: cleanCdata(link).trim(),
        description: cleanCdata(description || '').trim(),
        pubDate: cleanCdata(pubDate || '').trim(),
        source: sourceName,
      });
    }
  }

  return items;
}

function extractTagContent(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const match = block.match(regex);
  return match ? match[1] : '';
}

function extractLink(block: string): string {
  // Try standard <link>...</link>
  const linkText = extractTagContent(block, 'link');
  if (linkText.trim()) return linkText;

  // Try Atom <link href="..."/> or <link rel="alternate" href="..." />
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return hrefMatch ? hrefMatch[1] : '';
}

function cleanCdata(str: string): string {
  // Remove CDATA wrapper tags
  let cleaned = str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  // Strip any inline HTML tags to keep descriptions clean
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return cleaned;
}
