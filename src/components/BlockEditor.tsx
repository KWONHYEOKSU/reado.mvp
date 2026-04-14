'use client'

import { useCallback, useRef } from 'react'
import { ManualBlock } from '@/lib/supabase'
import { UploadedImage } from './ImageUploader'
import { useLang } from '@/context/LanguageContext'

type BlockEditorProps = {
  blocks: ManualBlock[]
  onChange: (blocks: ManualBlock[]) => void
  uploadedImages?: UploadedImage[]
}

export default function BlockEditor({ blocks, onChange, uploadedImages = [] }: BlockEditorProps) {
  const { t } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateBlock = useCallback(
    (index: number, content: string) => {
      onChange(blocks.map((b, i) => (i === index ? { ...b, content } : b)))
    },
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

  const addTextBlock = useCallback(() => {
    onChange([...blocks, { type: 'text', content: '' }])
  }, [blocks, onChange])

  const addImageBlockFromUploaded = useCallback(
    (image: UploadedImage) => {
      onChange([...blocks, { type: 'image', content: image.previewUrl }])
    },
    [blocks, onChange]
  )

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        <div key={index} className="group relative flex gap-2 items-start">
          {/* 순서 변경 버튼 */}
          <div className="flex flex-col gap-0.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              type="button"
              onClick={() => moveBlock(index, 'up')}
              disabled={index === 0}
              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => moveBlock(index, 'down')}
              disabled={index === blocks.length - 1}
              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 블록 본체 */}
          <div className="flex-1 min-w-0">
            {block.type === 'text' ? (
              <AutoResizeTextarea
                value={block.content}
                onChange={(val) => updateBlock(index, val)}
                placeholder={t('block.placeholder')}
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.content} alt="" className="w-full max-h-64 object-contain" />
              </div>
            )}
          </div>

          {/* 삭제 버튼 */}
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

      {blocks.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          {t('block.empty')}
        </div>
      )}

      {/* 하단 추가 버튼 */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={addTextBlock}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('block.addText')}
        </button>

        {uploadedImages.length > 0 && (
          <div className="relative group/imgmenu">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('block.addImage')}
            </button>
            <div className="absolute bottom-full left-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-100 p-2 hidden group-hover/imgmenu:flex gap-2 z-10">
              {uploadedImages.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => addImageBlockFromUploaded(img)}
                  className="w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors flex-shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.previewUrl} alt={`${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            onChange([...blocks, { type: 'image', content: url }])
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
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
      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow leading-relaxed"
      style={{ minHeight: '42px' }}
    />
  )
}
