/**
 * Server-side URL fetcher with HTML content extraction.
 * Returns structured page content for use as input to AI prompts.
 *
 * Hand-rolled HTML parsing (regex-based) — sufficient for static HTML.
 * JS-rendered SPAs return minimal content (only the initial shell HTML).
 */

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_TEXT_PREVIEW = 3000
const MAX_HEADINGS = 60
const MAX_LINKS = 50
const USER_AGENT = "Mozilla/5.0 (compatible; PXcanvas/1.0; +https://pxcanvas.local)"

export type FetchedPage = {
  url: string
  finalUrl: string
  title: string
  description: string
  headings: string[]
  navLinks: { text: string; href: string }[]
  textPreview: string
  fetchedAt: string
}

function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  if (lower === "localhost" || lower.endsWith(".localhost")) return true
  if (lower === "0.0.0.0" || lower === "::" || lower === "::1") return true
  // IPv4 ranges
  const ipv4 = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number)
    if (a === 10) return true
    if (a === 127) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
  }
  return false
}

function validateUrl(input: string): URL {
  let parsed: URL
  try {
    parsed = new URL(input)
  } catch {
    throw new Error("Invalid URL")
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL must use http or https")
  }
  if (isPrivateHostname(parsed.hostname)) {
    throw new Error("URL points to a private/local address (blocked)")
  }
  return parsed
}

function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

function extractMatches(html: string, regex: RegExp, max: number): string[] {
  const results: string[] = []
  for (const match of html.matchAll(regex)) {
    const text = stripTags(match[1] ?? "")
    if (text) results.push(text)
    if (results.length >= max) break
  }
  return results
}

function extractNavLinks(html: string): { text: string; href: string }[] {
  // Prefer links inside <nav> or <header>
  const containerMatches = html.matchAll(/<(nav|header)\b[^>]*>([\s\S]*?)<\/\1>/gi)
  const containers: string[] = []
  for (const m of containerMatches) containers.push(m[2])

  const haystack = containers.length > 0 ? containers.join("\n") : html

  const links: { text: string; href: string }[] = []
  const seen = new Set<string>()
  for (const m of haystack.matchAll(
    /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
  )) {
    const href = m[1].trim()
    const text = stripTags(m[2])
    if (!href || !text || text.length > 120) continue
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) continue
    const key = `${text}|${href}`
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ text, href })
    if (links.length >= MAX_LINKS) break
  }
  return links
}

async function readWithCap(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return await response.text()
  const decoder = new TextDecoder("utf-8", { fatal: false })
  let text = ""
  let received = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > maxBytes) {
      await reader.cancel()
      break
    }
    text += decoder.decode(value, { stream: true })
  }
  text += decoder.decode()
  return text
}

export async function fetchUrlContent(
  rawUrl: string,
  timeoutMs = 15_000,
): Promise<FetchedPage> {
  const parsed = validateUrl(rawUrl)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(parsed.href, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.8,vi;q=0.5",
      },
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("aborted") || msg.includes("AbortError")) {
      throw new Error(`Fetch timed out after ${Math.round(timeoutMs / 1000)}s`)
    }
    throw new Error(`Network error: ${msg}`)
  }
  clearTimeout(timer)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }

  const ct = (res.headers.get("content-type") ?? "").toLowerCase()
  if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
    throw new Error(`URL did not return HTML (content-type: ${ct || "unknown"})`)
  }

  const html = await readWithCap(res, MAX_BYTES)

  // Strip non-content blocks first
  const cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")

  const titleMatch = cleaned.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? stripTags(titleMatch[1]).slice(0, 200) : ""

  const descMatch = cleaned.match(
    /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["']/i,
  )
  const description = descMatch ? decodeEntities(descMatch[1]).trim().slice(0, 300) : ""

  const headings = extractMatches(cleaned, /<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi, MAX_HEADINGS)
  const navLinks = extractNavLinks(cleaned)

  // textPreview: strip body, take first N chars
  const bodyMatch = cleaned.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  const bodyText = stripTags(bodyMatch ? bodyMatch[1] : cleaned)
  const textPreview = bodyText.slice(0, MAX_TEXT_PREVIEW)

  return {
    url: rawUrl,
    finalUrl: res.url,
    title,
    description,
    headings,
    navLinks,
    textPreview,
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Format a FetchedPage as a structured text block for AI prompts.
 * Compact, scannable by both AI and humans.
 */
export function formatFetchedPageForPrompt(page: FetchedPage): string {
  const lines: string[] = [
    `Reference URL: ${page.finalUrl}`,
    page.title && `Title: ${page.title}`,
    page.description && `Description: ${page.description}`,
  ].filter(Boolean) as string[]

  if (page.navLinks.length > 0) {
    lines.push("", "Navigation links:")
    for (const l of page.navLinks) lines.push(`- ${l.text} → ${l.href}`)
  }

  if (page.headings.length > 0) {
    lines.push("", "Page headings (H1-H3):")
    for (const h of page.headings) lines.push(`- ${h}`)
  }

  if (page.textPreview) {
    lines.push("", "Body text preview:", page.textPreview)
  }

  return lines.join("\n")
}
