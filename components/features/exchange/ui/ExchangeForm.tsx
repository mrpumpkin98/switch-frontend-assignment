"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { useApiClient } from "@/components/shared/hooks/useApiClient";
import { Wallet, ExchangeRateData, ExchangeQuote } from "../types";

interface ExchangeFormProps {
  wallets: Wallet[];
  exchangeRates: ExchangeRateData[];
  onExchangeSuccess: () => void;
  exchangeRateMap?: Map<string, number>;
  onRefreshExchangeRates?: () => Promise<void>; // 환율 정보 새로고침 함수
}

type ExchangeMode = "buy" | "sell";

export default function ExchangeForm({
  wallets,
  exchangeRates,
  onExchangeSuccess,
  exchangeRateMap,
  onRefreshExchangeRates,
}: ExchangeFormProps) {
  const apiClient = useApiClient();
  const [mode, setMode] = useState<ExchangeMode>("buy");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [forexAmount, setForexAmount] = useState<string>("");
  const [quote, setQuote] = useState<ExchangeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이전 값들을 추적하여 사용자 입력인지 환율 변경인지 구분
  const prevForexAmountRef = useRef<string>("");
  const prevSelectedCurrencyRef = useRef<string>("");
  const prevModeRef = useRef<ExchangeMode>("buy");
  const prevExchangeRatesRef = useRef<ExchangeRateData[]>([]);

  // 사용 가능한 통화 목록 (KRW 제외)
  const availableCurrencies = exchangeRates.map((rate) => rate.currency);

  // 모드에 따라 fromCurrency, toCurrency 결정
  const fromCurrency = mode === "buy" ? "KRW" : selectedCurrency;
  const toCurrency = mode === "buy" ? selectedCurrency : "KRW";

  // 환전 견적 조회 (디바운싱 적용)
  // 매수 금액 입력값이 변경될 때만 디바운싱 적용, 환율 변경 시에는 즉시 조회
  useEffect(() => {
    // 입력값이 없거나 유효하지 않으면 견적 초기화
    if (!selectedCurrency || !forexAmount || parseFloat(forexAmount) <= 0) {
      setQuote(null);
      setError(null);
      // 입력값이 비어졌을 때도 이전 값 업데이트
      prevForexAmountRef.current = forexAmount;
      prevSelectedCurrencyRef.current = selectedCurrency;
      prevModeRef.current = mode;
      return;
    }

    // 현재 입력값으로 fromCurrency, toCurrency 계산
    const currentFromCurrency = mode === "buy" ? "KRW" : selectedCurrency;
    const currentToCurrency = mode === "buy" ? selectedCurrency : "KRW";

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get("/orders/quote", {
          params: {
            fromCurrency: currentFromCurrency,
            toCurrency: currentToCurrency,
            forexAmount: parseFloat(forexAmount),
          },
        });

        if (response.data.code === "OK") {
          setQuote(response.data.data);
          setError(null);
        } else {
          const errorMessage = response.data.message || "견적 조회에 실패했습니다.";
          if (response.data.data && typeof response.data.data === "object") {
            const detailErrors = Object.values(response.data.data).join(", ");
            setError(detailErrors || errorMessage);
          } else {
            setError(errorMessage);
          }
          setQuote(null);
        }
      } catch (err: any) {
        const errorData = err.response?.data;
        let errorMessage = "견적 조회에 실패했습니다.";
        
        if (errorData) {
          errorMessage = errorData.message || errorMessage;
          if (errorData.data && typeof errorData.data === "object") {
            const detailErrors = Object.values(errorData.data).join(", ");
            if (detailErrors) {
              errorMessage = detailErrors;
            }
          }
        }
        
        setError(errorMessage);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    // 변경 사항 확인
    const isForexAmountChanged = prevForexAmountRef.current !== forexAmount;
    const isSelectedCurrencyChanged = prevSelectedCurrencyRef.current !== selectedCurrency;
    const isModeChanged = prevModeRef.current !== mode;
    const isExchangeRatesChanged = JSON.stringify(prevExchangeRatesRef.current) !== JSON.stringify(exchangeRates);
    
    // forexAmount, selectedCurrency, mode가 변경된 경우 (사용자 입력): 디바운싱 적용
    if (isForexAmountChanged || isSelectedCurrencyChanged || isModeChanged) {
      // 사용자 입력 또는 통화/모드 변경: 500ms 디바운싱
      const timer = setTimeout(() => {
        // 입력값이 유효한 경우에만 견적 조회
        if (forexAmount && parseFloat(forexAmount) > 0) {
          fetchQuote();
        }
        // 이전 값 업데이트 (입력값이 비어있어도 업데이트하여 다시 입력했을 때 변경사항 감지)
        prevForexAmountRef.current = forexAmount;
        prevSelectedCurrencyRef.current = selectedCurrency;
        prevModeRef.current = mode;
        prevExchangeRatesRef.current = exchangeRates;
      }, 500);
      
      return () => {
        clearTimeout(timer);
      };
    } else if (isExchangeRatesChanged && forexAmount && parseFloat(forexAmount) > 0) {
      // 환율만 변경된 경우: 즉시 조회 (매수 금액은 그대로 유지)
      fetchQuote();
      prevExchangeRatesRef.current = exchangeRates;
    }
    // apiClient는 의존성에서 제거 (훅에서 반환되는 인스턴스는 안정적)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forexAmount, selectedCurrency, mode, exchangeRates]);

  // 환전 실행 (자동 재시도 포함)
  const handleExchange = async (e: FormEvent, retryCount = 0) => {
    e.preventDefault();

    if (!selectedCurrency || !forexAmount || parseFloat(forexAmount) <= 0) {
      setError("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    // 최신 환율 ID 가져오기
    let exchangeRateId = exchangeRateMap?.get(selectedCurrency);
    
    if (!exchangeRateId && retryCount === 0) {
      setError("환율 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/orders", {
        exchangeRateId,
        fromCurrency,
        toCurrency,
        forexAmount: parseFloat(forexAmount),
      });

      if (response.data.code === "OK") {
        setForexAmount("");
        setQuote(null);
        setError(null);
        onExchangeSuccess();
        alert("환전이 완료되었습니다.");
      } else {
        // EXCHANGE_RATE_MISMATCH 에러인 경우 자동으로 환율 재조회 후 재시도
        if (response.data.code === "EXCHANGE_RATE_MISMATCH" && retryCount < 1) {
          setError("환율이 변경되었습니다. 최신 환율로 자동 재시도 중...");
          
          // 환율 정보 새로고침
          if (onRefreshExchangeRates) {
            try {
              await onRefreshExchangeRates();
              
              // 최신 환율 정보를 직접 조회하여 재시도
              try {
                const ratesResponse = await apiClient.get("/exchange-rates/latest");
                if (ratesResponse.data.code === "OK") {
                  const latestRates = ratesResponse.data.data;
                  const latestRate = latestRates.find((r: ExchangeRateData) => r.currency === selectedCurrency);
                  
                  if (latestRate) {
                    // 최신 환율 ID로 재시도
                    setTimeout(() => {
                      handleExchangeWithRateId(e, latestRate.exchangeRateId, retryCount + 1);
                    }, 100);
                    return;
                  }
                }
              } catch (rateError) {
                // 환율 조회 실패 시 exchangeRateMap에서 가져오기 시도
                const latestExchangeRateId = exchangeRateMap?.get(selectedCurrency);
                if (latestExchangeRateId) {
                  setTimeout(() => {
                    handleExchangeWithRateId(e, latestExchangeRateId, retryCount + 1);
                  }, 300);
                  return;
                }
              }
              
              setError("환율 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
            } catch (refreshError) {
              setError("환율 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
          } else {
            setError("환율이 변경되었습니다. 잠시 후 다시 시도해주세요.");
          }
        } else {
          setError(response.data.message || "환전에 실패했습니다.");
        }
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      
      if (errorData?.code === "EXCHANGE_RATE_MISMATCH" && retryCount < 1) {
        // 환율 정보 새로고침 후 재시도
        if (onRefreshExchangeRates) {
          try {
            setError("환율이 변경되었습니다. 최신 환율로 자동 재시도 중...");
            await onRefreshExchangeRates();
            
            // 최신 환율 정보를 직접 조회하여 재시도
            try {
              const ratesResponse = await apiClient.get("/exchange-rates/latest");
              if (ratesResponse.data.code === "OK") {
                const latestRates = ratesResponse.data.data;
                const latestRate = latestRates.find((r: ExchangeRateData) => r.currency === selectedCurrency);
                
                if (latestRate) {
                  // 최신 환율 ID로 재시도
                  setTimeout(() => {
                    handleExchangeWithRateId(e, latestRate.exchangeRateId, retryCount + 1);
                  }, 100);
                  return;
                }
              }
            } catch (rateError) {
              // 환율 조회 실패 시 exchangeRateMap에서 가져오기 시도
              const latestExchangeRateId = exchangeRateMap?.get(selectedCurrency);
              if (latestExchangeRateId) {
                setTimeout(() => {
                  handleExchangeWithRateId(e, latestExchangeRateId, retryCount + 1);
                }, 300);
                return;
              }
            }
            
            setError("환율 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
          } catch (refreshError) {
            setError("환율 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
        } else {
          setError("환율이 변경되었습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        const errorMessage = errorData?.message || "환전에 실패했습니다.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 환율 ID를 직접 받아서 환전하는 헬퍼 함수
  const handleExchangeWithRateId = async (e: FormEvent, rateId: number, retryCount = 0) => {
    if (!selectedCurrency || !forexAmount || parseFloat(forexAmount) <= 0) {
      setError("모든 필드를 올바르게 입력해주세요.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/orders", {
        exchangeRateId: rateId,
        fromCurrency,
        toCurrency,
        forexAmount: parseFloat(forexAmount),
      });

      if (response.data.code === "OK") {
        setForexAmount("");
        setQuote(null);
        setError(null);
        onExchangeSuccess();
        alert("환전이 완료되었습니다.");
      } else {
        setError(response.data.message || "환전에 실패했습니다.");
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "환전에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencyName = (currency: string) => {
    const names: Record<string, string> = {
      USD: "달러",
      JPY: "엔",
    };
    return names[currency] || currency;
  };

  const getCurrencyFlag = (currency: string) => {
    // 간단한 이모지 플래그 (실제로는 이미지나 아이콘 사용 가능)
    const flags: Record<string, string> = {
      USD: "🇺🇸",
      JPY: "🇯🇵",
    };
    return flags[currency] || "💰";
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
      <form onSubmit={handleExchange} className="space-y-6">
        {/* 통화 선택 드롭다운 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedCurrency} 환전하기
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setSelectedCurrency(e.target.value);
                setQuote(null);
                setForexAmount("");
              }}
              className="w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-4 py-4 pr-10 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 살래요 / 팔래요 탭 */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode("buy");
              setQuote(null);
              setForexAmount("");
            }}
            className={`flex-1 border-b-2 pb-3 text-center font-semibold transition-colors ${
              mode === "buy"
                ? "border-red-600 text-red-600"
                : "border-transparent text-blue-600 hover:border-gray-300"
            }`}
          >
            살래요
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("sell");
              setQuote(null);
              setForexAmount("");
            }}
            className={`flex-1 border-b-2 pb-3 text-center font-semibold transition-colors ${
              mode === "sell"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-red-600 hover:border-gray-300"
            }`}
          >
            팔래요
          </button>
        </div>

        {/* 매수/매도 금액 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === "buy" ? "매수 금액" : "매도 금액"}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={forexAmount}
              onChange={(e) => {
                const value = e.target.value;
                // 숫자와 소수점만 허용
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setForexAmount(value);
                }
              }}
              placeholder={mode === "buy" ? `${getCurrencyName(selectedCurrency)} 사기` : `${getCurrencyName(selectedCurrency)} 팔기`}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <span className="text-lg font-medium text-gray-600">
                {getCurrencyFlag(selectedCurrency)} {selectedCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* 화살표 아이콘 */}
        {forexAmount && parseFloat(forexAmount) > 0 && (
          <div className="flex justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* 필요 원화 / 받을 원화 */}
        {quote && (
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">
              {mode === "buy" ? "필요 원화" : "받을 원화"}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(() => {
                try {
                  return new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(quote.krwAmount);
                } catch (error) {
                  return (
                    new Intl.NumberFormat("ko-KR", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(quote.krwAmount) + " 원"
                  );
                }
              })()}
              <span className="ml-2 text-lg text-gray-600">필요해요</span>
            </div>
          </div>
        )}

        {/* 적용 환율 */}
        {quote && (
          <div className="text-center text-sm text-gray-600">
            적용 환율: 1 {selectedCurrency} = {quote.appliedRate.toLocaleString("ko-KR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} 원
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 환전하기 버튼 */}
        <button
          type="submit"
          disabled={loading || !quote || !forexAmount}
          className="w-full rounded-lg bg-gray-800 px-6 py-4 text-lg font-semibold text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "처리 중..." : "환전하기"}
        </button>
      </form>
    </div>
  );
}
