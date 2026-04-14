'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockEditor from '@/components/BlockEditor'
import { Manual, ManualBlock } from '@/lib/supabase'

type Mode = 'loading' | 'view' | 'edit' | 'saving' | 'error'

export default function ManualDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [manual, setManual] = useState<Manual | null>(null)
  const [blocks, setBlocks] = useState<ManualBlock[]>([])
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<Mode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
    if (!title.trim()) {
      setSaveError('제목을 입력해주세요.')
      return
    }
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

  // ── 로딩 ──
  if (mode === 'loading') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="space-y-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${70 + i * 5}%` }} />
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
          목록으로 돌아가기
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
          {isEditing ? '매뉴얼 편집' : manual?.title}
        </h1>
        {!isEditing && (
          <button
            onClick={() => setMode('edit')}
            className="text-sm text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            편집
          </button>
        )}
      </div>

      {/* 편집 모드: 제목 입력 */}
      {isEditing && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">매뉴얼 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      )}

      {/* 뷰 모드: 메타 정보 */}
      {!isEditing && manual && (
        <p className="text-xs text-gray-400 -mt-4">
          {formatDate(manual.updated_at || manual.created_at)} 저장됨
        </p>
      )}

      {/* 블록 내용 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        {isEditing ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">매뉴얼 내용</span>
              <span className="text-xs text-gray-400">{blocks.length}개 블록</span>
            </div>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, i) => (
              <div key={i}>
                {block.type === 'text' ? (
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </p>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={block.content}
                    alt={`이미지 ${i + 1}`}
                    className="w-full rounded-xl object-contain max-h-64"
                  />
                )}
              </div>
            ))}
            {blocks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">내용이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 저장 에러 */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {saveError}
        </div>
      )}

      {/* 편집 모드 버튼 */}
      {isEditing && (
        <div className="flex gap-3">
          <button
            onClick={handleCancelEdit}
            disabled={mode === 'saving'}
            className="py-3.5 px-5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            취소
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
                저장 중...
              </>
            ) : '저장하기'}
          </button>
        </div>
      )}

      {/* 뷰 모드 삭제 버튼 */}
      {!isEditing && (
        <div className="pt-4 border-t border-gray-100">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              이 매뉴얼 삭제
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">정말 삭제하시겠어요?</span>
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 font-medium hover:underline"
              >
                삭제
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm text-gray-400 hover:underline"
              >
                취소
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
