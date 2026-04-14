'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Quiz } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'
import { formatRelativeTime } from '@/lib/i18n'

export default function QuizListPage() {
  const { t, lang } = useLang()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/quizzes')
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '불러오기 실패')
        return res.json() as Promise<Quiz[]>
      })
      .then((data) => setQuizzes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">
        <div>
          <h1 className="text-xl font-bold text-[#1E3A5F]">{t('quiz.list.title')}</h1>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center space-y-3">
            <svg className="w-12 h-12 mx-auto text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 text-sm">{t('quiz.list.empty')}</p>
            <Link href="/" className="inline-block text-sm text-[#2563EB] hover:underline">
              {t('nav.manuals')} →
            </Link>
          </div>
        )}

        {!loading && quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[#1E3A5F] truncate">{quiz.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">
                    {t('quiz.list.questions', { n: quiz.questions.length })}
                  </span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(quiz.created_at, lang)}
                  </span>
                </div>
              </div>
              <Link
                href={`/quiz/${quiz.id}`}
                className="flex-shrink-0 px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                {t('quiz.list.take')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
