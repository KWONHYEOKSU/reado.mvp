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
  'block.addVideo': '영상 추가',
  'block.empty': '블록을 추가해 매뉴얼을 작성하세요',
  'block.placeholder': '내용을 입력하세요...',
  'block.uploading': '업로드 중...',
  'block.uploadFailed': '업로드 실패 — 임시 저장됨',
  'block.noSupabase': 'Supabase Storage 미설정으로 임시 저장됩니다. 새로고침 시 사라질 수 있습니다.',
  'block.imageHint': 'JPG, PNG, WEBP, GIF · 최대 10MB',
  'block.videoHint': 'MP4, MOV, WebM · 최대 100MB',

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

  'nav.manuals': '매뉴얼 목록',
  'nav.new': '매뉴얼 등록',
  'nav.quiz': '테스트',
  'nav.dashboard': '테스트 결과',

  'detail.genQuiz': '테스트 생성',
  'detail.toc': '목차',
  'detail.section': '섹션',

  'quiz.gen.title': '테스트 생성',
  'quiz.gen.subtitle': '매뉴얼 내용을 바탕으로 AI가 테스트를 생성합니다',
  'quiz.gen.count5': '5문제',
  'quiz.gen.count10': '10문제',
  'quiz.gen.countLabel': '문항 수 선택',
  'quiz.gen.generate': 'AI로 테스트 생성',
  'quiz.gen.generating': 'AI가 문제를 생성하고 있어요...',
  'quiz.gen.save': '테스트 저장하기',
  'quiz.gen.saving': '저장 중...',
  'quiz.gen.back': '매뉴얼로 돌아가기',
  'quiz.gen.question': '문제 {n}',
  'quiz.gen.optionLabel': '선택지',
  'quiz.gen.answerLabel': '정답',
  'quiz.gen.explanationLabel': '해설',
  'quiz.gen.deleteQ': '문제 삭제',
  'quiz.gen.noManual': '매뉴얼을 불러올 수 없습니다.',
  'quiz.gen.savedOk': '테스트가 저장되었습니다.',

  'quiz.list.title': '테스트 목록',
  'quiz.list.empty': '아직 생성된 테스트가 없습니다.',
  'quiz.list.questions': '{n}문제',
  'quiz.list.take': '테스트 응시',
  'quiz.list.results': '결과 보기',

  'quiz.take.title': '테스트',
  'quiz.take.nameLabel': '이름을 입력하세요',
  'quiz.take.namePlaceholder': '예: 홍길동',
  'quiz.take.start': '테스트 시작',
  'quiz.take.submit': '제출하기',
  'quiz.take.submitting': '채점 중...',
  'quiz.take.result': '결과',
  'quiz.take.score': '{score}점',
  'quiz.take.passed': '합격',
  'quiz.take.failed': '불합격',
  'quiz.take.passLine': '합격 기준: 60점 이상',
  'quiz.take.correct': '정답',
  'quiz.take.wrong': '오답',
  'quiz.take.yourAnswer': '내 답변',
  'quiz.take.correctAnswer': '정답',
  'quiz.take.explanation': '해설',
  'quiz.take.retry': '다시 풀기',
  'quiz.take.backToList': '목록으로',
  'quiz.take.of': '{current} / {total}',
  'quiz.take.noQuiz': '테스트를 불러올 수 없습니다.',

  'dashboard.title': '테스트 결과',
  'dashboard.subtitle': '전체 테스트 결과를 확인하세요',
  'dashboard.empty': '아직 제출된 결과가 없습니다.',
  'dashboard.totalResults': '총 {n}건',
  'dashboard.passRate': '합격률',
  'dashboard.avgScore': '평균 점수',
  'dashboard.col.name': '응시자',
  'dashboard.col.quiz': '테스트',
  'dashboard.col.score': '점수',
  'dashboard.col.passed': '합격여부',
  'dashboard.col.date': '날짜',
  'dashboard.passed': '합격',
  'dashboard.failed': '불합격',
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
  'block.addVideo': 'Add Video',
  'block.empty': 'Add blocks to write your manual',
  'block.placeholder': 'Enter content...',
  'block.uploading': 'Uploading...',
  'block.uploadFailed': 'Upload failed — saved temporarily',
  'block.noSupabase': 'Supabase Storage not configured. Media may be lost on refresh.',
  'block.imageHint': 'JPG, PNG, WEBP, GIF · Max 10MB',
  'block.videoHint': 'MP4, MOV, WebM · Max 100MB',

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

  'nav.manuals': 'Manuals',
  'nav.new': 'New Manual',
  'nav.quiz': 'Tests',
  'nav.dashboard': 'Results',

  'detail.genQuiz': 'Create Test',
  'detail.toc': 'Contents',
  'detail.section': 'Section',

  'quiz.gen.title': 'Create Test',
  'quiz.gen.subtitle': 'AI generates test questions from manual content',
  'quiz.gen.count5': '5 Questions',
  'quiz.gen.count10': '10 Questions',
  'quiz.gen.countLabel': 'Select question count',
  'quiz.gen.generate': 'Generate with AI',
  'quiz.gen.generating': 'AI is generating questions...',
  'quiz.gen.save': 'Save Test',
  'quiz.gen.saving': 'Saving...',
  'quiz.gen.back': 'Back to manual',
  'quiz.gen.question': 'Question {n}',
  'quiz.gen.optionLabel': 'Option',
  'quiz.gen.answerLabel': 'Answer',
  'quiz.gen.explanationLabel': 'Explanation',
  'quiz.gen.deleteQ': 'Delete question',
  'quiz.gen.noManual': 'Could not load manual.',
  'quiz.gen.savedOk': 'Test saved successfully.',

  'quiz.list.title': 'Test List',
  'quiz.list.empty': 'No tests created yet.',
  'quiz.list.questions': '{n} questions',
  'quiz.list.take': 'Take Test',
  'quiz.list.results': 'View Results',

  'quiz.take.title': 'Test',
  'quiz.take.nameLabel': 'Enter your name',
  'quiz.take.namePlaceholder': 'e.g. John Doe',
  'quiz.take.start': 'Start Test',
  'quiz.take.submit': 'Submit',
  'quiz.take.submitting': 'Grading...',
  'quiz.take.result': 'Result',
  'quiz.take.score': '{score} pts',
  'quiz.take.passed': 'Passed',
  'quiz.take.failed': 'Failed',
  'quiz.take.passLine': 'Pass score: 60 or above',
  'quiz.take.correct': 'Correct',
  'quiz.take.wrong': 'Wrong',
  'quiz.take.yourAnswer': 'Your answer',
  'quiz.take.correctAnswer': 'Correct answer',
  'quiz.take.explanation': 'Explanation',
  'quiz.take.retry': 'Try Again',
  'quiz.take.backToList': 'Back to list',
  'quiz.take.of': '{current} / {total}',
  'quiz.take.noQuiz': 'Could not load test.',

  'dashboard.title': 'Test Results',
  'dashboard.subtitle': 'View all test results',
  'dashboard.empty': 'No results yet.',
  'dashboard.totalResults': '{n} total',
  'dashboard.passRate': 'Pass Rate',
  'dashboard.avgScore': 'Avg Score',
  'dashboard.col.name': 'Name',
  'dashboard.col.quiz': 'Test',
  'dashboard.col.score': 'Score',
  'dashboard.col.passed': 'Result',
  'dashboard.col.date': 'Date',
  'dashboard.passed': 'Passed',
  'dashboard.failed': 'Failed',
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
  'block.addVideo': '動画追加',
  'block.empty': 'ブロックを追加してマニュアルを作成してください',
  'block.placeholder': '内容を入力してください...',
  'block.uploading': 'アップロード中...',
  'block.uploadFailed': 'アップロード失敗 — 一時保存',
  'block.noSupabase': 'Supabase Storage未設定のため一時保存です。再読み込みで消える場合があります。',
  'block.imageHint': 'JPG, PNG, WEBP, GIF · 最大10MB',
  'block.videoHint': 'MP4, MOV, WebM · 最大100MB',

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

  'nav.manuals': 'マニュアル一覧',
  'nav.new': 'マニュアル登録',
  'nav.quiz': 'テスト',
  'nav.dashboard': 'テスト結果',

  'detail.genQuiz': 'テスト作成',
  'detail.toc': '目次',
  'detail.section': 'セクション',

  'quiz.gen.title': 'テスト作成',
  'quiz.gen.subtitle': 'マニュアルの内容をもとにAIがテストを生成します',
  'quiz.gen.count5': '5問',
  'quiz.gen.count10': '10問',
  'quiz.gen.countLabel': '問題数を選択',
  'quiz.gen.generate': 'AIでテスト生成',
  'quiz.gen.generating': 'AIが問題を生成中...',
  'quiz.gen.save': 'テストを保存',
  'quiz.gen.saving': '保存中...',
  'quiz.gen.back': 'マニュアルに戻る',
  'quiz.gen.question': '問題{n}',
  'quiz.gen.optionLabel': '選択肢',
  'quiz.gen.answerLabel': '正解',
  'quiz.gen.explanationLabel': '解説',
  'quiz.gen.deleteQ': '問題を削除',
  'quiz.gen.noManual': 'マニュアルを読み込めません。',
  'quiz.gen.savedOk': 'テストが保存されました。',

  'quiz.list.title': 'テスト一覧',
  'quiz.list.empty': 'テストがまだありません。',
  'quiz.list.questions': '{n}問',
  'quiz.list.take': 'テスト受験',
  'quiz.list.results': '結果を見る',

  'quiz.take.title': 'テスト',
  'quiz.take.nameLabel': 'お名前を入力してください',
  'quiz.take.namePlaceholder': '例：山田太郎',
  'quiz.take.start': 'テスト開始',
  'quiz.take.submit': '提出する',
  'quiz.take.submitting': '採点中...',
  'quiz.take.result': '結果',
  'quiz.take.score': '{score}点',
  'quiz.take.passed': '合格',
  'quiz.take.failed': '不合格',
  'quiz.take.passLine': '合格基準：60点以上',
  'quiz.take.correct': '正解',
  'quiz.take.wrong': '不正解',
  'quiz.take.yourAnswer': 'あなたの回答',
  'quiz.take.correctAnswer': '正解',
  'quiz.take.explanation': '解説',
  'quiz.take.retry': 'もう一度',
  'quiz.take.backToList': '一覧に戻る',
  'quiz.take.of': '{current} / {total}',
  'quiz.take.noQuiz': 'テストを読み込めません。',

  'dashboard.title': 'テスト結果',
  'dashboard.subtitle': '全テスト結果を確認',
  'dashboard.empty': 'まだ結果がありません。',
  'dashboard.totalResults': '計{n}件',
  'dashboard.passRate': '合格率',
  'dashboard.avgScore': '平均点',
  'dashboard.col.name': '受験者',
  'dashboard.col.quiz': 'テスト',
  'dashboard.col.score': '点数',
  'dashboard.col.passed': '合否',
  'dashboard.col.date': '日付',
  'dashboard.passed': '合格',
  'dashboard.failed': '不合格',
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
  'block.addVideo': '添加视频',
  'block.empty': '添加模块开始编写手册',
  'block.placeholder': '请输入内容...',
  'block.uploading': '上传中...',
  'block.uploadFailed': '上传失败 — 临时保存',
  'block.noSupabase': 'Supabase Storage未配置，媒体文件临时保存，刷新后可能消失。',
  'block.imageHint': 'JPG, PNG, WEBP, GIF · 最大10MB',
  'block.videoHint': 'MP4, MOV, WebM · 最大100MB',

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

  'nav.manuals': '手册列表',
  'nav.new': '注册手册',
  'nav.quiz': '测试',
  'nav.dashboard': '测试结果',

  'detail.genQuiz': '创建测试',
  'detail.toc': '目录',
  'detail.section': '章节',

  'quiz.gen.title': '创建测试',
  'quiz.gen.subtitle': 'AI根据手册内容生成测试题',
  'quiz.gen.count5': '5道题',
  'quiz.gen.count10': '10道题',
  'quiz.gen.countLabel': '选择题目数量',
  'quiz.gen.generate': '用AI生成测试',
  'quiz.gen.generating': 'AI正在生成题目...',
  'quiz.gen.save': '保存测试',
  'quiz.gen.saving': '保存中...',
  'quiz.gen.back': '返回手册',
  'quiz.gen.question': '第{n}题',
  'quiz.gen.optionLabel': '选项',
  'quiz.gen.answerLabel': '正确答案',
  'quiz.gen.explanationLabel': '解析',
  'quiz.gen.deleteQ': '删除题目',
  'quiz.gen.noManual': '无法加载手册。',
  'quiz.gen.savedOk': '测试保存成功。',

  'quiz.list.title': '测试列表',
  'quiz.list.empty': '还没有测试。',
  'quiz.list.questions': '{n}道题',
  'quiz.list.take': '参加测试',
  'quiz.list.results': '查看结果',

  'quiz.take.title': '测试',
  'quiz.take.nameLabel': '请输入您的姓名',
  'quiz.take.namePlaceholder': '例如：张三',
  'quiz.take.start': '开始测试',
  'quiz.take.submit': '提交',
  'quiz.take.submitting': '评分中...',
  'quiz.take.result': '结果',
  'quiz.take.score': '{score}分',
  'quiz.take.passed': '通过',
  'quiz.take.failed': '未通过',
  'quiz.take.passLine': '合格标准：60分以上',
  'quiz.take.correct': '正确',
  'quiz.take.wrong': '错误',
  'quiz.take.yourAnswer': '您的答案',
  'quiz.take.correctAnswer': '正确答案',
  'quiz.take.explanation': '解析',
  'quiz.take.retry': '重新作答',
  'quiz.take.backToList': '返回列表',
  'quiz.take.of': '{current} / {total}',
  'quiz.take.noQuiz': '无法加载测试。',

  'dashboard.title': '测试结果',
  'dashboard.subtitle': '查看所有测试结果',
  'dashboard.empty': '暂无结果。',
  'dashboard.totalResults': '共{n}条',
  'dashboard.passRate': '通过率',
  'dashboard.avgScore': '平均分',
  'dashboard.col.name': '参加者',
  'dashboard.col.quiz': '测试',
  'dashboard.col.score': '分数',
  'dashboard.col.passed': '结果',
  'dashboard.col.date': '日期',
  'dashboard.passed': '通过',
  'dashboard.failed': '未通过',
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

