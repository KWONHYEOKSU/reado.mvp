import Link from 'next/link'

// Step 4 완성 전까지 목록은 빈 상태로 표시
export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">내 매뉴얼</h1>
        <p className="text-sm text-gray-500 mt-1">저장된 업무 매뉴얼 목록입니다</p>
      </div>

      {/* 빈 상태 */}
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-medium">아직 매뉴얼이 없어요</p>
          <p className="text-gray-400 text-sm mt-1">
            매장 사진을 찍어 AI 매뉴얼을 만들어보세요
          </p>
        </div>
        <Link
          href="/manual/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          첫 매뉴얼 만들기
        </Link>
      </div>
    </div>
  )
}
