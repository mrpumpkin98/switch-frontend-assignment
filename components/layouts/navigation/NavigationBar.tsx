"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";

export default function NavigationBar() {
   const router = useRouter();
   const pathname = usePathname();
   const { logout } = useAuth();

   return (
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
         <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-lg font-semibold text-gray-900">Exchange app</span>
               <svg
                  className="h-4 w-4 text-gray-600"
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
            <div className="flex items-center gap-6">
               <button
                  onClick={() => router.push("/exchange")}
                  className={`cursor-pointer text-sm ${
                     pathname === "/exchange"
                        ? "font-bold text-gray-900"
                        : "font-medium text-gray-700 hover:text-gray-900"
                  }`}
               >
                  환전 하기
               </button>
               <button
                  onClick={() => router.push("/orders")}
                  className={`cursor-pointer text-sm ${
                     pathname === "/orders"
                        ? "font-bold text-gray-900"
                        : "font-medium text-gray-700 hover:text-gray-900"
                  }`}
               >
                  환전 내역
               </button>
               <button
                  onClick={logout}
                  className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
               >
                  Log out
               </button>
            </div>
         </div>
      </nav>
   );
}
