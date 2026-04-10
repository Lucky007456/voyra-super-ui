import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://voyra.ai'
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/plan`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/sign-in`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/sign-up`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/destinations/tokyo`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/rome`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/bali`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/dubai`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/paris`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/lisbon`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/kyoto`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/iceland`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/marrakech`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/destinations/santorini`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
