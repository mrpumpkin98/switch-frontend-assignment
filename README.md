# 환전 애플리케이션

## 배포 링크

https://switch-frontend-assignment.vercel.app/

## 실행 방법

```bash
npm install
npm run dev
```

**환경 변수 설정**

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_BASE_URL
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 구현된 기능

-  이메일 기반 로그인
-  환전 페이지 (지갑 잔액 조회, 실시간 환율 표시, 환전 견적 및 실행)
-  환전 내역 조회
-  라우트 보호 (인증된 사용자만 접근 가능)
-  404 페이지
-  로딩 스켈레톤 (로그인, 환전, 환전 내역 페이지)
-  에러 처리 및 에러 페이지
-  CORS 프록시 API 라우트

---

## 구현 상세

### 이메일 기반 로그인

**구현 위치**: `components/features/auth/login/`, `components/shared/context/AuthContext.tsx`

-  **인증 상태 관리**: React Context API와 `useReducer`를 사용하여 전역 인증 상태 관리
-  **토큰 저장**: JWT 토큰을 쿠키에 저장 (7일 유효기간, SameSite=Strict 보안 설정)
-  **로그인 플로우**:
   1. 사용자가 이메일 입력 후 `POST /auth/login` API 호출
   2. 서버로부터 받은 JWT 토큰을 쿠키에 저장
   3. `AuthContext`의 `isAuthenticated` 상태를 `true`로 업데이트
   4. 로그인 성공 시 `/exchange` 페이지로 자동 리다이렉트
-  **커스텀 훅**: `useLogin` 훅으로 로그인 로직 분리 및 재사용성 향상
-  **로딩 상태**: 로그인 요청 중 스켈레톤 UI 표시
-  **에러 처리**: API 에러 메시지를 사용자에게 표시

### 환전 페이지 (지갑 잔액 조회, 실시간 환율 표시, 환전 견적 및 실행)

**구현 위치**: `components/features/exchange/`

-  **지갑 잔액 조회**:
   -  `GET /wallets` API를 통해 사용자의 모든 통화별 잔액 조회
   -  KRW, USD, JPY 등 통화별 잔액을 카드 형태로 표시
   -  총 보유 자산(원화 기준) 계산 및 표시
-  **실시간 환율 표시**:
   -  `GET /exchange-rates/latest` API로 최신 환율 정보 조회
   -  1분마다 자동으로 환율 정보 갱신 (`useEffect` + `setInterval`)
   -  환율 변동률을 색상으로 구분 (상승: 빨간색, 하락: 파란색)
   -  환율 적용 일시 표시
-  **환전 견적 조회**:
   -  사용자가 금액과 통화를 선택하면 `GET /orders/quote` API 호출
   -  입력값 변경 시 500ms 디바운싱 적용하여 불필요한 API 호출 방지
   -  환율 변경 시에는 즉시 견적 재조회
   -  매수/매도 모드에 따라 `fromCurrency`, `toCurrency` 자동 설정
-  **환전 실행**:
   -  `POST /orders` API로 환전 요청
   -  환율 불일치 에러(`EXCHANGE_RATE_MISMATCH`) 발생 시 자동으로 최신 환율 조회 후 재시도
   -  환전 성공 시 지갑 잔액 자동 갱신
-  **커스텀 훅**: `useExchange` 훅으로 데이터 페칭 및 상태 관리 로직 분리
-  **UI 컴포넌트**: `ExchangePageContent`, `WalletBalance`, `ExchangeRate`, `ExchangeForm`으로 모듈화

### 환전 내역 조회

**구현 위치**: `components/features/exchange-history/`

-  **내역 조회**: `GET /orders` API를 통해 사용자의 모든 환전 내역 조회
-  **테이블 표시**:
   -  거래 ID, 거래 일시, 매수 금액, 채결 환율, 매도 금액 컬럼으로 구성
   -  날짜 포맷: `YYYY-MM-DD HH:MM:SS` 형식
   -  통화별 금액 포맷팅 (KRW: 소수점 없음, 외화: 소수점 2자리)
