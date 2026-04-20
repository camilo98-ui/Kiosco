import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";
import ProductDetailLine from "@/components/menu/ProductDetailLine";

const MAGENTA = "#C41E6A";
const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";

// ── Modal editar pedido ───────────────────────────────────────────────────────
function EditConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ background: "#fff", borderRadius: 24, padding: 24, width: "100%", maxWidth: 360 }}
      >
        <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", textAlign: "center" }}>
          ¿Editar tu pedido?
        </p>
        <p style={{ fontSize: 13, color: "#666", textAlign: "center", margin: "0 0 24px", lineHeight: 1.5 }}>
          Tu pedido volverá al carrito para que puedas modificarlo
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, height: 48, borderRadius: 12, background: "#F5F5F5", color: "#888", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: FONT }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, height: 48, borderRadius: 12, background: MAGENTA, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: FONT, boxShadow: "0 4px 12px rgba(196,30,106,0.35)" }}
          >
            Sí, editar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function ConfirmationScreen({ order, onNewOrder, onEditOrder }) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Confeti solo en pedidos nuevos (no ediciones)
  useEffect(() => {
    if (order.isEdited) return;
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#C8145C", "#F7C5D0", "#B2DFD8", "#F9E4A0"];
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

  return (
    <div style={{
      minHeight: "100vh", background: "#FFFAF9",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 20px 48px", overflowY: "auto", fontFamily: FONT,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* ── Número de ticket grande ── */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          {/* Ticket visual */}
          <div style={{
            background: MAGENTA,
            borderRadius: 28,
            padding: "24px 48px",
            display: "inline-block",
            boxShadow: "0 10px 32px rgba(196,30,106,0.35)",
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Ticket N°
            </p>
            <p style={{ fontSize: 64, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1, fontFamily: FONT }}>
              {order.order_number}
            </p>
          </div>

          <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", fontFamily: FONT }}>
            {order.customer_name}
          </p>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            {order.isEdited ? "✅ Pedido actualizado correctamente" : "Preséntate en caja con este número 🍦"}
          </p>
        </motion.div>

        {/* ── Resumen del pedido ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 24, padding: 20,
            border: "1px solid #FFE4F3",
            boxShadow: "0 4px 20px rgba(196,30,106,0.07)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 14px", fontFamily: FONT }}>
            🛍️ Tu pedido
          </p>

          {order.items.map((item, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < order.items.length - 1 ? "1px solid #FFF0F5" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", fontFamily: FONT, lineHeight: 1.3 }}>
                    {item.quantity > 1 && (
                      <span style={{
                        display: "inline-block", background: MAGENTA, color: "#fff",
                        borderRadius: 6, fontSize: 10, fontWeight: 800,
                        padding: "1px 6px", marginRight: 6,
                      }}>×{item.quantity}</span>
                    )}
                    {item.product_name}
                  </span>
                  <ProductDetailLine item={item} compact />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: MAGENTA, flexShrink: 0, fontFamily: FONT }}>
                  {formatCOP(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            borderTop: "2px dashed #FFE4F3", paddingTop: 14, marginTop: 4,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#888", fontFamily: FONT }}>Total pagado</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: MAGENTA, fontFamily: FONT }}>{formatCOP(order.total)}</span>
          </div>

          {/* Botón editar */}
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              width: "100%", height: 44, borderRadius: 12, marginTop: 16,
              background: "transparent", border: `1.5px solid ${MAGENTA}`,
              color: MAGENTA, fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            ✏️ Editar pedido
          </button>
        </motion.div>

        {/* ── Info presentarse en caja ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            background: "linear-gradient(135deg, #FFF0F7 0%, #FFE4F3 100%)",
            borderRadius: 20, padding: "18px 20px", marginTop: 14,
            display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <span style={{ fontSize: 36 }}>📍</span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: "0 0 3px", fontFamily: FONT }}>
              Acércate a la caja
            </p>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: FONT }}>
              Muestra el número <strong style={{ color: MAGENTA }}>#{order.order_number}</strong> para pagar y recibir tu pedido
            </p>
          </div>
        </motion.div>

        {/* ── Nuevo pedido ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          onClick={onNewOrder}
          style={{
            width: "100%", height: 58, borderRadius: 20, marginTop: 18,
            background: MAGENTA, color: "#fff", fontSize: 16, fontWeight: 900,
            border: "none", cursor: "pointer", fontFamily: FONT,
            boxShadow: "0 6px 20px rgba(196,30,106,0.38)",
          }}
        >
          Hacer otro pedido 🍦
        </motion.button>
      </div>

      <EditConfirmModal
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
}