// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://captionin.varstory.my.id',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://captionin.varstory.my.id/pricing', // sesuaikan route yang ada
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // tambah route lain yang mau di-index
  ]
}