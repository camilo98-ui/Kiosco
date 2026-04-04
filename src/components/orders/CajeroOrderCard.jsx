import React, { useState, useEffect } from "react";
import { formatCOP } from "@/lib/constants";
import moment from "moment";

const STATUS_STYLES = {
  pendiente: {
    badge: { background: "#FFF3CC", color: "#B8860B", border: "1px solid #F5C842" },
    label: "Pendiente",
    borderColor: "#F5C842",
  },
  pagado_tarjeta: {
    badge: { background: "#FFE4F3", color: "#C41E6A", border: "1px solid #C41E6A" },
    label: "En preparación",
    borderColor: "#C41E6A",
  },
  listo: {
    badge: { background: "#E8F5E9", color: "#2E7D32", border: "1px solid #4CAF50" },
    label: "Listo para entregar",
    borderColor: "#4CAF50",
  },
  finalizado: {
    badge: { background: "#F0F0F0", color: "#999999", border: "1px solid #DDDDDD" },
    label: "Cobrado y facturado",
    borderColor: "#DDDDDD",
  },
};

export default function CajeroOrderCard({ order, onClick }) {
  const [elapsed, setElapsed] = useState(0);
  const [pressed, setPressed] = useState(false);

  const st = STATUS_STYLES[order.status] || STATUS_STYLES.pendiente;

  useEffect(() => {
    if (order.status === "finalizado") return;
    const interval = setInterval(() => {
      setElapsed(moment().diff(moment(order.created_date), "seconds"));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.created_date, order.status]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const visibleItems = order.items?.slice(0, 2) || [];
  const extraCount = (order.items?.length || 0) - 2;

  return (
    <div
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: "#FFFFFF",
        border: "0.5px solid #F0F0F0",
        borderLeft: `4px solid ${st.borderColor}`,
        borderRadius: 16,
        padding: 12,
        minHeight: 140,
        cursor: "pointer",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: pressed ? "0 1px 4px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {/* Número de pedido */}
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 48, fontWeight: 800, color: "#1A1A1A", lineHeight: 1, marginBottom: 2 }}>
        #{order.order_number}
      </div>

      {/* Badge de estado */}
      <div style={{
        display: "inline-flex", alignSelf: "flex-start",
        ...st.badge,
        borderRadius: 20, fontSize: 11, fontWeight: 700,
        padding: "4px 10px",
      }}>
        {st.label}
      </div>

      {/* Divisor */}
      <div style={{ height: "0.5px", background: "#F5F5F5", margin: "2px 0" }} />

      {/* Cliente */}
      <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>
        {order.customer_name}
      </p>

      {/* Ítems (máx 2) */}
      <div style={{ fontSize: 12, color: "#666666", lineHeight: 1.4 }}>
        {visibleItems.map((item, i) => (
          <p key={i} style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.quantity}× {item.product_name}
          </p>
        ))}
        {extraCount > 0 && (
          <p style={{ margin: 0, color: "#999" }}>+{extraCount} más...</p>
        )}
      </div>

      {/* Divisor */}
      <div style={{ height: "0.5px", background: "#F5F5F5", margin: "2px 0", marginTop: "auto" }} />

      {/* Total + tiempo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(order.total)}</span>
        {order.status !== "finalizado" && (
          <span style={{ fontSize: 11, color: "#999999" }}>{timeStr}</span>
        )}
      </div>
    </div>
  );
}