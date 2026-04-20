import React, { useState, useEffect } from "react";
import { formatCOP } from "@/lib/constants";
import { CreditCard, Smartphone } from "lucide-react";
import moment from "moment";
import ProductDetailLine from "@/components/menu/ProductDetailLine.jsx";

const FONT = "'Poppins', -apple-system, sans-serif";

function getTimeState(elapsedSeconds) {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return "normal";
  if (mins < 10) return "waiting";
  return "urgent";
}

function getProgressPct(elapsedSeconds) {
  return Math.min(100, (elapsedSeconds / 600) * 100); // 10 min max
}

// ── Card normal (menu cliente) ────────────────────────────────────────────────
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

  const bgColor = isUrgent ? "#FFF2F2" : isWaiting ? "#FFFCF0" : "#FFFFFF";
  const borderColor = isUrgent ? "#FFBABA" : isWaiting ? "#FFE082" : "#ECECEC";
  const progressColor = isUrgent ? "#EF4444" : isWaiting ? "#F59E0B" : "#22C55E";
  const tickerColor = isUrgent ? "#EF4444" : isWaiting ? "#D97706" : "#9CA3AF";

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
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: FONT,
        cursor: isFinalized ? "default" : "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: isUrgent
          ? "0 0 0 3px rgba(239,68,68,0.15), 0 4px 16px rgba(239,68,68,0.1)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        position: "relative",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={e => { if (!isFinalized) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Progress bar */}
      <div style={{ height: 3, background: "#F0F0F0" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: progressColor, transition: "width 1s linear, background 0.3s" }} />
      </div>

      {/* Confirm overlay */}
      {confirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(34,197,94,0.92)", borderRadius: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 6,
        }}>
          <span style={{ fontSize: 36 }}>✅</span>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>Toca para confirmar</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0 }}>Cobrado y facturado</p>
        </div>
      )}

      <div style={{ padding: "14px 16px 16px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 30, fontWeight: 900, color: "#111", margin: 0, lineHeight: 1, letterSpacing: "-1px" }}>
              #{order.order_number}
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#333", margin: "4px 0 0" }}>
              {order.customer_name}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {isFinalized ? (
              <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#16A34A", borderRadius: 20, padding: "4px 12px" }}>
                ✓ Cobrado
              </span>
            ) : (
              <>
                <span style={{
                  fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px",
                  color: tickerColor, fontVariantNumeric: "tabular-nums",
                }}>
                  {mins}:{String(secs).padStart(2, "0")}
                </span>
                {isUrgent && <span style={{ fontSize: 9, fontWeight: 800, color: "#EF4444", textTransform: "uppercase", letterSpacing: "1px" }}>⚠ URGENTE</span>}
                {isWaiting && <span style={{ fontSize: 9, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "1px" }}>EN ESPERA</span>}
              </>
            )}
          </div>
        </div>

        {/* Payment badge */}
        {order.payment_method === "tarjeta" && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: "#EEF2FF", color: "#4F46E5", borderRadius: 20, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <CreditCard size={10} /> Tarjeta
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "#F0F0F0", margin: "8px 0" }} />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35 }}>
                  {item.quantity > 1 && (
                    <span style={{ display: "inline-block", background: "#E8187A", color: "#fff", borderRadius: 5, fontSize: 9, fontWeight: 800, padding: "0 5px", marginRight: 4 }}>
                      ×{item.quantity}
                    </span>
                  )}
                  {item.product_name}
                </span>
                <ProductDetailLine item={item} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#E8187A", flexShrink: 0 }}>{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F0F0F0", margin: "10px 0 8px" }} />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "1.5px" }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>{formatCOP(order.total)}</span>
        </div>

        {/* Tap hint */}
        {!isFinalized && (
          <p style={{ textAlign: "center", fontSize: 9, color: "#CCC", margin: "8px 0 0", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Toca para cobrar
          </p>
        )}
      </div>
    </div>
  );
}

