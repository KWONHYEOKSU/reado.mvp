export type Lang = 'ko' | 'en' | 'ja' | 'zh'

export const LANGS: Array<{ code: Lang; native: string; flag: string }> = [
  { code: 'ko', native: '한국어', flag: '🇰🇷' },
  { code: 'en', native: 'English', flag: '🇺🇸' },
  { code: 'ja', native: '日本語', flag: '🇯🇵' },
  { code: 'zh', native: '中文', flag: '🇨🇳' },
]

export const LANG_FULL_NAMES: Record<Lang, string> = {
  ko: 'Korean',
  en: 'English',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
}

type Strings = Record<string, string>

const ko: Strings = {
  'app.tagline': '매장 매뉴얼',
  'header.newManual': '+ 새 매뉴얼',

  'home.title': '내 매뉴얼',
  'home.subtitle': '저장된 업무 매뉴얼 목록입니다',
  'home.empty.title': '아직 매뉴얼이 없어요',
  'home.empty.subtitle': '매장 사진을 찍어 AI 매뉴얼을 만들어보세요',
  'home.empty.cta': '첫 매뉴얼 만들기',
  'home.error.supabase': 'Supabase 연결이 필요합니다. .env.local에 환경변수를 설정해주세요.',
  'home.savedAt': '저장됨',

  'new.title': '새 매뉴얼 만들기',
  'new.subtitle': '매장 사진을 업로드하면 AI가 업무 매뉴얼을 자동으로 작성해드려요',
  'new.step1': '사진 업로드',
  'new.step2': 'AI 생성',
  'new.step3': '편집 및 저장',
  'new.upload.title': '📸 매장 사진 선택',
  'new.upload.hint': '(최대 5장)',
  'new.btn.empty': '사진을 먼저 선택해주세요',
  'new.btn.generate': 'AI 매뉴얼 생성하기 ({count}장)',
  'new.btn.generating': 'AI가 매뉴얼을 작성하고 있어요...',
  'new.edit.titleLabel': '매뉴얼 제목',
  'new.edit.titlePlaceholder': '예: 오픈 준비 매뉴얼, 포스 사용법...',
  'new.edit.contentLabel': '매뉴얼 내용',
  'new.edit.blockCount': '{count}개 블록',
  'new.btn.regenerate': '다시 생성',
  'new.btn.save': '매뉴얼 저장하기',
  'new.btn.saving': '저장 중...',

  'detail.editMode': '매뉴얼 편집',
  'detail.btn.edit': '편집',
  'detail.btn.save': '저장하기',
  'detail.btn.saving': '저장 중...',
  'detail.btn.cancel': '취소',
  'detail.btn.delete': '이 매뉴얼 삭제',
  'detail.deleteConfirm': '정말 삭제하시겠어요?',
  'detail.deleteBtn': '삭제',
  'detail.cancelDelete': '취소',
  'detail.titleLabel': '매뉴얼 제목',
  'detail.titlePlaceholder': '제목을 입력하세요',
  'detail.contentLabel': '매뉴얼 내용',
  'detail.blockCount': '{count}개 블록',
  'detail.noContent': '내용이 없습니다.',
  'detail.savedAt': '{time} 저장됨',

  'translate.btn': '🌐 번역',
  'translate.title': '매뉴얼 번역',
  'translate.selectLang': '번역할 언어를 선택하세요',
  'translate.start': '번역 시작',
  'translate.translating': '번역 중...',
  'translate.result': '번역 결과',
  'translate.badge': '번역됨',
  'translate.saveAs': '번역본으로 저장',
  'translate.close': '닫기',
  'translate.error': '번역에 실패했습니다.',
  'translate.noBlocks': '번역할 텍스트가 없습니다.',

  'upload.drag': '사진을 여기에 끌어다 놓거나',
  'upload.click': '클릭하여 선택하세요',
  'upload.hint': 'JPG, PNG, WEBP · 최대 {size}MB · 최대 {max}장',
  'upload.error.type': 'JPG, PNG, WEBP 형식만 지원합니다.',
  'upload.error.size': '각 파일은 {size}MB 이하여야 합니다.',
  'upload.error.max': '최대 {max}장까지 업로드할 수 있습니다.',
  'upload.add': '추가',
  'upload.count': '{count} / {max}장 선택됨',

  'block.addText': '텍스트 추가',
  'block.addImage': '이미지 추가',
  'block.empty': '블록을 추가해 매뉴얼을 작성하세요',
  'block.placeholder': '내용을 입력하세요...',

  'viewer.title': 'AI 생성 매뉴얼',
  'viewer.generating': '생성 중...',

  'error.back': '목록으로 돌아가기',

  'time.justNow': '방금 전',
  'time.minutesAgo': '{n}분 전',
  'time.hoursAgo': '{n}시간 전',
  'time.daysAgo': '{n}일 전',

  'lang.ko': '한국어',
  'lang.en': 'English',
  'lang.ja': '日本語',
  'lang.zh': '中文',
}

