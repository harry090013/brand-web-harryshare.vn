import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import ZenWidget from '../components/ZenWidget'
import LayoutShell from '../components/LayoutShell'

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
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-cream bg-dot-pattern text-olive antialiased`} suppressHydrationWarning>
        <ZenWidget />
        <LayoutShell
          navbar={<Navbar />}
          footer={
            <footer className="bg-white border-t border-gray-200 mt-20">
              <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                  {/* Cột 1: Brand */}
                  <div className="md:col-span-2">
                    <Link href="/" className="font-[family-name:var(--font-serif)] font-bold text-2xl text-olive mb-4 inline-block">Harry Share</Link>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
                      Góc nhìn thực chiến về Phát triển Sản phẩm, Marketing và Xây dựng Thương hiệu cá nhân từ một người làm nghề thật, nói thật.
                    </p>
                    <div className="flex items-center gap-4">
                      <a href="https://www.facebook.com/quanghieu.sts/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sage transition" aria-label="Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                      </a>
                      <a href="https://www.tiktok.com/@quanghieusts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sage transition" aria-label="TikTok">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.34 2.88 2.88 0 012.31-4.53 2.66 2.66 0 011.08.21V9.13a6.13 6.13 0 00-1.08-.1A6.29 6.29 0 005.6 15.35a6.3 6.3 0 0010.59-4.23V7.93a8.14 8.14 0 004.8 1.56V6.13a5.41 5.41 0 01-1.4-.44z" /></svg>
                      </a>
                      <a href="https://www.instagram.com/nqhieu09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sage transition" aria-label="Instagram">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* Cột 2: Khám phá */}
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] font-semibold text-olive mb-4">Khám phá</h3>
                    <ul className="space-y-3 text-sm text-gray-500">
                      <li><Link href="/chia-se" className="hover:text-sage transition">Bài viết & Chia sẻ</Link></li>
                      <li><Link href="/san-pham-cua-toi" className="hover:text-sage transition">Sản phẩm của tôi</Link></li>
                      <li><Link href="/san-pham-da-dung" className="hover:text-sage transition">Góc Review</Link></li>
                      <li><Link href="/about" className="hover:text-sage transition">Tôi là ai?</Link></li>
                    </ul>
                  </div>

                  {/* Cột 3: Chính sách */}
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] font-semibold text-olive mb-4">Hỗ trợ</h3>
                    <ul className="space-y-3 text-sm text-gray-500">
                      <li><Link href="/lien-he" className="hover:text-sage transition">Liên hệ hợp tác</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Harry Share. Đã đăng ký bản quyền.
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    Design by <span className="text-sage font-bold">Harry!</span>
                  </div>
                </div>
              </div>
            </footer>
          }
        >
          {children}
        </LayoutShell>
      </body>
    </html>
  )
}