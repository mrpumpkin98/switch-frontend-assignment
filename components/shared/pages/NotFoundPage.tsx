"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/shared/ui/Button";

export default function NotFoundPage() {
   const router = useRouter();

   return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
         <div className="text-center">
            <div className="mb-6">
               <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
               <h2 className="text-2xl font-semibold text-gray-700 mb-2">페이지를 찾을 수 없습니다</h2>
               <p className="text-gray-600">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
            </div>
            <div className="flex gap-4 justify-center">
               <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push("/exchange")}
               >
                  환전 페이지로 이동
               </Button>
               <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.back()}
               >
                  이전 페이지로
               </Button>
            </div>
         </div>
      </div>
   );
}

