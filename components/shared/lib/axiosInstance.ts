import axios from "axios";
import { CookieManager } from "../utils/cookie";

// 메인 axios 인스턴스 생성
// CORS 문제 해결을 위해 Next.js API 프록시를 통해 요청
const axiosInstance = axios.create({
   baseURL: "/api/proxy", // Next.js API 프록시 경로
   headers: {
      "Content-Type": "application/json",
   },
});

// 요청 인터셉터 - 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
   (config) => {
      if (typeof window !== "undefined") {
         const token = CookieManager.get("accessToken");
         if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
         }
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
   (response) => response,
   async (error) => {
      // 401 에러 시 토큰 삭제 및 로그인 페이지로 리다이렉트
      if (error.response?.status === 401) {
         if (typeof window !== "undefined") {
            CookieManager.remove("accessToken");
            window.location.href = "/auth/login";
         }
      }
      return Promise.reject(error);
   }
);

export default axiosInstance;
