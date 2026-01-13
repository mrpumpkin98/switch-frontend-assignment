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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
               <h1 className="text-3xl font-bold text-gray-900">환전 애플리케이션</h1>
               <p className="mt-2 text-sm text-gray-600">이메일을 입력하여 시작하세요</p>
            </div>

            <form
               onSubmit={handleSubmit}
               className="mt-8 space-y-6"
            >
               <div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-700"
                  >
                     이메일 주소
                  </label>
                  <input
                     id="email"
                     name="email"
                     type="email"
                     autoComplete="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                     placeholder="your@email.com"
                     disabled={isLoading}
                  />
               </div>

               {state.error && (
                  <div className="rounded-md bg-red-50 p-4">
                     <p className="text-sm text-red-800">{state.error}</p>
                  </div>
               )}

               <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {isLoading ? "처리 중..." : "시작하기"}
               </button>
            </form>
         </div>
      </div>
   );
}
