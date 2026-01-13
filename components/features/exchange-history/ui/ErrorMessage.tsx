"use client";

interface ErrorMessageProps {
   message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
   return (
      <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
         <p className="text-sm text-red-800">{message}</p>
      </div>
   );
}

