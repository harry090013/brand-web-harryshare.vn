import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://harryshare.vn'),
  title: {
    default: 'Harry Share | Tư duy Sản phẩm & Thương hiệu',
    template: '%s | Harry Share'
  },
  description: 'Góc nhìn thực chiến về Phát triển Sản phẩm, Marketing và Xây dựng Thương hiệu cá nhân từ Harry.',
  openGraph: {
    title: 'Harry Share | Tư duy Sản phẩm & Thương hiệu',
    description: 'Góc nhìn thực chiến về Phát triển Sản phẩm, Marketing và Xây dựng Thương hiệu cá nhân từ Harry.',
    url: 'https://harryshare.vn',
    siteName: 'Harry Share',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harry Share | Tư duy Sản phẩm & Thương hiệu',
    description: 'Góc nhìn thực chiến về Phát triển Sản phẩm, Marketing và Xây dựng Thương hiệu cá nhân từ Harry.',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-cream text-olive antialiased`} suppressHydrationWarning>
        <Navbar />

        <main className="min-h-screen">{children}</main>

        <footer className="border-t mt-20 border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-500">
            © {new Date().getFullYear()} Harry Share • harryshare.vn
          </div>
        </footer>
      </body>
    </html>
  )
}