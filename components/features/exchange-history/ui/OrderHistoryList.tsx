"use client";

import { OrderHistory } from "../../exchange/types";

interface OrderHistoryListProps {
   orders: OrderHistory[];
   loading: boolean;
   error: string | null;
   onRefresh: () => void;
}

export default function OrderHistoryList({ orders, loading, error, onRefresh }: OrderHistoryListProps) {
   const formatCurrency = (amount: number, currency: string) => {
      try {
         return new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: currency === "KRW" ? 0 : 2,
            maximumFractionDigits: currency === "KRW" ? 0 : 2,
         }).format(amount);
      } catch (error) {
         return new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
         }).format(amount);
      }
   };

   const formatDate = (dateString: string) => {
      try {
         const date = new Date(dateString);
         const year = date.getFullYear();
         const month = String(date.getMonth() + 1).padStart(2, "0");
         const day = String(date.getDate()).padStart(2, "0");
         const hours = String(date.getHours()).padStart(2, "0");
         const minutes = String(date.getMinutes()).padStart(2, "0");
         const seconds = String(date.getSeconds()).padStart(2, "0");
         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
         return dateString;
      }
   };

   if (loading) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <div className="text-lg text-gray-600">로딩 중...</div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white">
         {/* 메인 컨텐츠 */}
         <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">환전 내역</h1>
               <p className="text-sm text-gray-600">환전 내역을 확인하실 수 있어요.</p>
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
               <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              거래 ID
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              거래 일시
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              매수 금액
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              채결 환율
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              매도 금액
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.map((order) => (
                           <tr
                              key={order.orderId}
                              className="hover:bg-gray-50"
                           >
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{order.orderId}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                 {formatDate(order.orderedAt)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                 {formatCurrency(order.fromAmount, order.fromCurrency)}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                 {order.appliedRate.toLocaleString("ko-KR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                 })}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                 {formatCurrency(order.toAmount, order.toCurrency)}
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
