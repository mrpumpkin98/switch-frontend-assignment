"use client";

import { useRouter } from "next/navigation";
import { OrderHistory } from "../../exchange/types";

interface OrderHistoryListProps {
  orders: OrderHistory[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function OrderHistoryList({
  orders,
  loading,
  error,
  onRefresh,
  onLogout,
}: OrderHistoryListProps) {
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
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
                className="text-sm font-medium text-gray-900"
              >
                환전 내역
              </button>
              <button
                onClick={onLogout}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Log out
              </button>
            </div>
          </div>
        </nav>

        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-gray-600">로딩 중...</div>
          </div>
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
              className="text-sm font-medium text-gray-900"
            >
              환전 내역
            </button>
            <button
              onClick={onLogout}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">환전 내역</h1>
          <button
            onClick={onRefresh}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            새로고침
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 환전 내역 목록 */}
        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">환전 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    주문 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    출발 통화
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    도착 통화
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    환전 금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    적용 환율
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    주문 일시
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(order.fromAmount, order.fromCurrency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(order.toAmount, order.toCurrency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.fromAmount, order.fromCurrency)} → {formatCurrency(order.toAmount, order.toCurrency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {order.appliedRate.toLocaleString("ko-KR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.orderedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

