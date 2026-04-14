'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Manual, ManualBlock } from '@/lib/supabase'
import { useLang } from '@/context/LanguageContext'
import { formatRelativeTime } from '@/lib/i18n'

type Mode = 'loading' | 'view' | 'error'

export default function ManualDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t, lang } = useLang()
  const tocRef = useRef<HTMLDivElement>(null)

  const [manual, setManual] = useState<Manual | null>(null)
  const [mode, setMode] = useState<Mode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)

  useEffect(() => {
    fetch(`/api/manuals/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || '매뉴얼을 불러오지 못했습니다.')
        return res.json() as Promise<Manual>
      })
      .then((data) => { setManual(data); setMode('view') })
      .catch((err) => { setError(err.message); setMode('error') })
  }, [params.id])

  async function handleDelete() {
    try {
      const res = await fetch(`/api/manuals/${params.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제에 실패했습니다.')
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 실패')
      setShowDeleteConfirm(false)
    }
  }

  // 섹션별 블록 그룹화
  function groupBySections(blocks: ManualBlock[]): Array<{ title: string; blocks: ManualBlock[] }> {
    const sections: Array<{ title: string; blocks: ManualBlock[] }> = []
    let currentTitle = ''
    let currentBlocks: ManualBlock[] = []

    for (const block of blocks) {
      if (block.section_title && block.section_title !== currentTitle) {
        if (currentBlocks.length > 0 || currentTitle) {
          sections.push({ title: currentTitle, blocks: currentBlocks })
        }
        currentTitle = block.section_title
        currentBlocks = [block]
      } else {
        currentBlocks.push(block)
      }
    }
    if (currentBlocks.length > 0 || currentTitle) {
      sections.push({ title: currentTitle, blocks: currentBlocks })
    }
    return sections
  }

  // ── 로딩 ──
  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#1E3A5F] h-36 animate-pulse" />
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${70 + i * 8}%` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── 에러 ──
  if (mode === 'error') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#DC2626] text-sm">{error}</p>
          <button onClick={() => router.push('/')} className="text-[#2563EB] text-sm underline">
            {t('error.back')}
          </button>
        </div>
      </div>
    )
  }

  const sections = groupBySections(manual!.blocks)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── 히어로 헤더 ── */}
      <div className="bg-[#1E3A5F] px-4 pt-6 pb-0">
        <div className="max-w-2xl mx-auto">
          {/* 뒤로 + 액션 버튼 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('nav.manuals')}
            </button>
            <div className="flex items-center gap-2">
              <Link
                href={`/manual/${params.id}/quiz/generate`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {t('detail.genQuiz')}
              </Link>
              <Link
                href={`/manual/${params.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('detail.btn.edit')}
              </Link>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-white leading-tight">{manual!.title}</h1>
          <p className="text-blue-200 text-xs mt-1.5 pb-4">
            {t('detail.savedAt', {
              time: formatRelativeTime(manual!.updated_at || manual!.created_at, lang),
            })}
          </p>

          {/* ToC 탭 바 */}
          {sections.length > 0 && (
            <div
              ref={tocRef}
              className="flex gap-1 overflow-x-auto scrollbar-none pb-0 -mx-4 px-4"
            >
              {sections.map((sec, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSectionIdx(i)
                    const el = document.getElementById(`section-${i}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeSectionIdx === i
                      ? 'border-white text-white'
                      : 'border-transparent text-blue-200 hover:text-white'
                  }`}
                >
                  {sec.title || `${t('detail.section')} ${i + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {sections.map((sec, sIdx) => (
          <section key={sIdx} id={`section-${sIdx}`} className="scroll-mt-4">
            {/* 섹션 헤더 */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {sIdx + 1}
              </span>
              <h2 className="text-base font-bold text-[#1E3A5F]">
                {sec.title || `${t('detail.section')} ${sIdx + 1}`}
              </h2>
            </div>

            {/* 블록들 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              {sec.blocks.map((block, bIdx) => (
                <MediaBlock key={bIdx} block={block} />
              ))}
            </div>
          </section>
        ))}

        {manual!.blocks.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
            {t('detail.noContent')}
          </div>
        )}

        {/* ── 삭제 영역 ── */}
        <div className="pt-4 border-t border-gray-200">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-gray-400 hover:text-[#DC2626] transition-colors"
            >
              {t('detail.btn.delete')}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{t('detail.deleteConfirm')}</span>
              <button onClick={handleDelete} className="text-sm text-[#DC2626] font-medium hover:underline">
                {t('detail.deleteBtn')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm text-gray-400 hover:underline"
              >
                {t('detail.cancelDelete')}
              </button>
            </div>
          )}
          {error && <p className="text-xs text-[#DC2626] mt-2">{error}</p>}
        </div>
      </div>
    </div>
  )
}

// ── 미디어 블록 렌더러 ──
function MediaBlock({ block }: { block: ManualBlock }) {
  if (block.type === 'text') {
    return (
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {block.content}
      </p>
    )
  }
  if (block.type === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={block.content} alt="" className="w-full rounded-xl object-contain max-h-72" />
    )
  }
  if (block.type === 'video') {
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <video controls preload="metadata" playsInline className="w-full max-h-72">
          <source src={block.content} />
        </video>
      </div>
    )
  }
  return null
}
