import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import DaySummary from "@/components/orders/DaySummary";

export default function AdminStats() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 200),
  });

  return <DaySummary orders={orders} />;
}