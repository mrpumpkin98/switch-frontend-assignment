"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";

export default function OrdersPage() {
  const router = useRouter();
  const { state, logout } = useAuth();

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

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">Exchange app</span>
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/exchange")}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              환전 하기
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="text-sm font-medium text-gray-900"
            >
              환전 내역
            </button>
            <button
              onClick={logout}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">환전 내역</h1>
        <p className="text-gray-600">환전 내역 페이지는 추후 구현 예정입니다.</p>
      </div>
    </div>
  );
}

