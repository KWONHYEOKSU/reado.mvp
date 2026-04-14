'use client'

import { useState } from 'react'
import ImageUploader, { UploadedImage } from '@/components/ImageUploader'
import ManualViewer from '@/components/ManualViewer'

type Step = 'upload' | 'generating' | 'done'

export default function NewManualPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [step, setStep] = useState<Step>('upload')
  const [generatedText, setGeneratedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canGenerate = images.length > 0 && step === 'upload'

  async function handleGenerate() {
    if (!canGenerate) return
    setError(null)
    setGeneratedText('')
    setStep('generating')

    try {
      const payload = {
        images: images.map((img) => ({
          base64: img.base64,
          mediaType: img.file.type,
        })),
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '매뉴얼 생성에 실패했습니다.')
      }

      // SSE 스트리밍 파싱
      const reader = res.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            setStep('done')
            return
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              setGeneratedText((prev) => prev + parsed.text)
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== '') {
              throw parseErr
            }
          }
        }
      }

      setStep('done')
    } catch (err) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(msg)
      setStep('upload')
    }
  }

  function handleReset() {
    setStep('upload')
    setGeneratedText('')
    setError(null)
    // 이미지는 유지 (다시 시도 가능하도록)
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">새 매뉴얼 만들기</h1>
        <p className="text-sm text-gray-500 mt-1">
          매장 사진을 업로드하면 AI가 업무 매뉴얼을 자동으로 작성해드려요
        </p>
      </div>

      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-2">
        <StepBadge number={1} label="사진 업로드" active={step === 'upload'} done={step !== 'upload'} />
        <div className="h-px flex-1 bg-gray-200" />
        <StepBadge number={2} label="AI 생성" active={step === 'generating'} done={step === 'done'} />
        <div className="h-px flex-1 bg-gray-200" />
        <StepBadge number={3} label="편집 및 저장" active={false} done={false} disabled />
      </div>

      {/* 이미지 업로더 */}
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* AI 생성 결과 */}
      {(step === 'generating' || step === 'done') && (
        <section>
          <ManualViewer content={generatedText} isStreaming={step === 'generating'} />
        </section>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {step === 'upload' && (
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`
              flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all
              ${canGenerate
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {images.length === 0
              ? '사진을 먼저 선택해주세요'
              : `AI 매뉴얼 생성하기 (${images.length}장)`}
          </button>
        )}

        {step === 'generating' && (
          <div className="flex-1 py-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-3 text-blue-700 text-sm font-medium">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI가 매뉴얼을 작성하고 있어요...
          </div>
        )}

        {step === 'done' && (
          <>
            <button
              onClick={handleReset}
              className="py-3.5 px-5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              다시 생성
            </button>
            <button
              onClick={() => {
                // Step 3, 4에서 구현 예정
                alert('편집 및 저장 기능은 곧 추가됩니다!')
              }}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              편집하고 저장하기 →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function StepBadge({
  number,
  label,
  active,
  done,
  disabled,
}: {
  number: number
  label: string
  active: boolean
  done: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div
        className={`
          w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
          ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : disabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-500'}
        `}
      >
        {done ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={`text-xs whitespace-nowrap ${active ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}