/** generate API용 시스템 프롬프트 (JSON 구조화 출력) */
export const GENERATE_SYSTEM_PROMPTS: Record<Lang, string> = {
  ko: `당신은 소규모 자영업장의 업무 매뉴얼 작성 전문가입니다.
업로드된 매장 사진을 분석하여, 신규 아르바이트생이 이해하기 쉬운
단계별 업무 매뉴얼을 한국어로 작성해주세요.

반드시 아래 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON):
{
  "sections": [
    {
      "section_title": "섹션 제목",
      "content": "해당 섹션의 상세 내용 (여러 줄 가능)"
    }
  ]
}

- sections 배열에 3~7개의 섹션을 포함하세요
- 각 섹션은 명확한 제목과 구체적인 행동 지침을 포함하세요
- 주의사항이 있으면 별도 섹션으로 추가하세요`,

  en: `You are an expert in writing work manuals for small businesses.
Analyze the uploaded store photos and write a clear, step-by-step work manual in English
that new part-time employees can easily understand.

Respond ONLY with the following JSON format (no markdown code blocks, pure JSON):
{
  "sections": [
    {
      "section_title": "Section title",
      "content": "Detailed content for this section (multiple lines allowed)"
    }
  ]
}

- Include 3-7 sections in the sections array
- Each section should have a clear title and specific action instructions
- Add a separate section for warnings/notes if needed`,

  ja: `あなたは小規模事業所の業務マニュアル作成の専門家です。
アップロードされた店舗写真を分析して、新しいアルバイト従業員が
理解しやすい日本語のステップ別業務マニュアルを作成してください。

必ず以下のJSON形式のみで回答してください（マークダウンコードブロックなし、純粋なJSON）:
{
  "sections": [
    {
      "section_title": "セクションタイトル",
      "content": "このセクションの詳細内容（複数行可）"
    }
  ]
}

- sectionsの配列に3〜7つのセクションを含めてください
- 各セクションは明確なタイトルと具体的な行動指針を含めてください
- 注意事項がある場合は別セクションとして追加してください`,

  zh: `您是小型自营业务工作手册编写专家。
请分析上传的门店照片，用中文编写一份新员工易于理解的分步骤工作手册。

请仅以以下JSON格式回复（不含markdown代码块，纯JSON）：
{
  "sections": [
    {
      "section_title": "章节标题",
      "content": "本章节的详细内容（可多行）"
    }
  ]
}

- sections数组中包含3-7个章节
- 每个章节应有清晰的标题和具体的操作说明
- 如有注意事项，请单独添加一个章节`,
}
