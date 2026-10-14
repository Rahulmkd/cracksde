import { BadRequestError } from "../../shared/errors/app-error.js";

export interface ExtractedMetadata {
  url: string;
  title: string;
  domain: string;
  favicon: string | null;
}

/**
 * Decodes basic and numeric HTML entities.
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCharCode(parseInt(dec, 10));
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return "";
      }
    });
}

/**
 * Normalizes input URL by adding protocol if missing and validating format.
 */
export function normalizeUrl(inputUrl: string): string {
  let trimmed = inputUrl.trim();
  if (!trimmed) {
    throw new BadRequestError("URL is required");
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new BadRequestError("URL must use HTTP or HTTPS protocol");
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      throw new BadRequestError("Please provide a valid domain name");
    }
    return parsed.href;
  } catch (err: any) {
    if (err instanceof BadRequestError) throw err;
    throw new BadRequestError("Please provide a valid web URL");
  }
}

/**
 * Extracts webpage title, domain, and favicon from a given URL.
 * Designed to be resilient: if scraping fails or is blocked by CORS/Cloudflare,
 * it falls back cleanly to the domain name and standard favicon provider.
 */
export async function extractUrlMetadata(rawUrl: string): Promise<ExtractedMetadata> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const parsedUrl = new URL(normalizedUrl);
  const domain = parsedUrl.hostname.replace(/^www\./i, "");

  // Default fallback metadata in case fetching fails or doesn't return full details
  const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  let title = domain;
  let favicon: string | null = fallbackFavicon;

  try {
    // 5-second timeout for snappy response times
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(normalizedUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html") || contentType.includes("application/xhtml+xml")) {
        // Read at most 512KB of the response body to extract <head> tags
        const text = await response.text();
        const headMatch = text.slice(0, 524288); // first 512KB

        // 1. Title Extraction: Check <title>, then og:title, then twitter:title
        const ogTitleMatch = headMatch.match(
          /<meta[^>]+(?:property|name)=["'](?:og:title|twitter:title)["'][^>]+content=["']([^"']+)["']/i
        );
        const titleTagMatch = headMatch.match(/<title[^>]*>([^<]+)<\/title>/i);

        const rawTitle = ogTitleMatch?.[1] || titleTagMatch?.[1];
        if (rawTitle) {
          const cleaned = decodeHtmlEntities(rawTitle).replace(/\s+/g, " ").trim();
          if (cleaned.length > 0) {
            title = cleaned.slice(0, 500);
          }
        }

        // 2. Favicon Extraction
        // Match <link rel="icon" ...> or <link rel="shortcut icon" ...> or <link rel="apple-touch-icon" ...>
        const iconRegex =
          /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i;
        const iconRegexAlt =
          /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i;

        const iconMatch = headMatch.match(iconRegex) || headMatch.match(iconRegexAlt);
        if (iconMatch?.[1]) {
          try {
            const resolvedFavicon = new URL(iconMatch[1], response.url || normalizedUrl).href;
            favicon = resolvedFavicon;
          } catch {
            // Keep fallback
          }
        }
      }
    }
  } catch (error) {
    // Graceful degradation: website may be unreachable or protected against crawlers
    // Log for debugging and continue with fallback metadata
    console.warn(`[MetadataService] Could not scrape metadata for ${normalizedUrl}:`, (error as any)?.message);
  }

  // Format title fallback if still equal to raw domain
  if (title === domain) {
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      // e.g. leetcode.com/problems/two-sum -> two-sum on leetcode.com
      const lastPart = decodeURIComponent(pathParts[pathParts.length - 1]).replace(/[-_]/g, " ");
      title = `${lastPart} — ${domain}`;
    }
  }

  return {
    url: normalizedUrl,
    title,
    domain,
    favicon,
  };
}
