import type { Metadata } from 'next'
import './globals.css'

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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">Reado</span>
              <span className="text-sm text-gray-500 hidden sm:block">매장 매뉴얼</span>
            </a>
            <a
              href="/manual/new"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 새 매뉴얼
            </a>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
