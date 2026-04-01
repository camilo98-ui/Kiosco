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
      const diff = moment().diff(moment(order.created_date), "seconds");
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.created_date, order.status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isOvertime = minutes >= 10 && order.status !== "finalizado";

  const borderStyle = isOvertime
    ? { borderColor: "hsl(var(--destructive))", boxShadow: "0 0 16px hsla(0,84%,60%,0.3)" }
    : order.status === "pendiente"
    ? { borderColor: "hsla(42,100%,55%,0.5)", boxShadow: "0 0 10px hsla(42,100%,55%,0.12)" }
    : order.status === "pagado_tarjeta"
    ? { borderColor: "hsla(210,90%,60%,0.5)", boxShadow: "0 0 10px hsla(210,90%,60%,0.15)" }
    : { borderColor: "hsla(162,72%,48%,0.4)", boxShadow: "0 0 10px hsla(162,72%,48%,0.1)" };

  return (
    <div
      className={`rounded-2xl border-2 p-4 transition-all ${isOvertime ? "animate-pulse" : ""}`}
      style={{ background: "hsl(var(--card))", ...borderStyle }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-black px-3 py-1 rounded-xl"
            style={{
              background: order.status === "pendiente"
                ? "hsla(42,100%,55%,0.15)"
                : order.status === "pagado_tarjeta"
                ? "hsla(210,90%,60%,0.15)"
                : "hsla(162,72%,48%,0.15)",
              color: order.status === "pendiente"
                ? "hsl(42,100%,60%)"
                : order.status === "pagado_tarjeta"
                ? "hsl(210,90%,65%)"
                : "hsl(162,72%,55%)"
            }}
          >
            #{order.order_number}
          </span>
          <Badge
            className="text-white text-xs font-bold"
            style={{
              background: order.status === "pendiente"
                ? "hsl(42,100%,45%)"
                : order.status === "pagado_tarjeta"
                ? "hsl(210,90%,50%)"
                : "hsl(162,72%,38%)"
            }}
          >
            {status.label}
          </Badge>
          {order.payment_method && (
            <Badge variant="outline" className="text-xs">
              {order.payment_method === "tarjeta" ? "💳" : "💵"}
            </Badge>
          )}
        </div>
        {order.status !== "finalizado" && (
          <div className={`flex items-center gap-1 text-xs font-mono font-black px-2 py-1 rounded-lg ${
            isOvertime ? "text-destructive" : "text-muted-foreground"
          }`}
            style={isOvertime ? { background: "hsla(0,84%,60%,0.12)" } : { background: "hsl(var(--muted))" }}
          >
            {isOvertime && <AlertTriangle className="w-3 h-3" />}
            <Clock className="w-3 h-3" />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        )}
      </div>

      <p className="font-black text-base text-foreground">{order.customer_name}</p>

      {/* Items */}
      <div className="mt-2 space-y-1">
        {order.items?.map((item, i) => (
          <div key={i} className="text-sm">
            <div className="flex justify-between text-foreground/90">
              <span>{item.quantity}× {item.product_name}</span>
              <span className="font-bold">{formatCOP(item.price * item.quantity)}</span>
            </div>
            {item.notes && (
              <p className="text-xs text-muted-foreground ml-4 italic">📝 {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-3 pt-2 border-t border-border/60 flex justify-between font-black">
        <span className="text-muted-foreground text-sm">Total</span>
        <span className="text-primary text-base">{formatCOP(order.total)}</span>
      </div>

      {actions && <div className="mt-3 flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}