// ── Card Datafono (estilo dark/premium) ───────────────────────────────────────
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

  // Dark gradient backgrounds
  const cardBg = isUrgent
    ? "linear-gradient(145deg, #2A0A0A 0%, #1A0000 100%)"
    : isWaiting
    ? "linear-gradient(145deg, #1E1500 0%, #2D1F00 100%)"
    : "linear-gradient(145deg, #0F0F14 0%, #1A1A24 100%)";

  const accentColor = isUrgent ? "#FF4444" : isWaiting ? "#F59E0B" : "#A78BFA";
  const tickerColor = isUrgent ? "#FF4444" : isWaiting ? "#FBBF24" : "#C4B5FD";

  return (
    <div
      onClick={handleClick}
      style={{
        background: cardBg,
        border: `1.5px solid ${isUrgent ? "rgba(255,68,68,0.4)" : isWaiting ? "rgba(245,158,11,0.3)" : "rgba(167,139,250,0.2)"}`,
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: FONT,
        cursor: isFinalized ? "default" : "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: isUrgent
          ? "0 0 0 3px rgba(255,68,68,0.2), 0 8px 32px rgba(255,68,68,0.15)"
          : isWaiting
          ? "0 4px 24px rgba(245,158,11,0.12)"
          : "0 4px 24px rgba(0,0,0,0.35)",
        position: "relative",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={e => { if (!isFinalized) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accentColor, opacity: 0.9, transition: "width 1s linear" }} />
      </div>

      {/* Datafono badge at top */}
      <div style={{ padding: "10px 14px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 20, padding: "3px 10px",
        }}>
          <Smartphone size={9} color="#A78BFA" />
          <span style={{ fontSize: 9, fontWeight: 800, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "1.5px" }}>Datáfono</span>
        </div>
      </div>

      {/* Confirm overlay */}
      {confirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(34,197,94,0.9)", borderRadius: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 6, backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 40 }}>✅</span>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>Toca para confirmar</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, margin: 0 }}>Cobrado y facturado</p>
        </div>
      )}

      <div style={{ padding: "10px 14px 16px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{
              fontSize: 32, fontWeight: 900, color: "#FFFFFF", margin: 0, lineHeight: 1,
              letterSpacing: "-1.5px", textShadow: `0 0 20px ${accentColor}40`,
            }}>
              #{order.order_number}
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
              {order.customer_name}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            {isFinalized ? (
              <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(34,197,94,0.2)", color: "#4ADE80", borderRadius: 20, padding: "4px 12px", border: "1px solid rgba(34,197,94,0.3)" }}>
                ✓ Cobrado
              </span>
            ) : (
              <>
                <span style={{
                  fontSize: 24, fontWeight: 900, letterSpacing: "-1px",
                  color: tickerColor, fontVariantNumeric: "tabular-nums",
                  textShadow: `0 0 12px ${tickerColor}60`,
                }}>
                  {mins}:{String(secs).padStart(2, "0")}
                </span>
                {isUrgent && <span style={{ fontSize: 9, fontWeight: 800, color: "#FF4444", textTransform: "uppercase", letterSpacing: "1px" }}>⚠ URGENTE</span>}
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.35 }}>
                  {item.quantity > 1 && (
                    <span style={{
                      display: "inline-block", background: accentColor, color: "#fff",
                      borderRadius: 5, fontSize: 9, fontWeight: 800, padding: "0 5px", marginRight: 4,
                    }}>
                      ×{item.quantity}
                    </span>
                  )}
                  {item.product_name}
                </span>
                <ProductDetailLine item={item} darkMode />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, flexShrink: 0 }}>
                {formatCOP(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0 8px" }} />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px" }}>Total</span>
          <span style={{
            fontSize: 22, fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.5px",
            textShadow: `0 0 16px ${accentColor}50`,
          }}>{formatCOP(order.total)}</span>
        </div>

        {/* Tap hint */}
        {!isFinalized && (
          <p style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.2)", margin: "8px 0 0", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Toca para cobrar
          </p>
        )}
      </div>
    </div>
  );
}

// ── Export default (auto-detecta tipo) ───────────────────────────────────────
export default function CajeroOrderCard({ order, onFinalize }) {
  const isDatafono = order.items?.some(i =>
    i.notes?.toLowerCase().includes("datafono") ||
    i.product_name?.toLowerCase().includes("datafono")
  ) || order.source === "datafono" || order.payment_method === "tarjeta";

  if (isDatafono) return <DatafonoOrderCard order={order} onFinalize={onFinalize} />;
  return <NormalOrderCard order={order} onFinalize={onFinalize} />;
}