"use client";

interface ErrorStateProps {
   message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
   return (
      <div className="flex min-h-screen items-center justify-center bg-white">
         <div className="text-center">
            <div className="text-lg text-red-600">{message}</div>
         </div>
      </div>
   );
}