const en: Strings = {
  'app.tagline': 'Store Manual',
  'header.newManual': '+ New Manual',

  'home.title': 'My Manuals',
  'home.subtitle': 'List of your saved work manuals',
  'home.empty.title': 'No manuals yet',
  'home.empty.subtitle': 'Upload store photos to create an AI-powered manual',
  'home.empty.cta': 'Create First Manual',
  'home.error.supabase': 'Supabase connection required. Please set environment variables in .env.local.',
  'home.savedAt': 'saved',

  'new.title': 'Create New Manual',
  'new.subtitle': 'Upload store photos and AI will automatically write a work manual for you',
  'new.step1': 'Upload Photos',
  'new.step2': 'AI Generate',
  'new.step3': 'Edit & Save',
  'new.upload.title': '📸 Select Store Photos',
  'new.upload.hint': '(up to 5 photos)',
  'new.btn.empty': 'Please select photos first',
  'new.btn.generate': 'Generate AI Manual ({count} photos)',
  'new.btn.generating': 'AI is writing the manual...',
  'new.edit.titleLabel': 'Manual Title',
  'new.edit.titlePlaceholder': 'e.g. Opening Checklist, POS Guide...',
  'new.edit.contentLabel': 'Manual Content',
  'new.edit.blockCount': '{count} blocks',
  'new.btn.regenerate': 'Regenerate',
  'new.btn.save': 'Save Manual',
  'new.btn.saving': 'Saving...',

  'detail.editMode': 'Edit Manual',
  'detail.btn.edit': 'Edit',
  'detail.btn.save': 'Save',
  'detail.btn.saving': 'Saving...',
  'detail.btn.cancel': 'Cancel',
  'detail.btn.delete': 'Delete this manual',
  'detail.deleteConfirm': 'Are you sure you want to delete?',
  'detail.deleteBtn': 'Delete',
  'detail.cancelDelete': 'Cancel',
  'detail.titleLabel': 'Manual Title',
  'detail.titlePlaceholder': 'Enter title',
  'detail.contentLabel': 'Manual Content',
  'detail.blockCount': '{count} blocks',
  'detail.noContent': 'No content.',
  'detail.savedAt': 'Saved {time}',

  'translate.btn': '🌐 Translate',
  'translate.title': 'Translate Manual',
  'translate.selectLang': 'Select target language',
  'translate.start': 'Start Translation',
  'translate.translating': 'Translating...',
  'translate.result': 'Translation Result',
  'translate.badge': 'Translated',
  'translate.saveAs': 'Save as Translation',
  'translate.close': 'Close',
  'translate.error': 'Translation failed.',
  'translate.noBlocks': 'No text blocks to translate.',

  'upload.drag': 'Drag & drop photos here or',
  'upload.click': 'click to select',
  'upload.hint': 'JPG, PNG, WEBP · Max {size}MB · Up to {max} photos',
  'upload.error.type': 'Only JPG, PNG, WEBP formats are supported.',
  'upload.error.size': 'Each file must be under {size}MB.',
  'upload.error.max': 'You can upload up to {max} photos.',
  'upload.add': 'Add',
  'upload.count': '{count} / {max} selected',

  'block.addText': 'Add Text',
  'block.addImage': 'Add Image',
  'block.empty': 'Add blocks to write your manual',
  'block.placeholder': 'Enter content...',

  'viewer.title': 'AI Generated Manual',
  'viewer.generating': 'Generating...',

  'error.back': 'Back to list',

  'time.justNow': 'Just now',
  'time.minutesAgo': '{n}m ago',
  'time.hoursAgo': '{n}h ago',
  'time.daysAgo': '{n}d ago',

  'lang.ko': '한국어',
  'lang.en': 'English',
  'lang.ja': '日本語',
  'lang.zh': '中文',
}