-  **빈 상태 처리**: 내역이 없을 경우 `EmptyState` 컴포넌트 표시
-  **커스텀 훅**: `useOrderHistory` 훅으로 데이터 페칭 로직 분리

### 라우트 보호 (인증된 사용자만 접근 가능)

**구현 위치**: `components/shared/components/RouteGuard.tsx`

-  **전역 라우트 가드**: `app/layout.tsx`에서 모든 페이지를 `RouteGuard`로 감싸서 전역 적용
-  **인증 체크 로직**:
   -  로그인하지 않은 사용자가 보호된 페이지(`/exchange`, `/orders`) 접근 시 `/auth/login`으로 리다이렉트
   -  로그인한 사용자가 `/auth/login` 접근 시 `/exchange`로 리다이렉트
-  **로딩 상태**: 인증 상태 확인 중 스피너 표시
-  **자동 리다이렉트**: `useEffect`를 사용하여 인증 상태 변경 시 자동으로 적절한 페이지로 이동

### 404 페이지

**구현 위치**: `app/not-found.tsx`, `components/shared/pages/NotFoundPage.tsx`

-  **Next.js 기본 404 처리**: `app/not-found.tsx` 파일로 존재하지 않는 경로 접근 시 자동 표시
-  **UI 컴포넌트**: `NotFoundPage` 컴포넌트로 재사용 가능하게 구현
-  **네비게이션**: "환전 페이지로 이동", "이전 페이지로" 버튼 제공

### 로딩 스켈레톤 (로그인, 환전, 환전 내역 페이지)

**구현 위치**: 각 feature의 `ui/LoadingState.tsx`, `ui/LoginSkeleton.tsx`

-  **로그인 페이지 스켈레톤**: 아이콘, 제목, 폼 필드 영역의 스켈레톤 UI
-  **환전 페이지 스켈레톤**:
   -  타이틀, 환율 카드(2개), 지갑 카드, 환전 폼의 스켈레톤 UI
   -  실제 레이아웃 구조를 반영한 스켈레톤
-  **환전 내역 페이지 스켈레톤**:
   -  타이틀, 테이블 헤더(5개 컬럼), 테이블 바디(5개 행)의 스켈레톤 UI
-  **애니메이션**: Tailwind CSS의 `animate-pulse` 클래스로 펄스 애니메이션 적용

### 에러 처리 및 에러 페이지

**구현 위치**: 각 feature의 `ui/ErrorState.tsx`

-  **에러 상태 표시**: API 호출 실패 시 에러 메시지를 사용자에게 표시
-  **에러 컴포넌트**: `ErrorState` 컴포넌트로 일관된 에러 UI 제공
-  **401 에러 처리**:
   -  Axios 인터셉터에서 401 에러 감지 시 자동으로 토큰 삭제 및 로그인 페이지로 리다이렉트
   -  `useApiClient` 훅과 `axiosInstance`에서 중앙 집중식 에러 처리

### CORS 프록시 API 라우트

**구현 위치**: `app/api/proxy/[...path]/route.ts`

-  **CORS 문제 해결**: 외부 API 서버가 CORS를 허용하지 않아 Next.js API Route를 프록시로 사용
-  **동적 라우팅**: `[...path]` catch-all 라우트로 모든 API 경로를 프록시
-  **HTTP 메서드 지원**: GET, POST, PUT, DELETE 메서드 지원
-  **헤더 전달**: 클라이언트의 Authorization 헤더를 외부 API로 전달
-  **Content-Type 처리**:
   -  `/auth/login` 엔드포인트는 `application/x-www-form-urlencoded` 형식으로 변환
   -  다른 엔드포인트는 `application/json` 형식 유지
-  **에러 처리**: 프록시 요청 실패 시 적절한 에러 응답 반환
