'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '@/context/LanguageContext'

const NAV_ITEMS = [
  { key: 'nav.manuals', href: '/' },
  { key: 'nav.new', href: '/manual/new' },
  { key: 'nav.quiz', href: '/quiz' },
  { key: 'nav.dashboard', href: '/dashboard' },
] as const

export default function HeaderClient() {
  const { t } = useLang()
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-[#1E3A5F] sticky top-0 z-10 shadow-md">
      {/* 상단 로고 + 언어 */}
      <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-lg font-bold text-white tracking-tight">Reado</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-3xl mx-auto px-4">
        <nav className="flex overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ key, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
