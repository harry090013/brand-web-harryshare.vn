/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ovauoyvpnnajcgecambg.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/editor',
        destination: '/admin/posts/new',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/ve-harry',
        permanent: true,
      },
      {
        source: '/chia-se',
        destination: '/ghi-chep',
        permanent: true,
      },
      {
        source: '/goc-review',
        destination: '/du-an-tai-nguyen/cong-cu-minh-dung',
        permanent: true,
      },
      {
        source: '/san-pham-cua-toi',
        destination: '/du-an-tai-nguyen/san-pham',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
