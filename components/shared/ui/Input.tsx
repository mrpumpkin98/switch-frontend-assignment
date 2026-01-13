import React from "react";

interface InputProps {
   id?: string;
   name?: string;
   type?: "text" | "email" | "password" | "number" | "tel";
   value?: string;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   placeholder?: string;
   label?: string;
   error?: string;
   disabled?: boolean;
   required?: boolean;
   autoComplete?: string;
   inputMode?: "text" | "email" | "numeric" | "decimal" | "tel";
   readOnly?: boolean;
   className?: string;
}

export default function Input({
   id,
   name,
   type = "text",
   value,
   onChange,
   placeholder,
   label,
   error,
   disabled = false,
   required = false,
   autoComplete,
   inputMode,
   readOnly = false,
   className = "",
}: InputProps) {
   const inputClasses = `block w-full rounded-lg border ${
      error
         ? "border-red-300 focus:border-red-500 focus:ring-red-500"
         : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
   } bg-white px-4 py-3  placeholder-gray-400 focus:outline-none focus:ring-2 text-sm ${
      readOnly ? "cursor-default" : ""
   } ${className}`;

   return (
      <div>
         {label && (
            <label
               htmlFor={id}
               className="block text-sm font-medium text-gray-700 mb-2"
            >
               {label}
            </label>
         )}
         <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            readOnly={readOnly}
            className={inputClasses}
         />
         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
   );
}
