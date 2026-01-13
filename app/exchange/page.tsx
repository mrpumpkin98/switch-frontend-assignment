"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";
import ExchangePage from "@/components/features/exchange";

export default function Exchange() {
   const router = useRouter();
   const { state } = useAuth();

   // 라우트 보호: 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
   useEffect(() => {
      if (!state.loading && !state.isAuthenticated) {
         router.push("/auth/login");
      }
   }, [state.isAuthenticated, state.loading, router]);

   // 로딩 중이거나 인증되지 않은 경우
   if (state.loading || !state.isAuthenticated) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <div className="text-lg text-gray-600">로딩 중...</div>
            </div>
         </div>
      );
   }

   return <ExchangePage />;
}
