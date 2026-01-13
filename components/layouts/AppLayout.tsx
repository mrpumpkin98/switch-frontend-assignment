"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "./navigation/NavigationBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isLoginPage = pathname === "/auth/login";

   return (
      <>
         {!isLoginPage && <NavigationBar />}
         {children}
      </>
   );
}
