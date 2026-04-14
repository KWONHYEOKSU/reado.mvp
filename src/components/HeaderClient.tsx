'use client'

import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '@/context/LanguageContext'

export default function HeaderClient() {
  const { t } = useLang()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-bold text-blue-600">Reado</span>
          <span className="text-sm text-gray-400 hidden sm:block">{t('app.tagline')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/manual/new"
            className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            {t('header.newManual')}
          </Link>
        </div>
      </div>
    </header>
  )
}
