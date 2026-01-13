"use client";

export default function LoadingState() {
   return (
      <div className="min-h-screen bg-white">
         <div className="mx-auto max-w-7xl px-6 py-8">
            {/* 타이틀 스켈레톤 */}
            <div className="mb-8 space-y-3">
               <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
               <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
               {/* 왼쪽: 환율 정보 및 내 지갑 스켈레톤 */}
               <div className="lg:col-span-1 flex flex-col space-y-6">
                  {/* 환율 카드 스켈레톤 (2개) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     {[1, 2].map((i) => (
                        <div
                           key={i}
                           className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                        >
                           <div className="mb-4 flex items-start justify-between">
                              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                           </div>
                           <div className="mb-4 h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                           <div className="flex items-center gap-1">
                              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* 내 지갑 스켈레톤 */}
                  <div className="flex-1 rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm">
                     <div className="mb-4 h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
                     <div className="flex-1 space-y-3">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                           >
                              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                           </div>
                        ))}
                     </div>
                     <div className="mt-auto border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                           <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                           <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 오른쪽: 환전 폼 스켈레톤 */}
               <div className="lg:col-span-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-100 p-8 shadow-lg">
                     <div className="space-y-6">
                        {/* 통화 선택 드롭다운 스켈레톤 */}
                        <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>

                        {/* 살래요/팔래요 탭 스켈레톤 */}
                        <div className="h-16 w-full bg-gray-200 rounded-lg animate-pulse"></div>

                        {/* 매수/매도 금액 입력 스켈레톤 */}
                        <div className="space-y-2">
                           <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                           <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>

                        {/* 화살표 아이콘 스켈레톤 */}
                        <div className="flex justify-center">
                           <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>

                        {/* 필요 원화/받을 원화 스켈레톤 */}
                        <div className="space-y-2">
                           <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                           <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>

                        {/* 환전하기 버튼 스켈레톤 */}
                        <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
