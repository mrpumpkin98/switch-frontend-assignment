import { useState, useEffect } from "react";
import { useApiClient } from "@/components/shared/hooks/useApiClient";
import { useAuth } from "@/components/shared/hooks/useAuth";
import { Wallet, ExchangeRateData } from "../types";

export function useExchange() {
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
      const newMap = new Map(exchangeRates.map((rate) => [rate.currency, rate.exchangeRateId]));
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

   return {
      wallets,
      exchangeRates,
      totalKrwBalance,
      loading,
      error,
      exchangeRateMap,
      fetchWallets,
      fetchExchangeRates,
      handleExchangeSuccess,
   };
}

