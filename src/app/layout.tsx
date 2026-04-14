import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import HeaderClient from '@/components/HeaderClient'

export const metadata: Metadata = {
  title: 'Reado - 매장 업무 매뉴얼',
  description: 'AI가 매장 사진을 분석하여 업무 매뉴얼을 자동으로 생성합니다',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <LanguageProvider>
          <HeaderClient />
          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
