"use client";

import LoginPageContent from "./ui/LoginPageContent";
import { useLogin } from "./hooks/useLogin";

export default function LoginPage() {
   const { email, setEmail, isLoading, error, handleSubmit } = useLogin();

   return (
      <LoginPageContent
         email={email}
         isLoading={isLoading}
         error={error}
         onEmailChange={(e) => setEmail(e.target.value)}
         onSubmit={handleSubmit}
      />
   );
}
