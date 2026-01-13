import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/shared/context/AuthContext";
import RouteGuard from "@/components/shared/components/RouteGuard";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "환전 애플리케이션",
   description: "실시간 환율을 적용한 환전 애플리케이션",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="ko">
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <AuthProvider>
               <RouteGuard>{children}</RouteGuard>
            </AuthProvider>
         </body>
      </html>
   );
}
