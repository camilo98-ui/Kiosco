import React, { useState, useEffect } from "react";
import { formatCOP, STATUS_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import moment from "moment";

export default function OrderCard({ order, actions }) {
  const [elapsed, setElapsed] = useState(0);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;

  useEffect(() => {
    if (order.status === "finalizado") return;
    const interval = setInterval(() => {
      setElapsed(moment().diff(moment(order.created_date), "seconds"));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.created_date, order.status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isOvertime = minutes >= 10 && order.status !== "finalizado";

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 transition-all ${isOvertime ? "border-destructive animate-pulse" : status.borderColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-foreground">#{order.order_number}</span>
          <Badge className={`${status.color} text-white text-xs font-bold`}>{status.label}</Badge>
          {order.payment_method && (
            <Badge variant="outline" className="text-xs border-border">
              {order.payment_method === "tarjeta" ? "💳" : "💵"}
            </Badge>
          )}
        </div>
        {order.status !== "finalizado" && (
          <div className={`flex items-center gap-1 text-xs font-mono font-black px-2 py-1 rounded-lg bg-muted ${isOvertime ? "text-destructive" : "text-muted-foreground"}`}>
            {isOvertime && <AlertTriangle className="w-3 h-3" />}
            <Clock className="w-3 h-3" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        )}
      </div>

      <p className="font-black text-base text-foreground">{order.customer_name}</p>

      <div className="mt-2 space-y-1">
        {order.items?.map((item, i) => (
          <div key={i} className="text-sm">
            <div className="flex justify-between text-foreground/80">
              <span>{item.quantity}× {item.product_name}</span>
              <span className="font-bold">{formatCOP(item.price * item.quantity)}</span>
            </div>
            {item.notes && (
              <p className="text-xs text-muted-foreground ml-4 italic">📝 {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-border flex justify-between font-black">
        <span className="text-muted-foreground text-sm">Total</span>
        <span className="text-primary text-base">{formatCOP(order.total)}</span>
      </div>

      {actions && <div className="mt-3 flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}