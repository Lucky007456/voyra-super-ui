const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!
const BASE = 'https://api.unsplash.com'

export interface UnsplashPhoto {
  id: string
  url: string          // full/regular size URL
  thumb: string        // small thumbnail
  blur_hash: string
  alt: string
  author: string
  author_url: string
  color: string        // dominant hex color
}

/**
 * Search Unsplash for photos matching a query.
 * Always called server-side (API route) — key never exposed to client.
 */
export async function searchPhotos(query: string, count = 1): Promise<UnsplashPhoto[]> {
  const params = new URLSearchParams({
    query,
    per_page: String(count),
    orientation: 'landscape',
    content_filter: 'high',
  })

  const res = await fetch(`${BASE}/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    next: { revalidate: 86400 }, // cache 24 hours
  })

  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status}`)

  const data = await res.json()
  return (data.results || []).map((p: Record<string, unknown>) => {
    const urls = p.urls as Record<string, string>
    const user = p.user as Record<string, string | { html: string }>
    const links = user.links as { html: string }
    return {
      id: p.id as string,
      url: urls.regular,
      thumb: urls.small,
      blur_hash: p.blur_hash as string,
      alt: (p.alt_description as string) || query,
      color: p.color as string,
      author: user.name as string,
      author_url: links.html,
    }
  })
}

/**
 * Get a single photo for a destination — returns a fallback if Unsplash fails.
 */
export async function getDestinationPhoto(destination: string): Promise<UnsplashPhoto | null> {
  try {
    const results = await searchPhotos(`${destination} travel landmark`, 3)
    return results[0] ?? null
  } catch {
    return null
  }
}

/**
 * Batch fetch photos for multiple destinations.
 */
export async function getMultipleDestinationPhotos(
  destinations: string[]
): Promise<Record<string, UnsplashPhoto>> {
  const entries = await Promise.allSettled(
    destinations.map(async (dest) => {
      const photo = await getDestinationPhoto(dest)
      return [dest, photo] as [string, UnsplashPhoto | null]
    })
  )

  const result: Record<string, UnsplashPhoto> = {}
  for (const entry of entries) {
    if (entry.status === 'fulfilled' && entry.value[1]) {
      result[entry.value[0]] = entry.value[1]
    }
  }
  return result
}
