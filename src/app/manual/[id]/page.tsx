'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockEditor from '@/components/BlockEditor'
import { Manual, ManualBlock } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'
import { LANGS, formatRelativeTime } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

type Mode = 'loading' | 'view' | 'edit' | 'saving' | 'error'

export default function ManualDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t, lang } = useLang()

  const [manual, setManual] = useState<Manual | null>(null)
  const [blocks, setBlocks] = useState<ManualBlock[]>([])
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<Mode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 번역 패널 상태
  const [showTranslate, setShowTranslate] = useState(false)
  const [targetLang, setTargetLang] = useState<Lang | null>(null)
  const [translating, setTranslating] = useState(false)
  const [translatedBlocks, setTranslatedBlocks] = useState<ManualBlock[] | null>(null)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [savingTranslation, setSavingTranslation] = useState(false)

  useEffect(() => {
    fetch(`/api/manuals/${params.id}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '매뉴얼을 불러오지 못했습니다.')
        }
        return res.json() as Promise<Manual>
      })
      .then((data) => {
        setManual(data)
        setTitle(data.title)
        setBlocks(data.blocks)
        setMode('view')
      })
      .catch((err) => {
        setError(err.message)
        setMode('error')
      })
  }, [params.id])

  async function handleSave() {
    setSaveError(null)
    if (!title.trim()) { setSaveError(t('detail.titleLabel') + ' 을 입력해주세요.'); return }
    setMode('saving')
    try {
      const res = await fetch(`/api/manuals/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, blocks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.')
      setManual(data)
      setTitle(data.title)
      setBlocks(data.blocks)
      setMode('view')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      setMode('edit')
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/manuals/${params.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제에 실패했습니다.')
      router.push('/')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
      setShowDeleteConfirm(false)
    }
  }

  function handleCancelEdit() {
    if (!manual) return
    setTitle(manual.title)
    setBlocks(manual.blocks)
    setSaveError(null)
    setMode('view')
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
    const newTitle = `[${langLabel}] ${title}`

    try {
      const res = await fetch('/api/manuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, blocks: translatedBlocks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/manual/${data.id}`)
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSavingTranslation(false)
    }
  }

  // ── 로딩 ──
  if (mode === 'loading') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="space-y-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${65 + i * 7}%` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (mode === 'error') {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={() => router.push('/')} className="text-blue-600 text-sm underline">
          {t('error.back')}
        </button>
      </div>
    )
  }

  const isEditing = mode === 'edit' || mode === 'saving'

  return (
    <div className="space-y-6 pb-10">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1 truncate">
          {isEditing ? t('detail.editMode') : manual?.title}
        </h1>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowTranslate((v) => !v); setTranslatedBlocks(null); setTranslateError(null) }}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                showTranslate ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {t('translate.btn')}
            </button>
            <button
              onClick={() => setMode('edit')}
              className="text-sm text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('detail.btn.edit')}
            </button>
          </div>
        )}
      </div>

      {/* 편집 모드: 제목 */}
      {isEditing && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('detail.titleLabel')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('detail.titlePlaceholder')}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      )}

      {/* 뷰 모드: 메타 */}
      {!isEditing && manual && (
        <p className="text-xs text-gray-400 -mt-4">
          {t('detail.savedAt', { time: formatRelativeTime(manual.updated_at || manual.created_at, lang) })}
        </p>
      )}

      {/* ── 번역 패널 ── */}
      {showTranslate && !isEditing && (
        <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">{t('translate.title')}</h3>
            <button
              onClick={() => { setShowTranslate(false); setTranslatedBlocks(null); setTranslateError(null) }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {t('translate.close')}
            </button>
          </div>

          {/* 언어 선택 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">{t('translate.selectLang')}</p>
            <div className="flex gap-2 flex-wrap">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setTargetLang(l.code); setTranslatedBlocks(null); setTranslateError(null) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    targetLang === l.code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 번역 시작 버튼 */}
          <button
            onClick={handleTranslate}
            disabled={!targetLang || translating}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {translating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('translate.translating')}
              </>
            ) : t('translate.start')}
          </button>

          {/* 번역 에러 */}
          {translateError && (
            <p className="text-sm text-red-500">{translateError}</p>
          )}

          {/* 번역 결과 */}
          {translatedBlocks && !translating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700">{t('translate.result')}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {LANGS.find((l) => l.code === targetLang)?.flag}{' '}
                    {t('translate.badge')}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 max-h-72 overflow-y-auto space-y-2 scrollbar-thin">
                {translatedBlocks.map((block, i) => (
                  <div key={i}>
                    <MediaBlock block={block} compact />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveTranslation}
                disabled={savingTranslation}
                className="w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingTranslation ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('new.btn.saving')}
                  </>
                ) : t('translate.saveAs')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 블록 내용 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        {isEditing ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">{t('detail.contentLabel')}</span>
              <span className="text-xs text-gray-400">{t('detail.blockCount', { count: blocks.length })}</span>
            </div>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, i) => (
              <div key={i}>
                <MediaBlock block={block} />
              </div>
            ))}
            {blocks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">{t('detail.noContent')}</p>
            )}
          </div>
        )}
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {saveError}
        </div>
      )}

      {/* 편집 버튼 */}
      {isEditing && (
        <div className="flex gap-3">
          <button
            onClick={handleCancelEdit}
            disabled={mode === 'saving'}
            className="py-3.5 px-5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('detail.btn.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={mode === 'saving'}
            className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {mode === 'saving' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('detail.btn.saving')}
              </>
            ) : t('detail.btn.save')}
          </button>
        </div>
      )}

      {/* 삭제 */}
      {!isEditing && (
        <div className="pt-4 border-t border-gray-100">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              {t('detail.btn.delete')}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{t('detail.deleteConfirm')}</span>
              <button onClick={handleDelete} className="text-sm text-red-600 font-medium hover:underline">
                {t('detail.deleteBtn')}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-sm text-gray-400 hover:underline">
                {t('detail.cancelDelete')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── 미디어 블록 렌더러 ──
function MediaBlock({ block, compact = false }: { block: ManualBlock; compact?: boolean }) {
  if (block.type === 'text') {
    return (
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {block.content}
      </p>
    )
  }
  if (block.type === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={block.content}
        alt=""
        className={`w-full rounded-xl object-contain ${compact ? 'max-h-40' : 'max-h-72'}`}
      />
    )
  }
  if (block.type === 'video') {
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <video
          controls
          preload="metadata"
          playsInline
          className={`w-full ${compact ? 'max-h-40' : 'max-h-72'}`}
        >
          <source src={block.content} />
        </video>
      </div>
    )
  }
  return null
}
