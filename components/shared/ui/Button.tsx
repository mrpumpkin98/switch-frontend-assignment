import React from "react";

interface ButtonProps {
   variant?: "primary" | "secondary" | "outline" | "ghost";
   size?: "sm" | "md" | "lg";
   children: React.ReactNode;
   onClick?: () => void;
   disabled?: boolean;
   loading?: boolean;
   type?: "button" | "submit" | "reset";
   className?: string;
   fullWidth?: boolean;
}

export default function Button({
   variant = "primary",
   size = "md",
   children,
   onClick,
   disabled = false,
   loading = false,
   type = "button",
   className = "",
   fullWidth = false,
}: ButtonProps) {
   const baseClasses = "font-medium rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
   
   const variantClasses = {
      primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
      secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-600",
      ghost: "bg-transparent text-gray-700 hover:text-gray-900 focus:ring-gray-500",
   };
   
   const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-4 text-lg font-semibold",
   };

   return (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled || loading}
         className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      >
         {loading ? "처리 중..." : children}
      </button>
   );
}

