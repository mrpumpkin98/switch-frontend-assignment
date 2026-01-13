"use client";

export default function LoginSkeleton() {
   return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
         <div className="w-full max-w-md space-y-8">
            {/* 아이콘 스켈레톤 */}
            <div className="flex justify-center">
               <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
            </div>

            {/* 제목 스켈레톤 */}
            <div className="text-center space-y-3">
               <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
               <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
            </div>

            {/* 폼 스켈레톤 */}
            <div className="rounded-lg bg-gray-100 p-6 space-y-6">
               {/* 이메일 입력 필드 스켈레톤 */}
               <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
               </div>

               {/* 버튼 스켈레톤 */}
               <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
         </div>
      </div>
   );
}

