import { searchPhotos, getDestinationPhoto } from '@/lib/unsplash'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 86400 // 24h ISR cache

/**
 * GET /api/photos?q=Tokyo&count=4
 * Proxies Unsplash search server-side so the access key is never exposed.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const count = Math.min(Number(searchParams.get('count') || '1'), 12)
  const mode = searchParams.get('mode') // 'destination' | 'search'

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter ?q=' }, { status: 400 })
  }

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return NextResponse.json({ error: 'Unsplash key not configured' }, { status: 503 })
  }

  try {
    if (mode === 'destination') {
      const photo = await getDestinationPhoto(q)
      return NextResponse.json({ photo })
    }

    const photos = await searchPhotos(q, count)
    return NextResponse.json({ photos })
  } catch (err) {
    console.error('[/api/photos]', err)
    return NextResponse.json({ error: 'Unsplash request failed' }, { status: 502 })
  }
}
