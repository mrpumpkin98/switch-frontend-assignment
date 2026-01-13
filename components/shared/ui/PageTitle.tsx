import React from "react";

interface PageTitleProps {
   title: string;
   description?: string;
   className?: string;
}

export default function PageTitle({ title, description, className = "" }: PageTitleProps) {
   return (
      <div className={className}>
         <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
         {description && (
            <p className="text-sm text-gray-600">{description}</p>
         )}
      </div>
   );
}

