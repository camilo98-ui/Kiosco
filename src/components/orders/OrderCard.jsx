import React, { useState, useEffect } from "react";
import { formatCOP, STATUS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import moment from "moment";

export default function OrderCard({ order, actions }) {
  const [elapsed, setElapsed] = useState(0);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;

  useEffect(() => {
    if (order.status === "finalizado") return;
    const interval = setInterval(() => {
      const diff = moment().diff(moment(order.created_date), "seconds");
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.created_date, order.status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isOvertime = minutes >= 10 && order.status !== "finalizado";

  return (
    <div
      className={`bg-card rounded-2xl border-2 p-4 transition-all ${
        isOvertime ? "border-destructive animate-pulse" : status.borderColor
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black">#{order.order_number}</span>
          <Badge className={`${status.color} text-white text-xs`}>{status.label}</Badge>
        </div>
        {order.status !== "finalizado" && (
          <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isOvertime ? "text-destructive" : "text-muted-foreground"}`}>
            {isOvertime && <AlertTriangle className="w-4 h-4" />}
            <Clock className="w-4 h-4" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        )}
      </div>

      <p className="font-bold text-lg">{order.customer_name}</p>

      <div className="mt-2 space-y-1">
        {order.items?.map((item, i) => (
          <div key={i} className="text-sm">
            <div className="flex justify-between">
              <span>{item.quantity}x {item.product_name}</span>
              <span className="font-semibold">{formatCOP(item.price * item.quantity)}</span>
            </div>
            {item.notes && (
              <p className="text-xs text-muted-foreground ml-4 italic">📝 {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border mt-3 pt-2 flex justify-between font-black">
        <span>Total</span>
        <span className="text-primary">{formatCOP(order.total)}</span>
      </div>

      {actions && <div className="mt-3 flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}