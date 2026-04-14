'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockEditor from '@/components/BlockEditor'
import { Manual, ManualBlock } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'
import { LANGS, formatRelativeTime } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

type Mode = 'loading' | 'edit' | 'saving' | 'error'

export default function ManualEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t, lang } = useLang()

  const [manual, setManual] = useState<Manual | null>(null)
  const [blocks, setBlocks] = useState<ManualBlock[]>([])
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<Mode>('loading')
  const [error, setError] = useState<string | null>(null)

  // 번역
  const [showTranslate, setShowTranslate] = useState(false)
  const [targetLang, setTargetLang] = useState<Lang | null>(null)
  const [translating, setTranslating] = useState(false)
  const [translatedBlocks, setTranslatedBlocks] = useState<ManualBlock[] | null>(null)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [savingTranslation, setSavingTranslation] = useState(false)

  useEffect(() => {
    fetch(`/api/manuals/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '불러오기 실패')
        return res.json() as Promise<Manual>
      })
      .then((data) => {
        setManual(data)
        setTitle(data.title)
        setBlocks(data.blocks)
        setMode('edit')
      })
      .catch((err) => { setError(err.message); setMode('error') })
  }, [params.id])

  async function handleSave() {
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    setError(null)
    setMode('saving')
    try {
      const res = await fetch(`/api/manuals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, blocks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장 실패')
      router.push(`/manual/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setMode('edit')
    }
  }

  async function handleTranslate() {
    if (!targetLang || !blocks.length) return
    setTranslating(true)
    setTranslatedBlocks(null)
    setTranslateError(null)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, targetLang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('translate.error'))
      setTranslatedBlocks(data.translatedBlocks)
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : t('translate.error'))
    } finally {
      setTranslating(false)
    }
  }

  async function handleSaveTranslation() {
    if (!translatedBlocks || !targetLang) return
    setSavingTranslation(true)
    const langLabel = LANGS.find((l) => l.code === targetLang)?.native ?? targetLang
    try {
      const res = await fetch('/api/manuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `[${langLabel}] ${title}`, blocks: translatedBlocks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/manual/${data.id}`)
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSavingTranslation(false)
    }
  }

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (mode === 'error') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#DC2626] text-sm">{error}</p>
          <button onClick={() => router.back()} className="text-[#2563EB] text-sm underline">{t('error.back')}</button>
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
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#1E3A5F] flex-1">{t('detail.editMode')}</h1>
          <button
            onClick={() => { setShowTranslate((v) => !v); setTranslatedBlocks(null) }}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              showTranslate ? 'bg-[#2563EB] text-white' : 'text-[#2563EB] hover:bg-blue-50'
            }`}
          >
            {t('translate.btn')}
          </button>
        </div>

        {manual && (
          <p className="text-xs text-gray-400 -mt-3">
            {t('detail.savedAt', { time: formatRelativeTime(manual.updated_at || manual.created_at, lang) })}
          </p>
        )}

        {/* 제목 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">{t('detail.titleLabel')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('detail.titlePlaceholder')}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
          />
        </div>

        {/* 번역 패널 */}
        {showTranslate && (
          <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">{t('translate.title')}</h3>
              <button onClick={() => { setShowTranslate(false); setTranslatedBlocks(null) }} className="text-xs text-gray-400">
                {t('translate.close')}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setTargetLang(l.code); setTranslatedBlocks(null) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    targetLang === l.code ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span>{l.flag}</span><span>{l.native}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleTranslate}
              disabled={!targetLang || translating}
              className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {translating ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('translate.translating')}</>
              ) : t('translate.start')}
            </button>
            {translateError && <p className="text-sm text-[#DC2626]">{translateError}</p>}
            {translatedBlocks && (
              <div className="space-y-2">
                <div className="bg-white rounded-xl border border-gray-200 p-3 max-h-48 overflow-y-auto space-y-2">
                  {translatedBlocks.filter(b => b.type === 'text').map((b, i) => (
                    <p key={i} className="text-xs text-gray-700 leading-relaxed">{b.content}</p>
                  ))}
                </div>
                <button
                  onClick={handleSaveTranslation}
                  disabled={savingTranslation}
                  className="w-full py-2.5 bg-white border border-blue-300 text-[#2563EB] rounded-xl text-sm font-semibold hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingTranslation ? t('new.btn.saving') : t('translate.saveAs')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 블록 에디터 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">{t('detail.contentLabel')}</span>
            <span className="text-xs text-gray-400">{t('detail.blockCount', { count: blocks.length })}</span>
          </div>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        {/* 저장 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            disabled={mode === 'saving'}
            className="py-4 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {t('detail.btn.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={mode === 'saving'}
            className="flex-1 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {mode === 'saving' ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('detail.btn.saving')}</>
            ) : t('detail.btn.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
