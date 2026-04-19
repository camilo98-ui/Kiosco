import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";
import ProductDetailLine from "@/components/menu/ProductDetailLine";

const MAGENTA = "#C41E6A";
const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";

function EditConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 360 }}
      >
        <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", textAlign: "center", fontFamily: FONT }}>
          ¿Editar tu pedido?
        </p>
        <p style={{ fontSize: 13, color: "#888", textAlign: "center", margin: "0 0 24px", lineHeight: 1.6, fontFamily: FONT }}>
          Tu pedido volverá al carrito para que puedas modificarlo
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 48, borderRadius: 14, background: "#F5F5F5", color: "#888", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: FONT }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ flex: 1, height: 48, borderRadius: 14, background: MAGENTA, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: FONT, boxShadow: "0 4px 12px rgba(196,30,106,0.35)" }}>
            Sí, editar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationScreen({ order, onNewOrder, onEditOrder }) {
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const duration = 2800;
    const end = Date.now() + duration;
    const colors = ["#C8145C", "#F7C5D0", "#B2DFD8", "#F9E4A0", "#fff"];
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleEditConfirm = () => {
    setShowEditModal(false);
    if (onEditOrder) onEditOrder(order);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1A0A10 0%, #3B0A22 50%, #1A0A10 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start",
      padding: "40px 20px 60px",
      overflowY: "auto", fontFamily: FONT,
    }}>
      {/* Logo / marca */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28, textAlign: "center" }}
      >
        <img
          src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/ada5108ff_Captura_de_pantalla_2026-04-17_132506-removebg-preview.png"
          alt="Popsy"
          style={{ height: 38, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }}
        />
      </motion.div>

      {/* TICKET */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.1 }}
        style={{ width: "100%", maxWidth: 390 }}
      >
        {/* Cuerpo del ticket */}
        <div style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>

          {/* Cabecera magenta */}
          <div style={{
            background: `linear-gradient(135deg, ${MAGENTA} 0%, #E8187A 100%)`,
            padding: "28px 24px 24px",
            textAlign: "center",
            position: "relative",
          }}>
            {/* Patrón decorativo */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.08,
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }} />

            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 10px", position: "relative" }}>
              ✦ Orden Confirmada ✦
            </p>

            {/* Número de ticket */}
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "14px 40px",
              position: "relative",
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 2px", letterSpacing: "1px" }}>
                Ticket N°
              </p>
              <p style={{ fontSize: 72, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1, letterSpacing: "-2px" }}>
                {order.order_number}
              </p>
            </div>

            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "16px 0 0", position: "relative" }}>
              {order.customer_name}
            </p>
          </div>

          {/* Info fecha/hora */}
          <div style={{
            background: "#FAFAFA",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
            padding: "12px 24px",
            borderBottom: "1px solid #F0E4EA",
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#CCC", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Fecha</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "2px 0 0" }}>{dateStr}</p>
            </div>
            <div style={{ width: 1, height: 28, background: "#E8D0DC" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#CCC", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Hora</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "2px 0 0" }}>{timeStr}</p>
            </div>
            <div style={{ width: 1, height: 28, background: "#E8D0DC" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#CCC", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Estado</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", margin: "2px 0 0" }}>● Pendiente</p>
            </div>
          </div>

          {/* Items del pedido */}
          <div style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: "#CCC", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px" }}>
              Detalle del pedido
            </p>

            {order.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 12, paddingBottom: 12,
                borderBottom: i < order.items.length - 1 ? "1px dashed #F0E4EA" : "none",
                gap: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {item.quantity > 1 && (
                      <span style={{
                        background: MAGENTA, color: "#fff",
                        borderRadius: 6, fontSize: 9, fontWeight: 800,
                        padding: "1px 6px", flexShrink: 0,
                      }}>×{item.quantity}</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}>
                      {item.product_name}
                    </span>
                  </div>
                  <ProductDetailLine item={item} compact />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: MAGENTA, flexShrink: 0 }}>
                  {formatCOP(item.price * item.quantity)}
                </span>
              </div>
            ))}

            {/* Total */}
            <div style={{
              marginTop: 6, paddingTop: 14,
              borderTop: "2px solid #F0E4EA",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#AAA" }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: MAGENTA }}>{formatCOP(order.total)}</span>
            </div>
          </div>

          {/* Botón editar */}
          <div style={{ padding: "0 24px 20px" }}>
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                width: "100%", height: 44, borderRadius: 12,
                background: "transparent", border: `1.5px solid #F0E4EA`,
                color: "#AAA", fontWeight: 600, fontSize: 13,
                cursor: "pointer", fontFamily: FONT,
              }}
            >
              ✏️ Editar pedido
            </button>
          </div>
        </div>

        {/* Borde dentado del ticket */}
        <div style={{ position: "relative", height: 20, overflow: "hidden" }}>
          <svg width="100%" height="20" viewBox="0 0 390 20" preserveAspectRatio="none">
            <path
              d="M0,0 Q9.75,20 19.5,0 Q29.25,20 39,0 Q48.75,20 58.5,0 Q68.25,20 78,0 Q87.75,20 97.5,0 Q107.25,20 117,0 Q126.75,20 136.5,0 Q146.25,20 156,0 Q165.75,20 175.5,0 Q185.25,20 195,0 Q204.75,20 214.5,0 Q224.25,20 234,0 Q243.75,20 253.5,0 Q263.25,20 273,0 Q282.75,20 292.5,0 Q302.25,20 312,0 Q321.75,20 331.5,0 Q341.25,20 351,0 Q360.75,20 370.5,0 Q380.25,20 390,0 L390,20 L0,20 Z"
              fill="#fff"
            />
          </svg>
        </div>

        {/* Parte inferior del ticket */}
        <div style={{
          background: "#F9F5F7",
          borderRadius: "0 0 24px 24px",
          padding: "20px 24px 28px",
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Barcode decorativo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginBottom: 8 }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{
                width: i % 3 === 0 ? 3 : 1.5,
                height: i % 5 === 0 ? 32 : i % 2 === 0 ? 24 : 20,
                background: "#D0C0CA",
                borderRadius: 1,
              }} />
            ))}
          </div>
          <p style={{ fontSize: 9, color: "#CCC", letterSpacing: "2px", margin: "0 0 16px", fontWeight: 600 }}>
            #{order.order_number.toString().padStart(6, "0")}
          </p>

          {/* Mensaje caja */}
          <div style={{
            background: `linear-gradient(135deg, #FFF0F7 0%, #FFE4F3 100%)`,
            borderRadius: 16, padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          }}>
            <span style={{ fontSize: 28 }}>📍</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: "0 0 2px" }}>
                Acércate a la caja
              </p>
              <p style={{ fontSize: 11, color: "#999", margin: 0, lineHeight: 1.4 }}>
                Muestra el <strong style={{ color: MAGENTA }}>#{order.order_number}</strong> para pagar y recibir tu pedido
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botón nuevo pedido */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onClick={onNewOrder}
        style={{
          width: "100%", maxWidth: 390, height: 58, borderRadius: 20, marginTop: 20,
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          color: "#fff", fontSize: 15, fontWeight: 800,
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer", fontFamily: FONT,
          letterSpacing: "0.3px",
        }}
      >
        Hacer otro pedido 🍦
      </motion.button>

      <EditConfirmModal
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
}