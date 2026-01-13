"use client";

import WalletBalance from "./WalletBalance";
import ExchangeRate from "./ExchangeRate";
import ExchangeForm from "./ExchangeForm";
import { Wallet, ExchangeRateData } from "../types";
import PageTitle from "@/components/shared/ui/PageTitle";

interface ExchangePageContentProps {
   wallets: Wallet[];
   exchangeRates: ExchangeRateData[];
   totalKrwBalance: number;
   exchangeRateMap: Map<string, number>;
   onExchangeSuccess: () => void;
   onRefreshExchangeRates: () => Promise<void>;
}

export default function ExchangePageContent({
   wallets,
   exchangeRates,
   totalKrwBalance,
   exchangeRateMap,
   onExchangeSuccess,
   onRefreshExchangeRates,
}: ExchangePageContentProps) {
   return (
      <div className="min-h-screen bg-white">
         {/* 메인 컨텐츠 */}
         <div className="mx-auto max-w-7xl px-6 py-8">
            {/* 환율 정보 타이틀 */}
            <div className="mb-8">
               <PageTitle
                  title="환율 정보"
                  description="실시간 환율을 확인하고 간편하게 환전하세요."
               />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
               {/* 왼쪽: 환율 정보 및 내 지갑 */}

               <div className="lg:col-span-1 flex flex-col space-y-6">
                  {/* 환율 카드 */}
                  {exchangeRates.length > 0 && <ExchangeRate exchangeRates={exchangeRates} />}

                  {/* 내 지갑 */}
                  <div className="flex-1">
                     <WalletBalance
                        wallets={wallets}
                        totalKrwBalance={totalKrwBalance}
                     />
                  </div>
               </div>

               {/* 오른쪽: 환전 위젯 */}
               <div className="lg:col-span-2">
                  <ExchangeForm
                     wallets={wallets}
                     exchangeRates={exchangeRates}
                     onExchangeSuccess={onExchangeSuccess}
                     exchangeRateMap={exchangeRateMap}
                     onRefreshExchangeRates={onRefreshExchangeRates}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
