# 꼬르륵 (Grrrr) - Frontend

GIST 학식 메뉴 정보를 제공하는 PWA(Progressive Web App) 애플리케이션입니다.

## 📱 주요 기능

- **급식 메뉴 조회**: 일별 급식 메뉴 정보 확인
- **혼잡도 정보**: 식당별 실시간 혼잡도 확인
- **부족한 메뉴 알림**: 특정 메뉴의 부족 상황 알림
- **PWA 지원**: 홈 화면에 앱으로 설치 가능
- **반응형 디자인**: 데스크톱과 모바일 최적화

## 🛠 기술 스택

### Frontend
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **TanStack Router** - 라우팅
- **Tailwind CSS** - 스타일링
- **PWA** - 오프라인 지원 및 앱 설치

### 주요 라이브러리
- `axios` - HTTP 클라이언트
- `dayjs` - 날짜 처리
- `react-responsive` - 반응형 디자인
- `vite-plugin-pwa` - PWA 기능

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Desktop/           # 데스크톱 컴포넌트
│   │   ├── DesktopHeader.tsx
│   │   └── pages/
│   │       ├── DesktopCongestion.tsx
│   │       ├── DesktopDate.tsx
│   │       └── DesktopLacklack.tsx
│   └── Mobile/            # 모바일 컴포넌트
│       ├── MobileHeader.tsx
│       ├── PwaInstallPrompt.tsx
│       └── pages/
│           ├── MobileCongestion.tsx
│           ├── MobileDate.tsx
│           └── MobileLacklack.tsx
├── contexts/
│   └── MobileContext.tsx  # 모바일 상태 관리
├── layouts/
│   ├── DesktopLayout.tsx  # 데스크톱 레이아웃
│   └── MobileLayout.tsx   # 모바일 레이아웃
├── routes/                # 라우팅 설정
│   ├── __root.tsx
│   ├── index.tsx
│   └── menu/
│       ├── $date.tsx      # 날짜별 메뉴
│       ├── congestion.tsx # 혼잡도
│       └── lacklack.tsx   # 락락 메뉴
└── main.tsx              # 앱 진입점
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **빌드**
```bash
npm run build
```

4. **프리뷰**
```bash
npm run preview
```

## 📱 PWA 기능

### 앱 설치
- 모바일: 브라우저에서 "홈 화면에 추가" 선택
- 데스크톱: 주소창의 설치 아이콘 클릭

### 오프라인 지원
- 이미지 캐싱 (30일)
- 라우트 데이터 캐싱
- 자동 업데이트

## 🔧 개발 도구

### 코드 품질
```bash
npm run lint          # ESLint 실행
```

### 라우팅
- TanStack Router 사용
- 파일 기반 라우팅
- 자동 코드 스플리팅

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.