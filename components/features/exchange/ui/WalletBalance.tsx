"use client";

import { Wallet } from "../types";

interface WalletBalanceProps {
  wallets: Wallet[];
  totalKrwBalance: number;
}

export default function WalletBalance({ wallets, totalKrwBalance }: WalletBalanceProps) {
  const formatCurrency = (amount: number, currency: string) => {
    if (!currency || currency.trim() === "") {
      return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    try {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: currency === "KRW" ? 0 : 2,
        maximumFractionDigits: currency === "KRW" ? 0 : 2,
      }).format(amount);
    } catch (error) {
      return (
        new Intl.NumberFormat("ko-KR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ` ${currency}`
      );
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      KRW: "₩",
      USD: "$",
      JPY: "₩",
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">내 지갑</h2>
      <div className="space-y-3">
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
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">총 보유 자산</span>
          <span className="text-xl font-bold text-gray-900">
            ₩ {totalKrwBalance.toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </div>
  );
}
