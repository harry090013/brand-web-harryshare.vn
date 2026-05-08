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
  title: 'Harry Share - Xây dựng thương hiệu cá nhân',
  description: 'Marketer chia sẻ góc nhìn, review sản phẩm và dịch vụ tư vấn thương hiệu cá nhân',
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