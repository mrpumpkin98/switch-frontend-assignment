"use client";

import { useAuthRedirect } from "@/components/shared/hooks/useAuthRedirect";

export default function Home() {
   useAuthRedirect();

   // 로딩 중일 때는 아무것도 표시하지 않음
   return null;
}
