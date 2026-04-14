'use client'

type ManualViewerProps = {
  content: string
  isStreaming?: boolean
}

export default function ManualViewer({ content, isStreaming = false }: ManualViewerProps) {
  if (!content && !isStreaming) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-gray-700">AI 생성 매뉴얼</span>
        </div>
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600">
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            생성 중...
          </div>
        )}
      </div>

      <div className="p-4 prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
          {content}
          {isStreaming && <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />}
        </pre>
      </div>
    </div>
  )
}
