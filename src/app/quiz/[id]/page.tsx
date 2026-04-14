'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Quiz, QuizQuestion } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

type Phase = 'loading' | 'name' | 'taking' | 'submitting' | 'result' | 'error'
const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizTakePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useLang()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [takerName, setTakerName] = useState('')
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/quizzes/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '불러오기 실패')
        return res.json() as Promise<Quiz>
      })
      .then((data) => { setQuiz(data); setPhase('name') })
      .catch(() => { setError(t('quiz.take.noQuiz')); setPhase('error') })
  }, [params.id, t])

  function startQuiz() {
    if (!takerName.trim() || !quiz) return
    setAnswers(new Array(quiz.questions.length).fill(null))
    setPhase('taking')
  }

  function selectAnswer(qIdx: number, oIdx: number) {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? oIdx : a)))
  }

  async function handleSubmit() {
    if (!quiz) return
    setPhase('submitting')

    // 채점
    let correct = 0
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].answer) correct++
    }
    const calcScore = Math.round((correct / quiz.questions.length) * 100)
    const calcPassed = calcScore >= 60

    setScore(calcScore)
    setPassed(calcPassed)

    try {
      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quiz.id,
          taker_name: takerName,
          answers,
          score: calcScore,
          passed: calcPassed,
        }),
      })
    } catch {
      // 저장 실패해도 결과는 표시
    }

    setPhase('result')
  }

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null)

  // ── 로딩 ──
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/2" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#DC2626] text-sm">{error}</p>
          <button onClick={() => router.back()} className="text-[#2563EB] text-sm underline">{t('quiz.take.backToList')}</button>
        </div>
      </div>
    )
  }

  // ── 이름 입력 ──
  if (phase === 'name') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-[#1E3A5F]">{quiz?.title}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {t('quiz.list.questions', { n: quiz?.questions.length ?? 0 })} · {t('quiz.take.passLine')}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">{t('quiz.take.nameLabel')}</label>
            <input
              type="text"
              value={takerName}
              onChange={(e) => setTakerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
              placeholder={t('quiz.take.namePlaceholder')}
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
            />
          </div>
          <button
            onClick={startQuiz}
            disabled={!takerName.trim()}
            className="w-full py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quiz.take.start')}
          </button>
        </div>
      </div>
    )
  }

  // ── 응시 중 ──
  if (phase === 'taking' || phase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-[#1E3A5F]">{quiz?.title}</h1>
            <span className="text-sm text-gray-400">
              {answers.filter((a) => a !== null).length} / {quiz?.questions.length}
            </span>
          </div>

          {quiz?.questions.map((q, qIdx) => (
            <QuestionCard
              key={qIdx}
              question={q}
              index={qIdx}
              selected={answers[qIdx] ?? null}
              onSelect={(oIdx) => selectAnswer(qIdx, oIdx)}
              t={t}
            />
          ))}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || phase === 'submitting'}
            className="w-full py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {phase === 'submitting' ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('quiz.take.submitting')}</>
            ) : t('quiz.take.submit')}
          </button>
        </div>
      </div>
    )
  }

  // ── 결과 ──
  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">
          {/* 결과 카드 */}
          <div className={`rounded-2xl p-8 text-center space-y-3 ${passed ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}>
            <div className="text-5xl font-black text-white">{score}<span className="text-2xl font-bold">점</span></div>
            <div className="text-white font-semibold text-lg">
              {passed ? t('quiz.take.passed') : t('quiz.take.failed')}
            </div>
            <div className="text-white/70 text-sm">{takerName}</div>
            <div className="text-white/60 text-xs">{t('quiz.take.passLine')}</div>
          </div>

          {/* 문제별 채점 */}
          <div className="space-y-3">
            {quiz?.questions.map((q, qIdx) => {
              const selected = answers[qIdx]
              const isCorrect = selected === q.answer
              return (
                <div key={qIdx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className={`flex items-center gap-2 px-4 py-3 border-b ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <span className={`text-xs font-bold ${isCorrect ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {isCorrect ? t('quiz.take.correct') : t('quiz.take.wrong')}
                    </span>
                    <span className="text-xs text-gray-500 flex-1">{t('quiz.gen.question', { n: qIdx + 1 })}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-800">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, oIdx) => {
                        const isAnswer = oIdx === q.answer
                        const isSelected = oIdx === selected
                        return (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              isAnswer ? 'bg-green-50 text-[#16A34A] font-medium' :
                              isSelected && !isAnswer ? 'bg-red-50 text-[#DC2626]' :
                              'text-gray-500'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isAnswer ? 'bg-[#16A34A] text-white' :
                              isSelected ? 'bg-[#DC2626] text-white' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {OPTION_LABELS[oIdx]}
                            </span>
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                    {q.explanation && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400">{t('quiz.take.explanation')}: <span className="text-gray-600">{q.explanation}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setPhase('name'); setAnswers([]); setTakerName('') }}
              className="flex-1 py-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t('quiz.take.retry')}
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className="flex-1 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              {t('quiz.take.backToList')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

function QuestionCard({
  question, index, selected, onSelect, t,
}: {
  question: QuizQuestion
  index: number
  selected: number | null
  onSelect: (i: number) => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-gray-100">
        <span className="text-xs font-semibold text-[#2563EB]">
          {t('quiz.gen.question', { n: index + 1 })}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-gray-800 leading-relaxed">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((opt, oIdx) => (
            <button
              key={oIdx}
              onClick={() => onSelect(oIdx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${
                selected === oIdx
                  ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                  : 'border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                selected === oIdx ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {OPTION_LABELS[oIdx]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