const ja: Strings = {
  'app.tagline': '店舗マニュアル',
  'header.newManual': '+ 新規マニュアル',

  'home.title': 'マニュアル一覧',
  'home.subtitle': '保存済みの業務マニュアル一覧',
  'home.empty.title': 'マニュアルがありません',
  'home.empty.subtitle': '店舗の写真をアップロードしてAIマニュアルを作成しましょう',
  'home.empty.cta': '最初のマニュアルを作成',
  'home.error.supabase': 'Supabase接続が必要です。.env.localに環境変数を設定してください。',
  'home.savedAt': '保存',

  'new.title': '新規マニュアル作成',
  'new.subtitle': '店舗の写真をアップロードすると、AIが業務マニュアルを自動作成します',
  'new.step1': '写真アップロード',
  'new.step2': 'AI生成',
  'new.step3': '編集・保存',
  'new.upload.title': '📸 店舗写真を選択',
  'new.upload.hint': '（最大5枚）',
  'new.btn.empty': '先に写真を選択してください',
  'new.btn.generate': 'AIマニュアル生成（{count}枚）',
  'new.btn.generating': 'AIがマニュアルを作成中...',
  'new.edit.titleLabel': 'マニュアルタイトル',
  'new.edit.titlePlaceholder': '例：オープン準備、POS操作手順...',
  'new.edit.contentLabel': 'マニュアル内容',
  'new.edit.blockCount': '{count}ブロック',
  'new.btn.regenerate': '再生成',
  'new.btn.save': 'マニュアルを保存',
  'new.btn.saving': '保存中...',

  'detail.editMode': 'マニュアル編集',
  'detail.btn.edit': '編集',
  'detail.btn.save': '保存',
  'detail.btn.saving': '保存中...',
  'detail.btn.cancel': 'キャンセル',
  'detail.btn.delete': 'このマニュアルを削除',
  'detail.deleteConfirm': '本当に削除しますか？',
  'detail.deleteBtn': '削除',
  'detail.cancelDelete': 'キャンセル',
  'detail.titleLabel': 'マニュアルタイトル',
  'detail.titlePlaceholder': 'タイトルを入力してください',
  'detail.contentLabel': 'マニュアル内容',
  'detail.blockCount': '{count}ブロック',
  'detail.noContent': '内容がありません。',
  'detail.savedAt': '{time}に保存',

  'translate.btn': '🌐 翻訳',
  'translate.title': 'マニュアル翻訳',
  'translate.selectLang': '翻訳先の言語を選択してください',
  'translate.start': '翻訳開始',
  'translate.translating': '翻訳中...',
  'translate.result': '翻訳結果',
  'translate.badge': '翻訳済み',
  'translate.saveAs': '翻訳版として保存',
  'translate.close': '閉じる',
  'translate.error': '翻訳に失敗しました。',
  'translate.noBlocks': '翻訳するテキストがありません。',

  'upload.drag': '写真をここにドラッグするか',
  'upload.click': 'クリックして選択',
  'upload.hint': 'JPG, PNG, WEBP · 最大{size}MB · 最大{max}枚',
  'upload.error.type': 'JPG、PNG、WEBP形式のみサポートしています。',
  'upload.error.size': '各ファイルは{size}MB以下にしてください。',
  'upload.error.max': '最大{max}枚までアップロードできます。',
  'upload.add': '追加',
  'upload.count': '{count} / {max}枚選択中',

  'block.addText': 'テキスト追加',
  'block.addImage': '画像追加',
  'block.empty': 'ブロックを追加してマニュアルを作成してください',
  'block.placeholder': '内容を入力してください...',

  'viewer.title': 'AI生成マニュアル',
  'viewer.generating': '生成中...',

  'error.back': '一覧に戻る',

  'time.justNow': 'たった今',
  'time.minutesAgo': '{n}分前',
  'time.hoursAgo': '{n}時間前',
  'time.daysAgo': '{n}日前',

  'lang.ko': '한국어',
  'lang.en': 'English',
  'lang.ja': '日本語',
  'lang.zh': '中文',
}

