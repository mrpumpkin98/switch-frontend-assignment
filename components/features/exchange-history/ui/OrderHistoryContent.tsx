"use client";

import { OrderHistory } from "../../exchange/types";
import PageTitle from "@/components/shared/ui/PageTitle";
import Table from "@/components/shared/ui/Table";
import EmptyState from "./EmptyState";
import { formatCurrency, formatDate } from "@/components/shared/utils/formatters";

interface OrderHistoryContentProps {
   orders: OrderHistory[];
}

export default function OrderHistoryContent({ orders }: OrderHistoryContentProps) {
   return (
      <div className="min-h-screen bg-white">
         {/* 메인 컨텐츠 */}
         <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6">
               <PageTitle
                  title="환전 내역"
                  description="환전 내역을 확인하실 수 있어요."
               />
            </div>

            {/* 환전 내역 목록 */}
            {orders.length === 0 ? (
               <EmptyState />
            ) : (
               <Table
                  columns={[
                     { key: "orderId", label: "거래 ID" },
                     { key: "orderedAt", label: "거래 일시", className: "text-gray-600" },
                     { key: "fromAmount", label: "매수 금액" },
                     { key: "appliedRate", label: "채결 환율", className: "text-gray-600" },
                     { key: "toAmount", label: "매도 금액" },
                  ]}
                  data={orders}
                  renderCell={(column, row) => {
                     if (column.key === "orderedAt") {
                        return <span className="text-gray-600">{formatDate(row.orderedAt)}</span>;
                     }
                     if (column.key === "fromAmount") {
                        return formatCurrency(row.fromAmount, row.fromCurrency);
                     }
                     if (column.key === "appliedRate") {
                        return (
                           <span className="text-gray-600">
                              {row.appliedRate.toLocaleString("ko-KR", {
                                 minimumFractionDigits: 2,
                                 maximumFractionDigits: 2,
                              })}
                           </span>
                        );
                     }
                     if (column.key === "toAmount") {
                        return formatCurrency(row.toAmount, row.toCurrency);
                     }
                     return row[column.key];
                  }}
               />
            )}
         </div>
      </div>
   );
}
