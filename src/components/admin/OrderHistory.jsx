import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { formatCOP, STATUS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import moment from "moment";

export default function OrderHistory() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 200),
  });

  const filtered = dateFilter
    ? orders.filter((o) => o.created_date && o.created_date.startsWith(dateFilter))
    : orders;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} pedidos encontrados
      </p>

      <div className="space-y-2">
        {filtered.map((order) => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
          return (
            <div key={order.id} className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-black">#{order.order_number}</span>
                  <Badge className={`${status.color} text-white text-[10px]`}>
                    {status.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {moment(order.created_date).format("HH:mm")}
                </span>
              </div>
              <p className="text-sm font-semibold">{order.customer_name}</p>
              <div className="text-xs text-muted-foreground mt-1">
                {order.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(", ")}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {order.payment_method === "tarjeta" ? "💳 Tarjeta" : "💵 Efectivo"}
                </span>
                <span className="font-bold text-primary">{formatCOP(order.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}