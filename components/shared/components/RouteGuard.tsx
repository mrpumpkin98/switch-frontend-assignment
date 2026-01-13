"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";
import Spinner from "@/components/shared/ui/Spinner";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const pathname = usePathname();
   const { state } = useAuth();

   useEffect(() => {
      // 로딩 중이면 아무것도 하지 않음
      if (state.loading) {
         return;
      }

      const isLoginPage = pathname === "/auth/login";

      // 로그인하지 않은 상태
      if (!state.isAuthenticated) {
         // 로그인 페이지가 아니면 로그인 페이지로 리다이렉트
         if (!isLoginPage) {
            router.push("/auth/login");
         }
         return;
      }

      // 로그인한 상태
      if (state.isAuthenticated) {
         // 로그인 페이지에 접근하려고 하면 환전 페이지로 리다이렉트
         if (isLoginPage) {
            router.push("/exchange");
         }
         return;
      }
   }, [state.isAuthenticated, state.loading, pathname, router]);

   // 로딩 중일 때는 로딩 화면 표시
   if (state.loading) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <Spinner size="lg" />
            </div>
         </div>
      );
   }

   // 로그인하지 않은 상태에서 로그인 페이지가 아닌 곳에 접근하려고 할 때
   if (!state.isAuthenticated && pathname !== "/auth/login") {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <Spinner size="lg" />
            </div>
         </div>
      );
   }

   // 로그인한 상태에서 로그인 페이지에 접근하려고 할 때
   if (state.isAuthenticated && pathname === "/auth/login") {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <Spinner size="lg" />
            </div>
         </div>
      );
   }

   return <>{children}</>;
}
