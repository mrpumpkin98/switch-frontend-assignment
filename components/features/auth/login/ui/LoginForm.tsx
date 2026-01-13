"use client";

import { FormEvent } from "react";
import Button from "@/components/shared/ui/Button";
import Input from "@/components/shared/ui/Input";

interface LoginFormProps {
   email: string;
   isLoading: boolean;
   error: string | null;
   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
   email,
   isLoading,
   error,
   onEmailChange,
   onSubmit,
}: LoginFormProps) {
   return (
      <div className="rounded-lg bg-gray-100 p-6">
         <form
            onSubmit={onSubmit}
            className="space-y-6"
         >
            {/* 이메일 입력 필드 */}
            <Input
               id="email"
               name="email"
               type="email"
               label="이메일 주소를 입력해주세요."
               value={email}
               onChange={onEmailChange}
               placeholder="test@test.com"
               autoComplete="email"
               required
               disabled={isLoading}
            />

            {/* 에러 메시지 */}
            {error && (
               <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800">{error}</p>
               </div>
            )}

            {/* 로그인 버튼 */}
            <Button
               type="submit"
               variant="primary"
               size="md"
               fullWidth
               disabled={isLoading || !email.trim()}
               loading={isLoading}
            >
               로그인 하기
            </Button>
         </form>
      </div>
   );
}

