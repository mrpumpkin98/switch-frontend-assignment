"use client";

import { Wallet } from "../types";
import Card from "@/components/shared/ui/Card";

interface WalletBalanceProps {
   wallets: Wallet[];
   totalKrwBalance: number;
}

export default function WalletBalance({ wallets, totalKrwBalance }: WalletBalanceProps) {
   const getCurrencySymbol = (currency: string) => {
      const symbols: Record<string, string> = {
         KRW: "₩",
         USD: "$",
         JPY: "₩",
      };
      return symbols[currency] || currency;
   };

   return (
      <Card
         variant="gray"
         title="내 지갑"
         className="flex h-full flex-col p-6 "
      >
         <div className="flex-1 space-y-3">
            {wallets.length > 0 ? (
               wallets.map((wallet) => (
                  <div
                     key={wallet.currency}
                     className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                     <div className="text-sm text-gray-600">{wallet.currency}</div>
                     <div className="text-lg font-semibold text-gray-900">
                        {getCurrencySymbol(wallet.currency)} {wallet.balance.toLocaleString("ko-KR")}
                     </div>
                  </div>
               ))
            ) : (
               <div className="text-center text-gray-500">지갑 정보가 없습니다.</div>
            )}
         </div>
         <div className="mt-auto border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-600">총 보유 자산</span>
               <span className="text-xl font-bold text-gray-900">₩ {totalKrwBalance.toLocaleString("ko-KR")}</span>
            </div>
         </div>
      </Card>
   );
}
