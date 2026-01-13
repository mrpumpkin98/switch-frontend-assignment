"use client";

import ExchangePageContent from "./ui/ExchangePageContent";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import { useExchange } from "./hooks/useExchange";

export default function ExchangePage() {
   const {
      wallets,
      exchangeRates,
      totalKrwBalance,
      loading,
      error,
      exchangeRateMap,
      fetchWallets,
      fetchExchangeRates,
      handleExchangeSuccess,
   } = useExchange();

   if (loading) {
      return <LoadingState />;
   }

   if (error) {
      return <ErrorState message={error} />;
   }

   return (
      <ExchangePageContent
         wallets={wallets}
         exchangeRates={exchangeRates}
         totalKrwBalance={totalKrwBalance}
         exchangeRateMap={exchangeRateMap}
         onExchangeSuccess={handleExchangeSuccess}
         onRefreshExchangeRates={fetchExchangeRates}
      />
   );
}
