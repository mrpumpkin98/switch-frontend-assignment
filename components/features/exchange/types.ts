// 지갑 타입
export interface Wallet {
  walletId: number;
  currency: string; // 통화 코드 (KRW, USD, JPY 등)
  balance: number; // 잔액
}

// 지갑 응답 타입
export interface WalletsResponse {
  totalKrwBalance: number;
  wallets: Wallet[];
}

// 환율 정보 타입
export interface ExchangeRateData {
  exchangeRateId: number;
  currency: string; // 통화 코드
  rate: number; // 환율 (1 단위당 원화)
  changePercentage: number; // 변동률
  applyDateTime: string; // 적용 일시
}

// 환전 견적 타입
export interface ExchangeQuote {
  krwAmount: number; // KRW 금액
  appliedRate: number; // 적용된 환율
}

// 환전 요청 타입
export interface ExchangeOrder {
  exchangeRateId: number; // 환율 ID
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number; // 외화 금액
}

// 환전 내역 타입
export interface OrderHistory {
  orderId: number;
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  appliedRate: number;
  orderedAt: string;
}

