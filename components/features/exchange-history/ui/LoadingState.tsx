"use client";

export default function LoadingState() {
   return (
      <div className="min-h-screen bg-white">
         <div className="mx-auto max-w-7xl px-6 py-8">
            {/* 타이틀 스켈레톤 */}
            <div className="mb-6 space-y-3">
               <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
               <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* 테이블 스켈레톤 */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
               {/* 테이블 헤더 스켈레톤 */}
               <div className="bg-gray-50">
                  <div className="grid grid-cols-5 gap-4 px-6 py-3">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <div
                           key={i}
                           className="h-4 w-20 bg-gray-200 rounded animate-pulse"
                        ></div>
                     ))}
                  </div>
               </div>

               {/* 테이블 바디 스켈레톤 */}
               <div className="divide-y divide-gray-200 bg-white">
                  {[1, 2, 3, 4, 5].map((row) => (
                     <div
                        key={row}
                        className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50"
                     >
                        {[1, 2, 3, 4, 5].map((col) => (
                           <div
                              key={col}
                              className="h-5 w-24 bg-gray-200 rounded animate-pulse"
                           ></div>
                        ))}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
