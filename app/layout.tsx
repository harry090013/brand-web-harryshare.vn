import './globals.css'
import { Mali } from 'next/font/google'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

// Font Mali full tiếng Việt
const mali = Mali({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Harry Share - Xây dựng thương hiệu cá nhân',
  description: 'Marketer chia sẻ góc nhìn, review sản phẩm và dịch vụ tư vấn thương hiệu cá nhân',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={mali.className} suppressHydrationWarning>
        {/* Thay header cũ bằng Navbar responsive */}
        <Navbar />

        <main className="min-h-">{children}</main>

        <footer className="border-t mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-zinc-500">
            © {new Date().getFullYear()} Harry Share • harryshare.vn
          </div>
        </footer>
      </body>
    </html>
  )
}