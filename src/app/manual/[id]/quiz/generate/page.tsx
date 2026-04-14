'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Manual, QuizQuestion } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

type Step = 'loading' | 'config' | 'generating' | 'review' | 'saving' | 'error'
const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizGeneratePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useLang()

  const [manual, setManual] = useState<Manual | null>(null)
  const [step, setStep] = useState<Step>('loading')
  const [count, setCount] = useState<5 | 10>(5)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/manuals/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '불러오기 실패')
        return res.json() as Promise<Manual>
      })
      .then((data) => { setManual(data); setStep('config') })
      .catch(() => { setError(t('quiz.gen.noManual')); setStep('error') })
  }, [params.id, t])

  async function handleGenerate() {
    if (!manual) return
    setError(null)
    setStep('generating')
    try {
      const res = await fetch('/api/quiz-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: manual.blocks, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI 생성 실패')
      setQuestions(data.questions)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 실패')
      setStep('config')
    }
  }

  async function handleSave() {
    if (!manual || !questions.length) return
    setStep('saving')
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manual_id: manual.id,
          title: `${manual.title} — 테스트`,
          questions,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장 실패')
      router.push(`/quiz/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setStep('review')
    }
  }

  function updateQuestion(qIdx: number, updated: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, ...updated } : q)))
  }

  function deleteQuestion(qIdx: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== qIdx))
  }

  // ── 로딩 ──
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/2" />
          {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#DC2626] text-sm">{error}</p>
          <button onClick={() => router.back()} className="text-[#2563EB] text-sm underline">{t('quiz.gen.back')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1E3A5F]">{t('quiz.gen.title')}</h1>
            {manual && <p className="text-xs text-gray-400 mt-0.5">{manual.title}</p>}
          </div>
        </div>

        {/* ── 설정 단계 ── */}
        {(step === 'config' || step === 'generating') && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <p className="text-sm text-gray-600">{t('quiz.gen.subtitle')}</p>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{t('quiz.gen.countLabel')}</p>
              <div className="flex gap-3">
                {([5, 10] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    disabled={step === 'generating'}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      count === n
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    } disabled:opacity-50`}
                  >
                    {n === 5 ? t('quiz.gen.count5') : t('quiz.gen.count10')}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#DC2626]">
                {error}
              </div>
            )}

            {step === 'config' ? (
              <button
                onClick={handleGenerate}
                className="w-full py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
              >
                {t('quiz.gen.generate')}
              </button>
            ) : (
              <div className="w-full py-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center gap-3 text-[#2563EB] text-sm font-medium">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('quiz.gen.generating')}
              </div>
            )}
          </div>
        )}

        {/* ── 검토 단계 ── */}
        {(step === 'review' || step === 'saving') && (
          <>
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* 문제 헤더 */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-gray-100">
                    <span className="text-xs font-semibold text-[#2563EB]">
                      {t('quiz.gen.question', { n: qIdx + 1 })}
                    </span>
                    <button
                      onClick={() => deleteQuestion(qIdx)}
                      className="text-xs text-gray-400 hover:text-[#DC2626] transition-colors"
                    >
                      {t('quiz.gen.deleteQ')}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* 질문 */}
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                      rows={2}
                      className="w-full text-sm font-medium text-gray-800 resize-none focus:outline-none border-b border-gray-100 pb-2 leading-relaxed"
                    />

                    {/* 선택지 */}
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuestion(qIdx, { answer: oIdx })}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                              q.answer === oIdx
                                ? 'border-[#16A34A] bg-[#16A34A] text-white'
                                : 'border-gray-300 text-gray-400 hover:border-gray-400'
                            }`}
                          >
                            {OPTION_LABELS[oIdx]}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...q.options] as [string, string, string, string]
                              newOptions[oIdx] = e.target.value
                              updateQuestion(qIdx, { options: newOptions })
                            }}
                            className={`flex-1 text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${
                              q.answer === oIdx
                                ? 'border-[#16A34A] bg-green-50 text-gray-800'
                                : 'border-gray-200 text-gray-700'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* 해설 */}
                    {q.explanation !== undefined && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">{t('quiz.gen.explanationLabel')}</p>
                        <textarea
                          value={q.explanation}
                          onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
                          rows={2}
                          className="w-full text-xs text-gray-600 resize-none focus:outline-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {questions.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
                모든 문제가 삭제되었습니다.
              </div>
            )}

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#DC2626]">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('config'); setError(null) }}
                disabled={step === 'saving'}
                className="py-4 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {t('quiz.gen.generate')}
              </button>
              <button
                onClick={handleSave}
                disabled={step === 'saving' || questions.length === 0}
                className="flex-1 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {step === 'saving' ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('quiz.gen.saving')}</>
                ) : t('quiz.gen.save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
