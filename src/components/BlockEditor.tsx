'use client'

import { useCallback, useRef, useState } from 'react'
import { ManualBlock } from '@/lib/supabase'
import { UploadedImage } from './ImageUploader'
import { useLang } from '@/context/LanguageContext'

type BlockEditorProps = {
  blocks: ManualBlock[]
  onChange: (blocks: ManualBlock[]) => void
  uploadedImages?: UploadedImage[]
}

type UploadingState = {
  type: 'image' | 'video'
  name: string
  progress: 'uploading' | 'done' | 'error'
  tempUrl: string
}

const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.gif'
const VIDEO_ACCEPT = '.mp4,.mov,.webm,.ogg'

export default function BlockEditor({ blocks, onChange, uploadedImages = [] }: BlockEditorProps) {
  const { t } = useLang()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<UploadingState | null>(null)
  const [uploadWarning, setUploadWarning] = useState<string | null>(null)

  // ── 블록 조작 헬퍼 ──
  const updateBlock = useCallback(
    (index: number, content: string) =>
      onChange(blocks.map((b, i) => (i === index ? { ...b, content } : b))),
    [blocks, onChange]
  )

  const deleteBlock = useCallback(
    (index: number) => onChange(blocks.filter((_, i) => i !== index)),
    [blocks, onChange]
  )

  const moveBlock = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const next = [...blocks]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return
      ;[next[index], next[target]] = [next[target], next[index]]
      onChange(next)
    },
    [blocks, onChange]
  )

  // ── 미디어 업로드 ──
  const handleMediaFile = useCallback(
    async (file: File) => {
      const isVideo = file.type.startsWith('video/')
      const blockType: ManualBlock['type'] = isVideo ? 'video' : 'image'
      const tempUrl = URL.createObjectURL(file)

      setUploadWarning(null)
      setUploading({ type: blockType, name: file.name, progress: 'uploading', tempUrl })

      try {
        const form = new FormData()
        form.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: form })
        const data = await res.json()

        if (!res.ok) {
          // Supabase 미설정이면 blob URL로 폴백
          if (data.code === 'supabase_not_configured') {
            setUploadWarning(t('block.noSupabase'))
            onChange([...blocks, { type: blockType, content: tempUrl }])
          } else {
            setUploadWarning(`${t('block.uploadFailed')}: ${data.error}`)
            onChange([...blocks, { type: blockType, content: tempUrl }])
          }
        } else {
          URL.revokeObjectURL(tempUrl)
          onChange([...blocks, { type: blockType, content: data.url }])
        }
      } catch {
        setUploadWarning(t('block.uploadFailed'))
        onChange([...blocks, { type: blockType, content: tempUrl }])
      } finally {
        setUploading(null)
      }
    },
    [blocks, onChange, t]
  )

  const handleImageInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleMediaFile(file)
      e.target.value = ''
    },
    [handleMediaFile]
  )

  const handleVideoInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleMediaFile(file)
      e.target.value = ''
    },
    [handleMediaFile]
  )

  const addImageFromUploaded = useCallback(
    (img: UploadedImage) => {
      onChange([...blocks, { type: 'image', content: img.previewUrl }])
    },
    [blocks, onChange]
  )

  const isUploading = uploading !== null

  return (
    <div className="space-y-2">
      {/* 숨겨진 파일 입력 */}
      <input ref={imageInputRef} type="file" className="hidden" accept={IMAGE_ACCEPT} onChange={handleImageInput} />
      <input ref={videoInputRef} type="file" className="hidden" accept={VIDEO_ACCEPT} onChange={handleVideoInput} />

      {/* 블록 목록 */}
      {blocks.map((block, index) => (
        <div key={index} className="group relative flex gap-2 items-start">
          {/* 순서 변경 */}
          <div className="flex flex-col gap-0.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              type="button"
              onClick={() => moveBlock(index, 'up')}
              disabled={index === 0}
              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => moveBlock(index, 'down')}
              disabled={index === blocks.length - 1}
              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 블록 본체 */}
          <div className="flex-1 min-w-0">
            {block.type === 'text' && (
              <AutoResizeTextarea
                value={block.content}
                onChange={(val) => updateBlock(index, val)}
                placeholder={t('block.placeholder')}
              />
            )}
            {block.type === 'image' && (
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.content} alt="" className="w-full max-h-72 object-contain" />
              </div>
            )}
            {block.type === 'video' && (
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  controls
                  preload="metadata"
                  className="w-full max-h-72"
                  playsInline
                >
                  <source src={block.content} />
                </video>
              </div>
            )}
          </div>

          {/* 삭제 */}
          <button
            type="button"
            onClick={() => deleteBlock(index)}
            className="mt-2 w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* 빈 상태 */}
      {blocks.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          {t('block.empty')}
        </div>
      )}

      {/* 업로드 진행 중 표시 */}
      {uploading && (
        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="truncate">
            {t('block.uploading')} <span className="font-medium">{uploading.name}</span>
          </span>
        </div>
      )}

      {/* 업로드 경고 (Supabase 미설정 등) */}
      {uploadWarning && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{uploadWarning}</span>
        </div>
      )}

      {/* 하단 추가 버튼 */}
      <div className="flex flex-wrap gap-2 pt-2">
        {/* 텍스트 추가 */}
        <AddButton
          icon={<TextIcon />}
          label={t('block.addText')}
          onClick={() => onChange([...blocks, { type: 'text', content: '' }])}
          disabled={isUploading}
        />

        {/* 이미지 추가 */}
        <div className="relative group/imgmenu">
          <AddButton
            icon={<ImageIcon />}
            label={t('block.addImage')}
            hint={t('block.imageHint')}
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
          />
          {/* AI 업로드 이미지 퀵 픽커 */}
          {uploadedImages.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-100 p-2 hidden group-hover/imgmenu:flex gap-2 z-10">
              {uploadedImages.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => addImageFromUploaded(img)}
                  className="w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors flex-shrink-0"
                  title={`이미지 ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 영상 추가 */}
        <AddButton
          icon={<VideoIcon />}
          label={t('block.addVideo')}
          hint={t('block.videoHint')}
          onClick={() => videoInputRef.current?.click()}
          disabled={isUploading}
        />
      </div>
    </div>
  )
}

// ── 서브 컴포넌트 ──

function AddButton({
  icon, label, hint, onClick, disabled,
}: {
  icon: React.ReactNode
  label: string
  hint?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  )
}

function AutoResizeTextarea({
  value, onChange, placeholder,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={1}
      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
      style={{ minHeight: '42px' }}
    />
  )
}

function TextIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}
