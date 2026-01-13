"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/components/shared/hooks/useApiClient";
import { useAuth } from "@/components/shared/hooks/useAuth";
import WalletBalance from "./ui/WalletBalance";
import ExchangeRate from "./ui/ExchangeRate";
import ExchangeForm from "./ui/ExchangeForm";
import { Wallet, ExchangeRateData } from "./types";

export default function ExchangePage() {
  const router = useRouter();
  const apiClient = useApiClient();
  const { logout } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateData[]>([]);
  const [totalKrwBalance, setTotalKrwBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 환율 ID 매핑을 state로 관리하여 자동 업데이트
  const [exchangeRateMap, setExchangeRateMap] = useState<Map<string, number>>(new Map());
  
  // 환율 정보가 업데이트되면 exchangeRateMap도 업데이트
  useEffect(() => {
    const newMap = new Map(
      exchangeRates.map((rate) => [rate.currency, rate.exchangeRateId])
    );
    setExchangeRateMap(newMap);
  }, [exchangeRates]);

  // 지갑 잔액 조회
  const fetchWallets = async () => {
    try {
      const response = await apiClient.get("/wallets");
      console.log("Wallets API Response:", response.data);
      
      if (response.data.code === "OK") {
        const data = response.data.data;
        if (data && data.wallets && Array.isArray(data.wallets)) {
          setWallets(data.wallets);
          setTotalKrwBalance(data.totalKrwBalance || 0);
        } else {
          console.warn("Unexpected wallets response format:", data);
          setWallets([]);
        }
      } else {
        console.error("Wallets API Error:", response.data);
        setWallets([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch wallets:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        logout();
      }
      setWallets([]);
    }
  };

  // 환율 정보 조회
  const fetchExchangeRates = async () => {
    try {
      const response = await apiClient.get("/exchange-rates/latest");
      console.log("Exchange Rates API Response:", response.data);
      
      if (response.data.code === "OK") {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setExchangeRates(data);
        } else {
          console.warn("Unexpected exchange rates response format:", data);
          setExchangeRates([]);
        }
      } else {
        console.error("Exchange Rates API Error:", response.data);
        setExchangeRates([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch exchange rates:", err);
      console.error("Error response:", err.response?.data);
      setExchangeRates([]);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchWallets();
        fetchExchangeRates().catch(() => {});
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 환전 성공 후 지갑 잔액 갱신
  const handleExchangeSuccess = () => {
    fetchWallets();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">Exchange app</span>
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/exchange")}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              환전 하기
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              환전 내역
            </button>
            <button
              onClick={logout}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 환율 정보 및 내 지갑 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 환율 정보 타이틀 */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">환율 정보</h1>
              <p className="mt-2 text-gray-600">
                실시간 환율을 확인하고 간편하게 환전하세요.
              </p>
            </div>

            {/* 환율 카드 */}
            {exchangeRates.length > 0 && (
              <ExchangeRate exchangeRates={exchangeRates} />
            )}

            {/* 내 지갑 */}
            <WalletBalance wallets={wallets} totalKrwBalance={totalKrwBalance} />
          </div>

          {/* 오른쪽: 환전 위젯 */}
          <div className="lg:col-span-2">
            <ExchangeForm
              wallets={wallets}
              exchangeRates={exchangeRates}
              onExchangeSuccess={handleExchangeSuccess}
              exchangeRateMap={exchangeRateMap}
              onRefreshExchangeRates={fetchExchangeRates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
