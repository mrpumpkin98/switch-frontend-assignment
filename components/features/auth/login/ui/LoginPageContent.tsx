"use client";

import { FormEvent } from "react";
import LoginIcon from "./LoginIcon";
import LoginTitle from "./LoginTitle";
import LoginForm from "./LoginForm";

interface LoginPageContentProps {
   email: string;
   isLoading: boolean;
   error: string | null;
   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function LoginPageContent({ email, isLoading, error, onEmailChange, onSubmit }: LoginPageContentProps) {
   return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
         <div className="w-full max-w-md space-y-8">
            {/* Wi-Fi 아이콘 */}
            <LoginIcon />

            {/* 제목 */}
            <LoginTitle />

            {/* 로그인 폼 컨테이너 */}
            <LoginForm
               email={email}
               isLoading={isLoading}
               error={error}
               onEmailChange={onEmailChange}
               onSubmit={onSubmit}
            />
         </div>
      </div>
   );
}
