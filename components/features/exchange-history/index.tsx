"use client";

import OrderHistoryContent from "./ui/OrderHistoryContent";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import { useOrderHistory } from "./hooks/useOrderHistory";

export default function ExchangeHistoryPage() {
   const { orders, loading, error, fetchOrders } = useOrderHistory();

   if (loading) {
      return <LoadingState />;
   }

   if (error) {
      return <ErrorState message={error} />;
   }

   return <OrderHistoryContent orders={orders} />;
}
