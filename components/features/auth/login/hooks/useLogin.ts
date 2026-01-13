import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/hooks/useAuth";

export function useLogin() {
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const { login, state } = useAuth();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) {
         return;
      }

      setIsLoading(true);
      try {
         await login(email);
         // 로그인 성공 시 환전 페이지로 이동
         router.push("/exchange");
      } catch (error) {
         // 에러는 AuthContext에서 처리됨
         console.error("Login error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return {
      email,
      setEmail,
      isLoading,
      error: state.error,
      handleSubmit,
   };
}

