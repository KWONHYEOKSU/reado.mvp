'use client'

import { useLang } from '@/context/LanguageContext'
import { LANGS } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.native}
          className={`
            px-2 py-1 rounded-md text-xs font-semibold transition-all
            ${lang === l.code
              ? 'bg-white text-[#1E3A5F] shadow-sm'
              : 'text-white/60 hover:text-white'
            }
          `}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
