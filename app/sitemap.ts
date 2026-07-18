// Jika menggunakan JavaScript biasa, hapus bagian ": MetadataRoute.Sitemap"
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti URL dasar dengan domain subdomain kamu
  const baseUrl = 'https://captionin.varstory.my.id'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Kalau kamu punya halaman lain, tinggal tambahkan di bawah sini, contoh:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}