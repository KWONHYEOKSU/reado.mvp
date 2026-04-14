// Step 4에서 완성 예정 - 매뉴얼 상세/편집 페이지
export default function ManualDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-gray-500 text-sm">매뉴얼 ID: {params.id}</p>
      <p className="text-gray-700 font-medium">상세 보기는 Step 4에서 구현됩니다.</p>
    </div>
  )
}
