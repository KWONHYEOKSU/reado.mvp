'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'
import { formatRelativeTime } from '@/lib/i18n'

type ManualSummary = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const { t, lang } = useLang()
  const [manuals, setManuals] = useState<ManualSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/manuals')
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '목록을 불러오지 못했습니다.')
        }
        return res.json()
      })
      .then((data) => setManuals(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('home.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('home.subtitle')}</p>
      </div>

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* 에러 */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error.includes('supabase') ||
          error.includes('relation') ||
          error.includes('does not exist') ||
          error.includes('Supabase')
            ? t('home.error.supabase')
            : error}
        </div>
      )}

      {/* 매뉴얼 카드 목록 */}
      {!loading && !error && manuals.length > 0 && (
        <div className="space-y-3">
          {manuals.map((manual) => (
            <Link
              key={manual.id}
              href={`/manual/${manual.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {manual.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(manual.updated_at || manual.created_at, lang)}{' '}
                    {t('home.savedAt')}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-blue-400 flex-shrink-0 transition-colors mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && !error && manuals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium">{t('home.empty.title')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('home.empty.subtitle')}</p>
          </div>
          <Link
            href="/manual/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t('home.empty.cta')}
          </Link>
        </div>
      )}
    </div>
  )
}
