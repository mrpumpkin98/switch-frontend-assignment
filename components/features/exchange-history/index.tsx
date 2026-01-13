"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "@/components/shared/hooks/useApiClient";
import { useAuth } from "@/components/shared/hooks/useAuth";
import { OrderHistory } from "../exchange/types";
import OrderHistoryList from "./ui/OrderHistoryList";

export default function ExchangeHistoryPage() {
  const apiClient = useApiClient();
  const { logout } = useAuth();
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 환전 내역 조회
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/orders");

      if (response.data.code === "OK") {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } else {
        setError(response.data.message || "환전 내역을 불러오는데 실패했습니다.");
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError("환전 내역을 불러오는데 실패했습니다.");
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderHistoryList
      orders={orders}
      loading={loading}
      error={error}
      onRefresh={fetchOrders}
      onLogout={logout}
    />
  );
}

