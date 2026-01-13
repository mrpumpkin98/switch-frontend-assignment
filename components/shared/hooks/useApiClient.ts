import axios, { AxiosInstance } from "axios";
import { useAuth } from "@/components/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { CookieManager } from "../utils/cookie";

// 토큰 관리 유틸리티 (쿠키 사용)
const TokenManager = {
   getAccessToken: (): string | null => {
      return CookieManager.get("accessToken");
   },
   setAccessToken: (token: string): void => {
      CookieManager.set("accessToken", token, 7);
   },
   removeAccessToken: (): void => {
      CookieManager.remove("accessToken");
   },
};

// 커스텀 axios 인스턴스 생성
const createApiClient = (): AxiosInstance => {
   const apiClient = axios.create({
      baseURL: "/api/proxy", // Next.js API 프록시 경로
      timeout: 10000,
      headers: {
         "Content-Type": "application/json",
      },
   });

   // 요청 인터셉터 - 모든 요청에 토큰 자동 추가
   apiClient.interceptors.request.use(
      (config) => {
         const token = TokenManager.getAccessToken();
         if (token) {
            config.headers.authorization = `Bearer ${token}`;
         }
         return config;
      },
      (error) => {
         return Promise.reject(error);
      }
   );

   return apiClient;
};

// 커스텀 훅
export const useApiClient = () => {
   const { logout } = useAuth();
   const router = useRouter();

   const apiClient = createApiClient();

   // 401 에러 시 처리를 위한 응답 인터셉터 추가
   apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
         if (error.response?.status === 401) {
            try {
               // 토큰이 만료되었거나 유효하지 않은 경우
               // 과제 요구사항에 refresh token이 없으므로 바로 로그아웃 처리
               TokenManager.removeAccessToken();
               await logout();
               router.push("/auth/login");
            } catch (logoutError) {
               // 로그아웃 실패 시에도 로그인 페이지로 이동
               router.push("/auth/login");
            }
         }
         return Promise.reject(error);
      }
   );

   return apiClient;
};

// 단순한 API 클라이언트 (훅 없이 사용할 때)
export const apiClient = createApiClient();

export default useApiClient;