const zh: Strings = {
  'app.tagline': '门店手册',
  'header.newManual': '+ 新建手册',

  'home.title': '我的手册',
  'home.subtitle': '已保存的工作手册列表',
  'home.empty.title': '还没有手册',
  'home.empty.subtitle': '上传门店照片，用AI创建工作手册',
  'home.empty.cta': '创建第一个手册',
  'home.error.supabase': '需要连接Supabase。请在.env.local中设置环境变量。',
  'home.savedAt': '保存',

  'new.title': '新建手册',
  'new.subtitle': '上传门店照片，AI将自动为您编写工作手册',
  'new.step1': '上传照片',
  'new.step2': 'AI生成',
  'new.step3': '编辑保存',
  'new.upload.title': '📸 选择门店照片',
  'new.upload.hint': '（最多5张）',
  'new.btn.empty': '请先选择照片',
  'new.btn.generate': 'AI生成手册（{count}张）',
  'new.btn.generating': 'AI正在编写手册...',
  'new.edit.titleLabel': '手册标题',
  'new.edit.titlePlaceholder': '例如：开店准备手册、收银机使用方法...',
  'new.edit.contentLabel': '手册内容',
  'new.edit.blockCount': '{count}个模块',
  'new.btn.regenerate': '重新生成',
  'new.btn.save': '保存手册',
  'new.btn.saving': '保存中...',

  'detail.editMode': '编辑手册',
  'detail.btn.edit': '编辑',
  'detail.btn.save': '保存',
  'detail.btn.saving': '保存中...',
  'detail.btn.cancel': '取消',
  'detail.btn.delete': '删除此手册',
  'detail.deleteConfirm': '确定要删除吗？',
  'detail.deleteBtn': '删除',
  'detail.cancelDelete': '取消',
  'detail.titleLabel': '手册标题',
  'detail.titlePlaceholder': '请输入标题',
  'detail.contentLabel': '手册内容',
  'detail.blockCount': '{count}个模块',
  'detail.noContent': '暂无内容。',
  'detail.savedAt': '{time}保存',

  'translate.btn': '🌐 翻译',
  'translate.title': '手册翻译',
  'translate.selectLang': '请选择目标语言',
  'translate.start': '开始翻译',
  'translate.translating': '翻译中...',
  'translate.result': '翻译结果',
  'translate.badge': '已翻译',
  'translate.saveAs': '保存为翻译版本',
  'translate.close': '关闭',
  'translate.error': '翻译失败。',
  'translate.noBlocks': '没有可翻译的文字。',

  'upload.drag': '将照片拖到这里，或',
  'upload.click': '点击选择',
  'upload.hint': 'JPG, PNG, WEBP · 最大{size}MB · 最多{max}张',
  'upload.error.type': '仅支持JPG、PNG、WEBP格式。',
  'upload.error.size': '每个文件不超过{size}MB。',
  'upload.error.max': '最多可上传{max}张照片。',
  'upload.add': '添加',
  'upload.count': '已选{count}/{max}张',

  'block.addText': '添加文字',
  'block.addImage': '添加图片',
  'block.empty': '添加模块开始编写手册',
  'block.placeholder': '请输入内容...',

  'viewer.title': 'AI生成手册',
  'viewer.generating': '生成中...',

  'error.back': '返回列表',

  'time.justNow': '刚刚',
  'time.minutesAgo': '{n}分钟前',
  'time.hoursAgo': '{n}小时前',
  'time.daysAgo': '{n}天前',

  'lang.ko': '한국어',
  'lang.en': 'English',
  'lang.ja': '日本語',
  'lang.zh': '中文',
}

export const translations: Record<Lang, Strings> = { ko, en, ja, zh }

/** 키 기반 번역. {변수} 치환 지원. */
export function t(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>
): string {
  let str = translations[lang]?.[key] ?? translations['ko']?.[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replaceAll(`{${k}}`, String(v))
    }
  }
  return str
}

/** 상대 시간 포맷 */
export function formatRelativeTime(iso: string, lang: Lang): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return t(lang, 'time.justNow')
  if (diffMin < 60) return t(lang, 'time.minutesAgo', { n: diffMin })
  if (diffHour < 24) return t(lang, 'time.hoursAgo', { n: diffHour })
  if (diffDay < 7) return t(lang, 'time.daysAgo', { n: diffDay })

  const locale =
    lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US'
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

/** generate API용 시스템 프롬프트 */
export const GENERATE_SYSTEM_PROMPTS: Record<Lang, string> = {
  ko: `당신은 소규모 자영업장의 업무 매뉴얼 작성 전문가입니다.
업로드된 매장 사진을 분석하여, 신규 아르바이트생이 이해하기 쉬운
단계별 업무 매뉴얼을 한국어로 작성해주세요.

출력 형식:
- 매뉴얼 제목
- 업무 단계 (번호 목록, 각 단계마다 구체적인 행동 지침)
- 주의사항 (있는 경우)

간결하고 명확하게 작성하세요.`,

  en: `You are an expert in writing work manuals for small businesses.
Analyze the uploaded store photos and write a clear, step-by-step work manual in English
that new part-time employees can easily understand.

Output format:
- Manual title
- Work steps (numbered list, with specific action instructions for each step)
- Notes/warnings (if any)

Keep it concise and clear.`,

  ja: `あなたは小規模事業所の業務マニュアル作成の専門家です。
アップロードされた店舗写真を分析して、新しいアルバイト従業員が
理解しやすい日本語のステップ別業務マニュアルを作成してください。

出力形式：
- マニュアルタイトル
- 業務ステップ（番号付きリスト、各ステップに具体的な行動指針）
- 注意事項（ある場合）

簡潔かつ明確に記述してください。`,

  zh: `您是小型自营业务工作手册编写专家。
请分析上传的门店照片，用中文编写一份新员工易于理解的分步骤工作手册。

输出格式：
- 手册标题
- 工作步骤（编号列表，每个步骤有具体操作指南）
- 注意事项（如有）

请简洁清晰地编写。`,
}
