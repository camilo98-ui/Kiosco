import React, { useState, useEffect } from "react";
import { formatCOP } from "@/lib/constants";
import { CheckCircle, AlertTriangle } from "lucide-react";
import moment from "moment";

const STATUS_STYLES = {
  pendiente: {
    badge: { background: "#FFF3CC", color: "#B8860B", border: "1px solid #F5C842" },
    label: "Pendiente",
    borderColor: "#F5C842",
  },
  pagado_tarjeta: {
    badge: { background: "#FFE4F3", color: "#C41E6A", border: "1px solid #C41E6A" },
    label: "Pendiente por pagar",
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

// Parsea las notes en líneas legibles
// Formato: "Sabor: X | Chantilly: Y | Crack: Z | Extras: A, B"
function parseNotes(notes) {
  if (!notes) return [];
  return notes.split("|").map(s => s.trim()).filter(Boolean);
}

function OrderItem({ item }) {
  const lines = parseNotes(item.notes);
  return (
    <div style={{
      background: "#FAFAFA",
      border: "1px solid #F0F0F0",
      borderRadius: 10,
      padding: "8px 10px",
      marginBottom: 6,
    }}>
      {/* Nombre del producto en grande y claro */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: lines.length > 0 ? 5 : 0 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", flex: 1, lineHeight: 1.3 }}>
          {item.quantity > 1 && (
            <span style={{
              display: "inline-block", background: "#C41E6A", color: "#fff",
              borderRadius: 6, fontSize: 11, fontWeight: 800, padding: "1px 6px", marginRight: 6,
            }}>
              ×{item.quantity}
            </span>
          )}
          {item.product_name}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#C41E6A", flexShrink: 0 }}>
          {formatCOP(item.price * item.quantity)}
        </span>
      </div>

      {/* Personalización línea por línea */}
      {lines.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 2 }}>
          {lines.map((line, i) => {
            const [key, ...rest] = line.split(":");
            const value = rest.join(":").trim();
            return (
              <div key={i} style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#888", minWidth: 48, textTransform: "uppercase", lineHeight: 1.5, flexShrink: 0 }}>
                  {key.trim()}:
                </span>
                <span style={{ fontSize: 11, color: "#444", lineHeight: 1.4, fontWeight: 500 }}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CajeroOrderCard({ order, onFinalize }) {
  const [elapsed, setElapsed] = useState(0);

  const st = STATUS_STYLES[order.status] || STATUS_STYLES.pendiente;
  const isOvertime = elapsed > 300;
  const isPagoTarjeta = order.status === "pagado_tarjeta";

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

  const canFinalize = order.status === "pendiente" || order.status === "pagado_tarjeta";
  
  const handleCardClick = () => {
    if (canFinalize) {
      onFinalize(order);
    }
  };

  return (
    <div onClick={handleCardClick} style={{
      background: "#FFFFFF",
      border: "0.5px solid #EBEBEB",
      borderLeft: `4px solid ${isPagoTarjeta ? "#FF4444" : (isOvertime ? "#FF6B6B" : st.borderColor)}`,
      borderRadius: 16,
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      cursor: canFinalize ? "pointer" : "default",
      transition: "all 0.2s",
      minWidth: 300,
    }} onMouseEnter={(e) => { if (canFinalize) e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"; }} onMouseLeave={(e) => { if (canFinalize) e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}>
      {/* Número + tiempo */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, color: "#1A1A1A", lineHeight: 1 }}>
          #{order.order_number}
        </div>
        {order.status !== "finalizado" && (
          <span style={{ fontSize: 12, color: isOvertime ? "#FF6B6B" : (isPagoTarjeta ? "#FF4444" : "#AAAAAA"), fontWeight: isOvertime || isPagoTarjeta ? 700 : 600, paddingTop: 4 }}>{timeStr}</span>
        )}
      </div>

      {/* Badge de estado + badge datáfono */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex", alignSelf: "flex-start",
          background: isPagoTarjeta ? "#FFCCCC" : (isOvertime ? "#FFE0E0" : st.badge.background),
          color: isPagoTarjeta ? "#FF4444" : (isOvertime ? "#FF6B6B" : st.badge.color),
          border: isPagoTarjeta ? "1px solid #FF4444" : (isOvertime ? "1px solid #FF6B6B" : st.badge.border),
          borderRadius: 20, fontSize: 11, fontWeight: 700,
          padding: "3px 10px",
        }}>
          {isPagoTarjeta ? "Pendiente por pagar" : (isOvertime ? "⏰ Pasó 5 min" : st.label)}
        </div>
        {order.payment_method === "tarjeta" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "#E8F0FF", color: "#1A56DB", border: "1px solid #1A56DB",
            borderRadius: 20, fontSize: 11, fontWeight: 700,
            padding: "3px 10px",
          }}>
            💳 Datáfono
          </div>
        )}
      </div>

      {/* Cliente */}
      <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
        👤 {order.customer_name}
      </p>

      <div style={{ height: "0.5px", background: "#F0F0F0" }} />

      {/* Ítems con detalle completo — Mejorado para desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {order.items?.map((item, i) => (
          <div key={i} style={{
            background: "#FAFAFA",
            border: "1px solid #F0F0F0",
            borderRadius: 8,
            padding: "8px 10px",
          }}>
            {/* Nombre del producto */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, marginBottom: item.notes ? 4 : 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#1A1A1A", flex: 1, lineHeight: 1.2 }}>
                {item.quantity > 1 && (
                  <span style={{
                    display: "inline-block", background: "#C41E6A", color: "#fff",
                    borderRadius: 4, fontSize: 10, fontWeight: 800, padding: "1px 4px", marginRight: 4,
                  }}>
                    ×{item.quantity}
                  </span>
                )}
                {item.product_name}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#C41E6A", flexShrink: 0, whiteSpace: "nowrap" }}>
                {formatCOP(item.price * item.quantity)}
              </span>
            </div>

            {/* Personalización */}
             {item.notes && (
               <div style={{ fontSize: 9, color: "#666", lineHeight: 1.3 }}>
                 {item.notes.split("|").map((line, j) => {
                   const [key, ...rest] = line.split(":");
                   const value = rest.join(":").trim();
                   const isSabor = key.trim().toLowerCase().includes("sabor");
                   const isAdicion = key.trim().toLowerCase().includes("adición");
                   return (
                     <p key={j} style={{ margin: "1px 0", padding: "1px 0", color: isAdicion ? "#E91B8B" : "#666", fontStyle: "italic" }}>
                       {key.trim()}: <strong>{value}</strong>
                     </p>
                   );
                 })}
               </div>
             )}
          </div>
        ))}
      </div>

      <div style={{ height: "0.5px", background: "#F0F0F0" }} />

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#999" }}>Total</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(order.total)}</span>
      </div>

      {/* Botón directo */}
      {canFinalize && (
        <button
          onClick={() => onFinalize(order)}
          style={{
            width: "100%", height: 44, borderRadius: 12,
            background: order.status === "pendiente" ? "#4CAF50" : "#2196F3",
            color: "#fff",
            fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {order.status === "pendiente"
            ? <><CheckCircle size={15} /> Cobrado y facturado</>
            : <><AlertTriangle size={15} /> Facturado en POS</>
          }
        </button>
      )}
    </div>
  );
}