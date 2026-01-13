"use client";

import { ExchangeRateData } from "../types";
import Card from "@/components/shared/ui/Card";

interface ExchangeRateProps {
   exchangeRates: ExchangeRateData[];
}

export default function ExchangeRate({ exchangeRates }: ExchangeRateProps) {
   const formatRate = (rate: number) => {
      return new Intl.NumberFormat("ko-KR", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      }).format(rate);
   };

   const getCurrencyName = (currency: string) => {
      const names: Record<string, string> = {
         USD: "미국 달러",
         JPY: "일본 엔화",
      };
      return names[currency] || currency;
   };

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
         {exchangeRates.map((rate) => (
            <Card
               key={rate.currency}
               className="p-6"
            >
               <div className="mb-4 flex items-start justify-between">
                  <div className="text-lg font-semibold text-gray-900">{rate.currency}</div>
                  <div className="text-sm text-gray-600">{getCurrencyName(rate.currency)}</div>
               </div>
               <div className="mb-4 text-2xl font-bold text-gray-900">{formatRate(rate.rate)} KRW</div>
               <div className="flex items-center gap-1">
                  {rate.changePercentage >= 0 ? (
                     <svg
                        className="h-4 w-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                           clipRule="evenodd"
                        />
                     </svg>
                  ) : (
                     <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                           clipRule="evenodd"
                        />
                     </svg>
                  )}
                  <span
                     className={`text-sm font-medium ${rate.changePercentage >= 0 ? "text-red-600" : "text-blue-600"}`}
                  >
                     {rate.changePercentage >= 0 ? "+" : ""}
                     {rate.changePercentage.toFixed(1)}%
                  </span>
               </div>
            </Card>
         ))}
      </div>
   );
}
