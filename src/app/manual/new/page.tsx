'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ManualBlock } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'

type Section = { section_title: string; content: string }
type Step = 'input' | 'generating' | 'preview' | 'saving'

export default function NewManualPage() {
  const router = useRouter()
  const { t, lang } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<Step>('input')
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState<string | null>(null)

  const canGenerate = title.trim().length > 0 && files.length > 0 && step === 'input'

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const merged = [...files, ...selected].slice(0, 10)
    setFiles(merged)
    e.target.value = ''
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleGenerate() {
    if (!canGenerate) return
    setError(null)
    setStep('generating')

    try {
      // base64 변환
      const imagePayload = await Promise.all(
        files.map(
          (file) =>
            new Promise<{ base64: string; mediaType: string }>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => {
                const result = reader.result as string
                const base64 = result.split(',')[1]
                resolve({ base64, mediaType: file.type })
              }
              reader.onerror = reject
              reader.readAsDataURL(file)
            })
        )
      )

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagePayload, lang }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI 생성 실패')

      if (!data.sections || data.sections.length === 0) {
        throw new Error('섹션이 생성되지 않았습니다.')
      }

      setSections(data.sections)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
      setStep('input')
    }
  }

  async function handleSave() {
    if (!title.trim() || sections.length === 0) return
    setError(null)
    setStep('saving')

    // 섹션 → 블록 변환
    const blocks: ManualBlock[] = sections.flatMap((s) => [
      { type: 'text', content: s.content, section_title: s.section_title },
    ])

    try {
      const res = await fetch('/api/manuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, blocks }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장 실패')
      router.push(`/manual/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setStep('preview')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-16">

        {/* 헤더 */}
        <div>
          <h1 className="text-xl font-bold text-[#1E3A5F]">{t('new.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('new.subtitle')}</p>
        </div>

        {/* 진행 단계 */}
        <StepBar step={step} />

        {/* ── STEP 1+2: 입력 / 생성 중 ── */}
        {(step === 'input' || step === 'generating') && (
          <div className="space-y-5">
            {/* 매뉴얼 이름 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                {t('new.edit.titleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('new.edit.titlePlaceholder')}
                maxLength={100}
                disabled={step === 'generating'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm disabled:bg-gray-50"
              />
            </div>

            {/* 파일 업로드 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  {t('new.upload.title')}
                  <span className="text-gray-400 font-normal ml-1">{t('new.upload.hint')}</span>
                </label>
                {files.length > 0 && (
                  <span className="text-xs text-gray-400">{files.length} / 10</span>
                )}
              </div>

              {/* 파일 목록 */}
              {files.length > 0 && (
                <ul className="space-y-1.5">
                  {files.map((file, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 bg-[#F8FAFC] rounded-lg border border-gray-100"
                    >
                      <FileIcon />
                      <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                      {step !== 'generating' && (
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* 추가 버튼 */}
              {files.length < 10 && step !== 'generating' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors flex flex-col items-center gap-2"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{files.length === 0 ? t('upload.drag') : t('upload.add')}</span>
                    <span className="text-xs">JPG, PNG, WEBP · 최대 10MB</span>
                  </button>
                </>
              )}
            </div>

            {error && <ErrorBanner message={error} />}

            {/* 생성 버튼 */}
            {step === 'input' ? (
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 rounded-xl font-semibold text-sm transition-all ${
                  canGenerate
                    ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {files.length === 0 || !title.trim()
                  ? t('new.btn.empty')
                  : t('new.btn.generate', { count: files.length })}
              </button>
            ) : (
              <div className="w-full py-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center gap-3 text-[#2563EB] text-sm font-medium">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('new.btn.generating')}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: 미리보기 ── */}
        {(step === 'preview' || step === 'saving') && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">{t('detail.toc')}</h2>
                <span className="text-xs text-gray-400">{sections.length}개 섹션</span>
              </div>

              {sections.map((sec, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC]">
                    <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.section_title}
                      onChange={(e) => {
                        const next = [...sections]
                        next[i] = { ...next[i], section_title: e.target.value }
                        setSections(next)
                      }}
                      className="flex-1 bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <textarea
                      value={sec.content}
                      onChange={(e) => {
                        const next = [...sections]
                        next[i] = { ...next[i], content: e.target.value }
                        setSections(next)
                      }}
                      rows={3}
                      className="w-full text-sm text-gray-600 leading-relaxed resize-none focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && <ErrorBanner message={error} />}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('input'); setError(null) }}
                disabled={step === 'saving'}
                className="py-4 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t('new.btn.regenerate')}
              </button>
              <button
                onClick={handleSave}
                disabled={step === 'saving'}
                className="flex-1 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {step === 'saving' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('new.btn.saving')}
                  </>
                ) : t('new.btn.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function StepBar({ step }: { step: Step }) {
  const steps = ['input', 'generating', 'preview']
  const currentIndex = step === 'saving' ? 2 : steps.indexOf(step)

  return (
    <div className="flex items-center gap-2">
      {['사진 업로드', 'AI 생성', '확인 및 저장'].map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentIndex
                  ? 'bg-[#2563EB] text-white'
                  : i === currentIndex
                  ? 'bg-blue-100 text-[#2563EB] ring-2 ring-[#2563EB]'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < currentIndex ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i === currentIndex ? 'text-[#2563EB] font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < 2 && <div className="h-px flex-1 bg-gray-200 mx-2 mb-4" />}
        </div>
      ))}
    </div>
  )
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#DC2626] flex items-start gap-2">
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
