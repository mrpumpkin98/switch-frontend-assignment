import React from "react";

interface CardProps {
   children: React.ReactNode;
   title?: string;
   className?: string;
   variant?: "default" | "gray";
}

export default function Card({ children, title, className = "", variant = "default" }: CardProps) {
   const variantClasses = {
      default: "bg-white",
      gray: "bg-gray-100",
   };

   return (
      <div className={`rounded-lg border border-gray-200 ${variantClasses[variant]} p-6  ${className}`}>
         {title && <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>}
         {children}
      </div>
   );
}
