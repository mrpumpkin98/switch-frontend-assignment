import React from "react";

interface Tab {
   id: string;
   label: string;
   activeColor?: "red" | "blue" | "purple";
}

interface TabsProps {
   tabs: Tab[];
   activeTab: string;
   onChange: (tabId: string) => void;
   className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
   if (tabs.length !== 2) {
      console.warn("Tabs component currently only supports 2 tabs");
   }

   const getActiveTab = () => tabs.find((tab) => tab.id === activeTab);
   const activeTabData = getActiveTab();

   return (
      <div className={`relative rounded-lg border border-gray-300 bg-gray-100 p-1 ${className}`}>
         <div className="flex gap-2">
            {tabs.map((tab) => {
               const isActive = tab.id === activeTab;
               const activeColor = tab.activeColor || "red";

               const activeClasses = {
                  red: "bg-red-600 text-white",
                  blue: "bg-blue-600 text-white",
                  purple: "bg-white text-purple-400",
               };

               const inactiveClasses = "bg-transparent text-gray-600";

               return (
                  <button
                     key={tab.id}
                     type="button"
                     onClick={() => onChange(tab.id)}
                     className={`relative flex-1 rounded-lg py-4 text-center text-lg font-semibold transition-colors ${
                        isActive ? activeClasses[activeColor] : inactiveClasses
                     }`}
                  >
                     {tab.label}
                     {isActive && activeColor === "purple" && (
                        <>
                           <span className="absolute -right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-600"></span>
                           <div className="absolute -right-1 top-1/2 h-0.5 w-8 -translate-y-1/2 bg-red-600"></div>
                        </>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
   );
}

