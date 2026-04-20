import React, { useState, useEffect } from "react";
import { formatCOP } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import moment from "moment";
import ProductDetailLine from "@/components/menu/ProductDetailLine.jsx";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";
const MAGENTA = "#C41E6A";

function getTimeState(elapsedSeconds) {
  const mins = elapsedSeconds / 60;
  if (mins < 10) return "normal";
  return "urgent";
}

function getCardStyle(status, timeState) {
  if (status === "finalizado") return { background: "#fff", border: "1px solid #eee" };
  if (timeState === "urgent") return { background: "#FFF5F5", border: "1px solid #FCA5A5" };
  return { background: "#fff", border: "1px solid #eee" };
}

function getProgressColor(timeState) {
  if (timeState === "urgent") return "#EF4444";
  return "#22C55E";
}

function getProgressWidth(elapsedSeconds) {
  return Math.min(100, (elapsedSeconds / 600) * 100);
}

// Cap display/visual time to 10 minutes max (600s)
function capElapsed(elapsedSeconds) {
  return Math.min(elapsedSeconds, 600);
}

function TimeBadge({ elapsedSeconds }) {
  // Display capped at 10:00, but real time used for state
  const displaySecs = Math.min(elapsedSeconds, 600);
  const mins = Math.floor(displaySecs / 60);
  const secs = displaySecs % 60;
  const timeStr = elapsedSeconds >= 600 ? "10:00" : `${mins}:${String(secs).padStart(2, "0")}`;
  const state = getTimeState(elapsedSeconds);

  const badgeStyle = state === "normal"
    ? { background: "#ECFDF5", color: "#059669" }
    : { background: "#FEE2E2", color: "#DC2626" };

  const label = state === "normal" ? `${mins} min` : `⚠️ 10+ min`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
      <span style={{
        fontFamily: FONT, fontSize: 15, fontWeight: 700,
        color: state === "urgent" ? "#DC2626" : "#555",
        letterSpacing: "0.5px", fontVariantNumeric: "tabular-nums",
      }}>{timeStr}</span>
      <span style={{
        ...badgeStyle,
        fontSize: 10, fontWeight: 700, borderRadius: 20,
        padding: "2px 8px", fontFamily: FONT,
      }}>{label}</span>
    </div>
  );
}

function ClientAvatar({ name }) {
  const initials = name ? name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() : "?";
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: MAGENTA, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 800, fontFamily: FONT,
    }}>{initials}</div>
  );
}

export default function CajeroOrderCard({ order, onFinalize }) {
  const [elapsed, setElapsed] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (order.status === "finalizado") return;
    const calc = () => Math.max(0, moment().diff(moment(order.created_date), "seconds"));
    const interval = setInterval(() => setElapsed(calc()), 1000);
    setElapsed(calc());
    return () => clearInterval(interval);
  }, [order.created_date, order.status]);

  useEffect(() => {
    if (order.status === "finalizado") return;
    const timeState = getTimeState(elapsed);
    if (timeState === "urgent") {
      const t = setInterval(() => setPulse(p => !p), 2000);
      return () => clearInterval(t);
    } else {
      setPulse(false);
    }
  }, [elapsed, order.status]);

  const timeState = order.status === "finalizado" ? "normal" : getTimeState(elapsed);
  const cardStyle = getCardStyle(order.status, timeState);
  const progressColor = getProgressColor(timeState);
  const progressWidth = order.status === "finalizado" ? 0 : getProgressWidth(elapsed);

  const canFinalize = order.status === "pendiente" || order.status === "pagado_tarjeta";
  const isFinalized = order.status === "finalizado";

  const urgentShadow = timeState === "urgent" && !isFinalized
    ? (pulse ? "0 0 0 6px rgba(239,68,68,0.08)" : "0 0 0 0px rgba(239,68,68,0)")
    : "none";

  return (
    <div style={{
      ...cardStyle,
      borderRadius: 18,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: FONT,
      boxShadow: urgentShadow,
      transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      position: "relative",
      height: "100%",
    }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: "#F3F3F3", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${progressWidth}%`,
          background: progressColor,
          transition: "width 1s linear, background 0.3s",
        }} />
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>

        {/* Top row: order number centrado + timer en esquina */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40 }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: MAGENTA, lineHeight: 1, fontFamily: FONT }}>
            #{order.order_number}
          </span>
          <div style={{ position: "absolute", right: 0, top: 0 }}>
            {!isFinalized && <TimeBadge elapsedSeconds={elapsed} />}
            {isFinalized && (
              <span style={{ fontSize: 11, fontWeight: 700, background: "#F0F0F0", color: "#999", borderRadius: 20, padding: "3px 10px" }}>
                ✅ Cobrado
              </span>
            )}
          </div>
        </div>

        {/* Cliente */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ClientAvatar name={order.customer_name} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{order.customer_name}</span>
          {order.payment_method === "tarjeta" && (
            <span style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 700,
              background: MAGENTA, color: "#fff",
              borderRadius: 20, padding: "2px 10px",
            }}>💳 Tarjeta</span>
          )}
        </div>

        {/* Separador */}
        <div style={{ height: 1, background: "#F5F5F5" }} />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {order.items?.map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, flex: 1 }}>
                  {item.quantity > 1 && (
                    <span style={{ display: "inline-block", background: MAGENTA, color: "#fff", borderRadius: 6, fontSize: 13, fontWeight: 800, padding: "1px 7px", marginRight: 6 }}>
                      ×{item.quantity}
                    </span>
                  )}
                  {item.product_name}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: MAGENTA, flexShrink: 0 }}>{formatCOP(item.price * item.quantity)}</span>
              </div>
              <ProductDetailLine item={item} />
            </div>
          ))}
        </div>

        {/* Separador */}
        <div style={{ height: 1, background: "#F5F5F5" }} />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "1px" }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#1A1A1A" }}>{formatCOP(order.total)}</span>
        </div>

        {/* Botón principal */}
        {canFinalize ? (
          <button
            onClick={() => onFinalize(order)}
            style={{
              width: "100%", height: 44, borderRadius: 12,
              background: "#22C55E", color: "#fff",
              fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: FONT, transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <CheckCircle size={15} /> ✅ Cobrado y facturado
          </button>
        ) : (
          <button disabled style={{
            width: "100%", height: 44, borderRadius: 12,
            background: "#F0F0F0", color: "#BBB",
            fontSize: 13, fontWeight: 700, border: "none", cursor: "not-allowed",
            fontFamily: FONT,
          }}>
            ✅ Cobrado y facturado
          </button>
        )}
      </div>
    </div>
  );
}