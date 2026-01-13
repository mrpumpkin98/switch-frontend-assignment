"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "./navigation/NavigationBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isLoginPage = pathname === "/auth/login";
   const isNotFoundPage = pathname === null || pathname === undefined;

   // 로그인 페이지나 404 페이지가 아닐 때만 네비게이션 바 표시
   const shouldShowNav = !isLoginPage && !isNotFoundPage;

   return (
      <>
         {shouldShowNav && <NavigationBar />}
         {children}
      </>
   );
}
