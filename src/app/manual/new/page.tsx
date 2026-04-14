'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader, { UploadedImage } from '@/components/ImageUploader'
import ManualViewer from '@/components/ManualViewer'
import BlockEditor from '@/components/BlockEditor'
import { ManualBlock } from '@/lib/supabase'

type Step = 'upload' | 'generating' | 'editing' | 'saving'

// AI 응답 텍스트를 블록 배열로 파싱
function parseToBlocks(text: string): ManualBlock[] {
  const lines = text.split('\n')
  const blocks: ManualBlock[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    blocks.push({ type: 'text', content: trimmed })
  }

  return blocks
}

export default function NewManualPage() {
  const router = useRouter()

  const [images, setImages] = useState<UploadedImage[]>([])
  const [step, setStep] = useState<Step>('upload')
  const [generatedText, setGeneratedText] = useState('')
  const [blocks, setBlocks] = useState<ManualBlock[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canGenerate = images.length > 0 && step === 'upload'

  // Step 2: Claude Vision 스트리밍 생성
  async function handleGenerate() {
    if (!canGenerate) return
    setError(null)
    setGeneratedText('')
    setStep('generating')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images.map((img) => ({
            base64: img.base64,
            mediaType: img.file.type,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '매뉴얼 생성에 실패했습니다.')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              fullText += parsed.text
              setGeneratedText(fullText)
            }
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue
            throw parseErr
          }
        }
      }

      // 생성 완료 → 블록으로 변환, 편집 모드 진입
      const parsed = parseToBlocks(fullText)
      setBlocks(parsed)

      // 첫 번째 블록이 제목처럼 보이면 title로 분리
      if (parsed.length > 0) {
        const first = parsed[0].content
        // 짧고 ':'나 번호 없으면 제목으로 간주
        if (first.length < 60 && !/^\d+[\.\)]/.test(first) && !first.includes(':')) {
          setTitle(first)
          setBlocks(parsed.slice(1))
        }
      }

      setStep('editing')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(msg)
      setStep('upload')
    }
  }

  // Step 4: Supabase에 저장
  async function handleSave() {
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    if (blocks.length === 0) {
      setError('내용 블록이 하나 이상 있어야 합니다.')
      return
    }

    setError(null)
    setStep('saving')

    try {
      const res = await fetch('/api/manuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, blocks }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.')

      router.push(`/manual/${data.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다.'
      setError(msg)
      setStep('editing')
    }
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">새 매뉴얼 만들기</h1>
        <p className="text-sm text-gray-500 mt-1">
          매장 사진을 업로드하면 AI가 업무 매뉴얼을 자동으로 작성해드려요
        </p>
      </div>

      {/* 진행 단계 */}
      <div className="flex items-center gap-2">
        <StepBadge number={1} label="사진 업로드" active={step === 'upload'} done={step !== 'upload'} />
        <div className="h-px flex-1 bg-gray-200" />
        <StepBadge number={2} label="AI 생성" active={step === 'generating'} done={step === 'editing' || step === 'saving'} />
        <div className="h-px flex-1 bg-gray-200" />
        <StepBadge number={3} label="편집 및 저장" active={step === 'editing' || step === 'saving'} done={false} />
      </div>

      {/* ── Step 1+2: 업로드 & 생성 영역 ── */}
      {(step === 'upload' || step === 'generating') && (
        <>
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              📸 매장 사진 선택
              <span className="text-gray-400 font-normal ml-1">(최대 5장)</span>
            </h2>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              disabled={step === 'generating'}
            />
          </section>

          {step === 'generating' && (
            <ManualViewer content={generatedText} isStreaming={true} />
          )}

          {error && <ErrorBanner message={error} />}

          {step === 'upload' && (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                canGenerate
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {images.length === 0 ? '사진을 먼저 선택해주세요' : `AI 매뉴얼 생성하기 (${images.length}장)`}
            </button>
          )}

          {step === 'generating' && (
            <div className="w-full py-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-3 text-blue-700 text-sm font-medium">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI가 매뉴얼을 작성하고 있어요...
            </div>
          )}
        </>
      )}

      {/* ── Step 3+4: 편집 & 저장 영역 ── */}
      {(step === 'editing' || step === 'saving') && (
        <>
          {/* 제목 입력 */}
          <section>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              매뉴얼 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 오픈 준비 매뉴얼, 포스 사용법..."
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </section>

          {/* 블록 편집기 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">매뉴얼 내용</label>
              <span className="text-xs text-gray-400">{blocks.length}개 블록</span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <BlockEditor
                blocks={blocks}
                onChange={setBlocks}
                uploadedImages={images}
              />
            </div>
          </section>

          {error && <ErrorBanner message={error} />}

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep('upload')
                setGeneratedText('')
                setError(null)
              }}
              disabled={step === 'saving'}
              className="py-3.5 px-5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              다시 생성
            </button>
            <button
              onClick={handleSave}
              disabled={step === 'saving'}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {step === 'saving' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  저장 중...
                </>
              ) : (
                '매뉴얼 저장하기'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function StepBadge({
  number, label, active, done,
}: {
  number: number; label: string; active: boolean; done: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
        done ? 'bg-blue-600 text-white' : active ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-400'
      }`}>
        {done ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : number}
      </div>
      <span className={`text-xs whitespace-nowrap ${active ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
