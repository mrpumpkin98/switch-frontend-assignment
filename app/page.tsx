"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";

export default function Home() {
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

  // 로딩 중일 때는 아무것도 표시하지 않음
  return null;
}
