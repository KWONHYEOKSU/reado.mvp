'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { formatRelativeTime } from '@/lib/i18n'

type ResultRow = {
  id: string
  quiz_id: string
  taker_name: string
  answers: number[]
  score: number
  passed: boolean
  created_at: string
  quizzes: { title: string; manual_id: string } | null
}

export default function DashboardPage() {
  const { t, lang } = useLang()
  const [results, setResults] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/quiz-results')
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '불러오기 실패')
        return res.json() as Promise<ResultRow[]>
      })
      .then((data) => setResults(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalCount = results.length
  const passCount = results.filter((r) => r.passed).length
  const passRate = totalCount === 0 ? 0 : Math.round((passCount / totalCount) * 100)
  const avgScore = totalCount === 0 ? 0 : Math.round(results.reduce((s, r) => s + r.score, 0) / totalCount)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-16">
        {/* 헤더 */}
        <div>
          <h1 className="text-xl font-bold text-[#1E3A5F]">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>

        {/* 통계 카드 */}
        {!loading && totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={String(totalCount)} label={t('dashboard.totalResults', { n: totalCount })} color="blue" />
            <StatCard value={`${passRate}%`} label={t('dashboard.passRate')} color="green" />
            <StatCard value={`${avgScore}점`} label={t('dashboard.avgScore')} color="navy" />
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        {!loading && !error && totalCount === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center space-y-3">
            <svg className="w-12 h-12 mx-auto text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-400 text-sm">{t('dashboard.empty')}</p>
          </div>
        )}

        {/* 결과 테이블 */}
        {!loading && totalCount > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[1fr_2fr_80px_80px_100px] gap-2 px-4 py-3 bg-[#F8FAFC] border-b border-gray-100 text-xs font-semibold text-gray-500">
              <span>{t('dashboard.col.name')}</span>
              <span>{t('dashboard.col.quiz')}</span>
              <span className="text-center">{t('dashboard.col.score')}</span>
              <span className="text-center">{t('dashboard.col.passed')}</span>
              <span className="text-right">{t('dashboard.col.date')}</span>
            </div>

            {/* 테이블 행 */}
            <div className="divide-y divide-gray-50">
              {results.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1fr_2fr_80px_80px_100px] gap-2 px-4 py-3.5 items-center hover:bg-[#F8FAFC] transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 truncate">{row.taker_name}</span>
                  <span className="text-sm text-gray-500 truncate">{row.quizzes?.title ?? '—'}</span>
                  <span className="text-sm font-semibold text-center"
                    style={{ color: row.score >= 60 ? '#16A34A' : '#DC2626' }}
                  >
                    {row.score}점
                  </span>
                  <span className="text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                      row.passed
                        ? 'bg-green-100 text-[#16A34A]'
                        : 'bg-red-100 text-[#DC2626]'
                    }`}>
                      {row.passed ? t('dashboard.passed') : t('dashboard.failed')}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400 text-right">
                    {formatRelativeTime(row.created_at, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ value, label, color }: { value: string; label: string; color: 'blue' | 'green' | 'navy' }) {
  const bgMap = { blue: 'bg-blue-50', green: 'bg-green-50', navy: 'bg-[#EEF2F8]' }
  const textMap = { blue: 'text-[#2563EB]', green: 'text-[#16A34A]', navy: 'text-[#1E3A5F]' }
  return (
    <div className={`${bgMap[color]} rounded-2xl p-4 text-center`}>
      <div className={`text-2xl font-black ${textMap[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
