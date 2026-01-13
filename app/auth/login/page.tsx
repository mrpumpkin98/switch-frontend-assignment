"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const { login, state } = useAuth();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) {
         return;
      }

      setIsLoading(true);
      try {
         await login(email);
         // 로그인 성공 시 환전 페이지로 이동
         router.push("/exchange");
      } catch (error) {
         // 에러는 AuthContext에서 처리됨
         console.error("Login error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
         <div className="w-full max-w-md space-y-8">
            {/* Wi-Fi 아이콘 */}
            <div className="flex justify-center">
               <svg
                  className="h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
               </svg>
            </div>

            {/* 제목 */}
            <div className="text-center">
               <h1 className="text-3xl font-bold text-gray-900">반갑습니다.</h1>
               <p className="mt-2 text-base text-gray-600">로그인 정보를 입력해주세요.</p>
            </div>

            {/* 로그인 폼 컨테이너 */}
            <div className="rounded-lg bg-gray-100 p-6">
               <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
               >
                  {/* 이메일 입력 필드 */}
                  <div>
                     <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                     >
                        이메일 주소를 입력해주세요.
                     </label>
                     <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test@test.com"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isLoading}
                     />
                  </div>

                  {/* 에러 메시지 */}
                  {state.error && (
                     <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                        <p className="text-sm text-red-800">{state.error}</p>
                     </div>
                  )}

                  {/* 로그인 버튼 */}
                  <button
                     type="submit"
                     disabled={isLoading || !email.trim()}
                     className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                     {isLoading ? "처리 중..." : "로그인 하기"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
