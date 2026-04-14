'use client'

import { useLang } from '@/context/LanguageContext'
import { LANGS } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.native}
          className={`
            px-2 py-1 rounded-md text-xs font-semibold transition-all
            ${lang === l.code
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
            }
          `}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
