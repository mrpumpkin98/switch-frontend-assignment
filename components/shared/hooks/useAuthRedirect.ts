import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * 인증 상태에 따라 자동으로 리다이렉트하는 커스텀 훅
 * - 인증된 사용자: /exchange로 리다이렉트
 * - 인증되지 않은 사용자: /auth/login으로 리다이렉트
 */
export function useAuthRedirect() {
   const router = useRouter();
   const { state } = useAuth();

   useEffect(() => {
      if (!state.loading) {
         if (state.isAuthenticated) {
            // 이미 로그인되어 있으면 환전 페이지로 이동
            router.push("/exchange");
         } else {
            // 로그인되지 않았으면 로그인 페이지로 이동
            router.push("/auth/login");
         }
      }
   }, [state.isAuthenticated, state.loading, router]);
}

