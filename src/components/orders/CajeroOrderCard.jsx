import React, { useState, useEffect } from "react";
import { formatCOP } from "@/lib/constants";
import { CreditCard, Smartphone, Zap } from "lucide-react";
import moment from "moment";
import ProductDetailLine from "@/components/menu/ProductDetailLine.jsx";

const FONT = "'Poppins', -apple-system, sans-serif";
const MAGENTA = "#C41E6A";
const MAGENTA_LIGHT = "#F9E6F0";
const MAGENTA_BORDER = "#F0C4DA";

function getTimeState(elapsedSeconds) {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return "normal";
  if (mins < 10) return "waiting";
  return "urgent";
}

function getProgressPct(elapsedSeconds) {
  return Math.min(100, (elapsedSeconds / 600) * 100);
}

// ─── Card Normal (pedidos del menú cliente) ──────────────────────────────────
export function NormalOrderCard({ order, onFinalize }) {
  const [elapsed, setElapsed] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const isFinalized = order.status === "finalizado";

  useEffect(() => {
    if (isFinalized) return;
    const tick = () => setElapsed(moment().diff(moment(order.created_date), "seconds"));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order.created_date, isFinalized]);

  const timeState = isFinalized ? "normal" : getTimeState(elapsed);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const pct = isFinalized ? 0 : getProgressPct(elapsed);
  const isUrgent = timeState === "urgent" && !isFinalized;
  const isWaiting = timeState === "waiting" && !isFinalized;

  const progressColor = isUrgent ? "#EF4444" : isWaiting ? "#F59E0B" : MAGENTA;
  const tickerColor = isUrgent ? "#EF4444" : isWaiting ? "#D97706" : "#BBA8B0";

  const handleClick = () => {
    if (isFinalized) return;
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      onFinalize(order);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: isUrgent ? "#FFF5F5" : "#FFFFFF",
        border: `1.5px solid ${isUrgent ? "#FFCDD2" : isWaiting ? "#FFE082" : MAGENTA_BORDER}`,
        borderRadius: 22,
        overflow: "hidden",
        fontFamily: FONT,
        cursor: isFinalized ? "default" : "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: isUrgent
          ? "0 0 0 3px rgba(239,68,68,0.12), 0 6px 24px rgba(239,68,68,0.08)"
          : `0 4px 20px rgba(196,30,106,0.08)`,
        position: "relative",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={e => { if (!isFinalized) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top color band */}
      <div style={{
        height: 5,
        background: isUrgent
          ? "linear-gradient(90deg, #EF4444, #FF6B6B)"
          : isWaiting
          ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
          : `linear-gradient(90deg, ${MAGENTA}, #FF6EB4)`,
      }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.35)", transition: "width 1s linear" }} />
      </div>

      {/* Confirm overlay */}
      {confirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, borderRadius: 22,
          background: `linear-gradient(135deg, ${MAGENTA}, #FF6EB4)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontSize: 40 }}>✅</span>
          <p style={{ color: "#fff", fontSize: 17, fontWeight: 900, margin: 0, fontFamily: FONT }}>¡Toca para confirmar!</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0 }}>Cobrado y facturado</p>
        </div>
      )}

      <div style={{ padding: "16px 18px 18px" }}>
        {/* Número + timer */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{
              fontSize: 38, fontWeight: 900, margin: 0, lineHeight: 1,
              letterSpacing: "-2px", color: MAGENTA,
            }}>
              #{order.order_number}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1A22", margin: "5px 0 0" }}>
              {order.customer_name}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {isFinalized ? (
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: "#ECFDF5", color: "#16A34A",
                borderRadius: 20, padding: "5px 14px",
                border: "1px solid #BBF7D0",
              }}>✓ Cobrado</span>
            ) : (
              <>
                <div style={{
                  background: isUrgent ? "#FEE2E2" : isWaiting ? "#FFFBEB" : MAGENTA_LIGHT,
                  border: `1px solid ${isUrgent ? "#FECACA" : isWaiting ? "#FDE68A" : MAGENTA_BORDER}`,
                  borderRadius: 14, padding: "6px 12px", textAlign: "center",
                }}>
                  <span style={{
                    fontSize: 20, fontWeight: 900, display: "block",
                    color: tickerColor, fontVariantNumeric: "tabular-nums", lineHeight: 1,
                    letterSpacing: "-0.5px",
                  }}>
                    {mins}:{String(secs).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: tickerColor, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {isUrgent ? "⚠ URGENTE" : isWaiting ? "EN ESPERA" : "min"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider dashed */}
        <div style={{ borderTop: "1.5px dashed #F0E4EA", margin: "10px 0" }} />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1A0A10", lineHeight: 1.35 }}>
                  {item.quantity > 1 && (
                    <span style={{
                      display: "inline-block", background: MAGENTA, color: "#fff",
                      borderRadius: 6, fontSize: 9, fontWeight: 800, padding: "1px 6px", marginRight: 5,
                    }}>×{item.quantity}</span>
                  )}
                  {item.product_name}
                </span>
                <ProductDetailLine item={item} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: MAGENTA, flexShrink: 0 }}>
                {formatCOP(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: MAGENTA_LIGHT, borderRadius: 14, padding: "10px 14px", marginTop: 12,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.7 }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: MAGENTA, letterSpacing: "-0.5px" }}>
            {formatCOP(order.total)}
          </span>
        </div>

        {!isFinalized && (
          <p style={{ textAlign: "center", fontSize: 9, color: "#D4A8BE", margin: "10px 0 0", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
            toca en cualquier parte para cobrar
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Card Datafono (Popsy premium, visualmente distinto) ──────────────────────
export function DatafonoOrderCard({ order, onFinalize }) {
  const [elapsed, setElapsed] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const isFinalized = order.status === "finalizado";

  useEffect(() => {
    if (isFinalized) return;
    const tick = () => setElapsed(moment().diff(moment(order.created_date), "seconds"));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order.created_date, isFinalized]);

  const timeState = isFinalized ? "normal" : getTimeState(elapsed);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const pct = isFinalized ? 0 : getProgressPct(elapsed);
  const isUrgent = timeState === "urgent" && !isFinalized;
  const isWaiting = timeState === "waiting" && !isFinalized;

  const handleClick = () => {
    if (isFinalized) return;
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      onFinalize(order);
    }
  };

  const tickerColor = isUrgent ? "#EF4444" : isWaiting ? "#D97706" : "rgba(255,255,255,0.95)";

  return (
    <div
      onClick={handleClick}
      style={{
        background: isUrgent
          ? "linear-gradient(145deg, #7A0A2A 0%, #C41E6A 60%, #FF6EB4 100%)"
          : isWaiting
          ? "linear-gradient(145deg, #7A4A00 0%, #C41E6A 60%, #FF6EB4 100%)"
          : "linear-gradient(145deg, #8B0A3E 0%, #C41E6A 55%, #FF6EB4 100%)",
        border: `1.5px solid ${isUrgent ? "rgba(255,100,100,0.5)" : "rgba(255,180,220,0.3)"}`,
        borderRadius: 22,
        overflow: "hidden",
        fontFamily: FONT,
        cursor: isFinalized ? "default" : "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: isUrgent
          ? "0 0 0 3px rgba(239,68,68,0.2), 0 8px 32px rgba(196,30,106,0.4)"
          : "0 8px 32px rgba(196,30,106,0.35), 0 2px 8px rgba(196,30,106,0.2)",
        position: "relative",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={e => { if (!isFinalized) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Shimmer top line */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.25)" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: isUrgent ? "#FF4444" : "rgba(255,255,255,0.6)",
          transition: "width 1s linear",
        }} />
      </div>

      {/* Confirm overlay */}
      {confirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, borderRadius: 22,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontSize: 44 }}>✅</span>
          <p style={{ color: "#fff", fontSize: 17, fontWeight: 900, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>¡Toca para confirmar!</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>Cobrado y facturado</p>
        </div>
      )}

      <div style={{ padding: "14px 18px 18px" }}>

        {/* Datafono badge */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 20, padding: "4px 12px",
          }}>
            <CreditCard size={10} color="#fff" />
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px" }}>Datáfono · Tarjeta</span>
          </span>
        </div>

        {/* Número + timer */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{
              fontSize: 40, fontWeight: 900, margin: 0, lineHeight: 1,
              letterSpacing: "-2px", color: "#FFFFFF",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}>
              #{order.order_number}
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "5px 0 0" }}>
              {order.customer_name}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            {isFinalized ? (
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: "rgba(255,255,255,0.2)", color: "#fff",
                borderRadius: 20, padding: "5px 14px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}>✓ Cobrado</span>
            ) : (
              <div style={{
                background: isUrgent ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.18)",
                border: `1px solid ${isUrgent ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.3)"}`,
                borderRadius: 14, padding: "6px 12px", textAlign: "center",
              }}>
                <span style={{
                  fontSize: 22, fontWeight: 900, display: "block",
                  color: tickerColor, fontVariantNumeric: "tabular-nums", lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}>
                  {mins}:{String(secs).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {isUrgent ? "⚠ URGENTE" : isWaiting ? "EN ESPERA" : "min"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", margin: "10px 0" }} />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}>
                  {item.quantity > 1 && (
                    <span style={{
                      display: "inline-block", background: "rgba(255,255,255,0.25)", color: "#fff",
                      borderRadius: 6, fontSize: 9, fontWeight: 800, padding: "1px 6px", marginRight: 5,
                    }}>×{item.quantity}</span>
                  )}
                  {item.product_name}
                </span>
                <ProductDetailLine item={item} darkMode />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                {formatCOP(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 14, padding: "10px 14px", marginTop: 14,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
            {formatCOP(order.total)}
          </span>
        </div>

        {!isFinalized && (
          <p style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "10px 0 0", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
            toca en cualquier parte para cobrar
          </p>
        )}
      </div>
    </div>
  );
}

// ── Export default ────────────────────────────────────────────────────────────
export default function CajeroOrderCard({ order, onFinalize }) {
  const isDatafono = order.payment_method === "tarjeta";
  if (isDatafono) return <DatafonoOrderCard order={order} onFinalize={onFinalize} />;
  return <NormalOrderCard order={order} onFinalize={onFinalize} />;
}