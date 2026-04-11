import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, ChevronRight, IceCream } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MAGENTA = "#C41E6A";

// ── Posición en cola ──────────────────────────────────────────────────────────
function getQueueConfig(position) {
  if (position <= 1) return {
    emoji: "🍦",
    title: "¡Eres el siguiente! 🎉",
    subtitle: "En unos segundos te llamamos",
    progress: 100,
    animate: true,
  };
  if (position === 2) return {
    emoji: "🧍",
    title: "Solo 1 persona antes que tú",
    subtitle: "Ya casi es tu turno, no te vayas lejos 🍦",
    progress: 75,
    animate: false,
  };
  if (position <= 4) return {
    emoji: "👥",
    title: `Hay ${position - 1} personas antes que tú`,
    subtitle: "Aprovecha y elige qué sabor quieres probar primero 😄",
    progress: Math.max(20, 100 - (position - 1) * 20),
    animate: false,
  };
  return {
    emoji: "🎟️",
    title: `Estás en el puesto #${position}`,
    subtitle: "Vale la pena la espera, prometemos que sí 🙌",
    progress: Math.max(10, 100 - position * 10),
    animate: false,
  };
}

function QueueSection({ orderNumber }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confettiFired, setConfettiFired] = useState(false);
  const prevPositionRef = useRef(null);

  const fetchQueue = async () => {
    try {
      const orders = await base44.entities.Order.filter({ status: "pendiente" });
      setPendingOrders(orders);
    } catch (e) {}
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  // Calcular posición: cuántos pedidos pendientes tienen número MENOR al nuestro
  const position = pendingOrders.filter(o => o.order_number <= orderNumber).length;
  const safePosition = Math.max(1, position);
  const config = getQueueConfig(safePosition);

  // Confeti cuando llega al primer lugar
  useEffect(() => {
    if (prevPositionRef.current !== null && prevPositionRef.current > 1 && safePosition === 1 && !confettiFired) {
      setConfettiFired(true);
      const end = Date.now() + 2000;
      const colors = ["#C41E6A", "#F7C5D0", "#FFE4F3"];
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 50, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 50, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    prevPositionRef.current = safePosition;
  }, [safePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{ background: "#FFF5F9", borderRadius: 20, padding: 20, textAlign: "center" }}
    >
      <motion.div
        animate={config.animate ? { scale: [1, 1.15, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ fontSize: 40, marginBottom: 8 }}
      >
        {config.emoji}
      </motion.div>
      <p style={{ fontSize: 18, fontWeight: 800, color: safePosition === 1 ? MAGENTA : "#1A1A1A", margin: "0 0 4px" }}>
        {config.title}
      </p>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>
        {config.subtitle}
      </p>

      {/* Barra de progreso */}
      <div style={{ background: "#FFE4F3", borderRadius: 99, height: 10, overflow: "hidden", position: "relative" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${config.progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: MAGENTA, borderRadius: 99 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: MAGENTA, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          🍦 Tu turno
        </span>
      </div>
    </motion.div>
  );
}

// ── Timeline de estados ───────────────────────────────────────────────────────
const STEPS = [
  { key: "pendiente", label: "Recibido" },
  { key: "preparacion", label: "En preparación" },
  { key: "listo", label: "Listo" },
];

function getStepIndex(status) {
  if (status === "pendiente") return 0;
  if (status === "pagado_tarjeta") return 1;
  if (status === "finalizado") return 2;
  return 0;
}

function Timeline({ status }) {
  const activeIdx = getStepIndex(status);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 4 }}>
      {STEPS.map((step, idx) => {
        const done = idx < activeIdx;
        const active = idx === activeIdx;
        return (
          <React.Fragment key={step.key}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.div
                animate={active ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: done || active ? MAGENTA : "#FFE4F3",
                  border: `2px solid ${MAGENTA}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done
                  ? <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>✓</span>
                  : <span style={{ width: 10, height: 10, borderRadius: "50%", background: active ? "#fff" : "#FFB0D0", display: "block" }} />
                }
              </motion.div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? MAGENTA : done ? "#888" : "#CCC", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 3, background: "#FFE4F3", marginBottom: 18, minWidth: 24, maxWidth: 60, position: "relative", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, background: MAGENTA }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Badge de estado ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const configs = {
    pendiente: { label: "Pendiente", bg: "#FFF3CC", color: "#B8860B" },
    pagado_tarjeta: { label: "En preparación", bg: "#FFE4F3", color: MAGENTA, pulse: true },
    finalizado: { label: "Listo ✓", bg: "#E8F5E9", color: "#2E7D32" },
  };
  const cfg = configs[status] || configs.pendiente;
  return (
    <motion.span
      animate={cfg.pulse ? { opacity: [1, 0.6, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
      style={{
        display: "inline-block", fontSize: 12, fontWeight: 700,
        background: cfg.bg, color: cfg.color,
        borderRadius: 99, padding: "5px 14px",
      }}
    >
      {cfg.label}
    </motion.span>
  );
}

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
            style={{ flex: 1, height: 48, borderRadius: 12, background: "#F5F5F5", color: "#888", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Poppins', sans-serif" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, height: 48, borderRadius: 12, background: MAGENTA, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 12px rgba(196,30,106,0.35)" }}
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
  const [orderStatus, setOrderStatus] = useState(order.status || "pendiente");

  // Polling del estado del pedido cada 15s
  useEffect(() => {
    if (!order.id || order.id?.startsWith("temp-")) return;
    const fetchStatus = async () => {
      try {
        const orders = await base44.entities.Order.filter({ order_number: order.order_number });
        if (orders[0]?.status) setOrderStatus(orders[0].status);
      } catch (e) {}
    };
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [order.id, order.order_number]);

  // Confeti inicial
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#C8145C", "#F7C5D0", "#B2DFD8", "#F9E4A0"];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const canEdit = orderStatus === "pendiente";

  const handleEditConfirm = () => {
    setShowEditModal(false);
    if (onEditOrder) onEditOrder(order);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFAF9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "24px 20px 40px", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Número de ticket */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ textAlign: "center", marginBottom: 8 }}
        >
          <div style={{
            display: "inline-block", background: MAGENTA,
            borderRadius: 24, padding: "12px 40px",
            boxShadow: "0 8px 24px rgba(196,30,106,0.3)",
            marginBottom: 10,
          }}>
            <p style={{ fontSize: 52, fontWeight: 900, color: "#fff", margin: 0, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>
              #{order.order_number}
            </p>
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: MAGENTA, margin: "4px 0 8px" }}>
            {order.customer_name}
          </p>
          <StatusBadge status={orderStatus} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{ background: "#fff", borderRadius: 20, padding: "20px 16px 16px", marginBottom: 12, border: "1px solid #FFE4F3" }}
        >
          <Timeline status={orderStatus} />
        </motion.div>

        {/* Mensaje de espera */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{ background: "#FFF5F9", borderRadius: 20, padding: 20, textAlign: "center" }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>🍦</div>
          <p style={{ fontSize: 17, fontWeight: 800, color: MAGENTA, margin: "0 0 6px" }}>
            ¡Ya estamos preparando tu pedido!
          </p>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
            En unos momentos te llamamos por tu número. No te vayas lejos 😄
          </p>
        </motion.div>

        {/* Resumen del pedido */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ background: "#fff", borderRadius: 20, padding: 20, marginTop: 12, border: "1px solid #FFE4F3" }}
        >
          <p style={{ fontSize: 11, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>
            Tu pedido
          </p>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "#555" }}>{item.quantity}× {item.product_name}</span>
              <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #F0E4EA", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#888" }}>Total</span>
            <span style={{ fontWeight: 900, color: MAGENTA, fontSize: 16 }}>{formatCOP(order.total)}</span>
          </div>

          {/* Botón editar */}
          <div style={{ marginTop: 14 }}>
            {canEdit ? (
              <button
                onClick={() => setShowEditModal(true)}
                style={{
                  width: "100%", height: 44, borderRadius: 12,
                  background: "transparent", border: `1px solid ${MAGENTA}`,
                  color: MAGENTA, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                }}
              >
                ✏️ Editar pedido
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#AAA", fontSize: 13 }}>
                <Clock size={14} />
                <span>En preparación — no se puede editar</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info caja */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          style={{ background: "#FFF0F5", borderRadius: 20, padding: 16, marginTop: 12, textAlign: "center" }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
            📍 Preséntate en caja con tu número{" "}
            <span style={{ color: MAGENTA, fontWeight: 900 }}>#{order.order_number}</span>
          </p>
        </motion.div>

        {/* Nuevo pedido */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          onClick={onNewOrder}
          style={{
            width: "100%", height: 56, borderRadius: 18, marginTop: 16,
            background: MAGENTA, color: "#fff", fontSize: 15, fontWeight: 900,
            border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 4px 16px rgba(196,30,106,0.35)",
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