// API 응답 타입
export interface ApiResponse<T> {
   code: string;
   message: string;
   data: T;
}

// 로그인 응답 타입
export interface LoginResponse {
   token: string; // API 응답에서 token으로 반환됨
   memberId?: number;
}

// 사용자 정보 타입
export interface UserInfo {
   id: string;
   email: string;
   // 기타 사용자 정보
}
