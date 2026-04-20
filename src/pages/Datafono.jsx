import React, { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Plus, Minus, X, CheckCircle2, ShoppingBag } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import DatafonoMenuView from "@/components/datafono/DatafonoMenuView";

const MAGENTA = "#E91B8B";

// ── Cart / Order summary ───────────────────────────────────────────────────────

function CartSheet({ items, customerName, onNameChange, onUpdateQty, onRemove, onConfirm, isLoading, onClose }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "24px 24px 0 0",
          maxHeight: "88vh", display: "flex", flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#EEE" }} />
        </div>

        <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
            Resumen del pedido
          </p>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#666" />
          </button>
        </div>

        {/* Name field */}
        <div style={{ padding: "0 20px 12px" }}>
          <input
            placeholder="Nombre del cliente"
            value={customerName}
            onChange={e => onNameChange(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "12px 14px", borderRadius: 12,
              border: "1.5px solid #FFE4F3", fontSize: 14,
              fontFamily: "'Poppins', sans-serif",
              color: "#1A1A1A", outline: "none",
            }}
          />
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: "1px solid #F8F0F5",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
                {item.notes && (
                  <p style={{ fontSize: 11, color: MAGENTA, fontStyle: "italic", margin: "2px 0 0", lineHeight: 1.3 }}>
                    {item.notes.split("|").slice(0, 2).map(s => s.trim()).join(" · ")}
                  </p>
                )}
                <p style={{ fontSize: 12, color: MAGENTA, fontWeight: 700, margin: "2px 0 0" }}>{formatCOP(item.price)}/u</p>
              </div>
              {/* Qty controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => onUpdateQty(i, -1)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#FFE4F3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus size={12} color={MAGENTA} />
                </button>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => onUpdateQty(i, 1)} style={{ width: 26, height: 26, borderRadius: "50%", background: MAGENTA, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={12} color="#fff" />
                </button>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: MAGENTA, minWidth: 60, textAlign: "right" }}>
                {formatCOP(item.price * item.qty)}
              </span>
              <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={16} color="#BBBBBB" />
              </button>
            </div>
          ))}
        </div>

        {/* Total + CTA */}
        <div style={{ padding: "16px 20px 32px", borderTop: "1px solid #F0F0F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 15, color: "#999" }}>{itemCount} ítems</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: MAGENTA }}>{formatCOP(total)}</span>
          </div>
          <button
            onClick={onConfirm}
            disabled={isLoading || !customerName.trim() || items.length === 0}
            style={{
              width: "100%", height: 52, borderRadius: 16,
              background: customerName.trim() && items.length > 0 ? MAGENTA : "#F0C0DC",
              color: "#fff", fontSize: 16, fontWeight: 700,
              border: "none", cursor: customerName.trim() ? "pointer" : "not-allowed",
              fontFamily: "'Poppins', sans-serif",
              boxShadow: customerName.trim() ? "0 4px 16px rgba(233,27,139,0.35)" : "none",
            }}
          >
            {isLoading ? "Procesando..." : `💳 Cobrar con datáfono · ${formatCOP(total)}`}
          </button>
          {!customerName.trim() && (
            <p style={{ fontSize: 11, color: "#BBBBBB", textAlign: "center", marginTop: 8 }}>Ingresa el nombre del cliente para continuar</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Confirm modal ──────────────────────────────────────────────────────────────

function ConfirmModal({ total, name, onCancel, onConfirm, isLoading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 360 }}
      >
        <p style={{ fontSize: 22, textAlign: "center", marginBottom: 8 }}>💳</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", textAlign: "center", lineHeight: 1.4 }}>
          ¿Confirmar cobro de<br />
          <span style={{ color: MAGENTA, fontSize: 20, fontWeight: 800 }}>{formatCOP(total)}</span>
          <br />a <strong>{name}</strong>?
        </p>
        <p style={{ fontSize: 12, color: "#999", textAlign: "center", margin: "12px 0 20px" }}>
          El pedido aparecerá en el cajero marcado como Datáfono
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 44, borderRadius: 12, background: "#F5F5F5", border: "none", fontSize: 14, fontWeight: 700, color: "#666", cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading} style={{ flex: 2, height: 44, borderRadius: 12, background: MAGENTA, border: "none", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(233,27,139,0.35)" }}>
            {isLoading ? "Procesando..." : "Confirmar ✓"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Success animation ──────────────────────────────────────────────────────────

function SuccessFlash({ onDone, orderNum }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 70,
      background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 8, padding: 32,
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <CheckCircle2 size={64} color="#4CAF50" strokeWidth={1.5} />
        <p style={{ fontSize: 15, fontWeight: 600, color: "#4CAF50", margin: 0 }}>¡Cobrado con éxito!</p>
      </motion.div>

      {orderNum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px" }}>Número de ticket</p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 80, fontWeight: 800, color: "#1A1A1A", lineHeight: 1, margin: 0 }}>
            #{orderNum}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "#E8F0FF", color: "#1A56DB", border: "1px solid #1A56DB",
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            padding: "4px 12px", marginTop: 10,
          }}>
            💳 Datáfono
          </div>
        </motion.div>
      )}

      <button
        onClick={onDone}
        style={{
          marginTop: 32, padding: "12px 32px", borderRadius: 16,
          background: MAGENTA, color: "#fff", border: "none",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Nuevo pedido
      </button>
    </div>
  );
}

// ── Pending orders tab ──────────────────────────────────────────────────────────

function PendingOrderCard({ order, onMark, isLoading }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #FFE4F3",
      borderLeft: "4px solid " + MAGENTA,
      padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", lineHeight: 1 }}>#{order.order_number}</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#555", margin: "4px 0 0" }}>👤 {order.customer_name}</p>
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, color: MAGENTA }}>{formatCOP(order.total)}</span>
      </div>
      {order.items?.map((item, i) => (
      <div key={i} style={{ fontSize: 12, color: "#777", margin: "4px 0 6px" }}>
        <p style={{ margin: 0, fontWeight: 700 }}>{item.quantity}× {item.product_name}</p>
        {item.notes && item.notes !== "💳 Datáfono" && (
          <div style={{ marginTop: 3, paddingLeft: 8 }}>
            {item.notes.split("|").map((line, j) => {
              const colonIdx = line.indexOf(":");
              const key = colonIdx !== -1 ? line.substring(0, colonIdx).trim() : null;
              const val = colonIdx !== -1 ? line.substring(colonIdx + 1).trim() : line.trim();
              const isSabor = key?.toLowerCase() === "sabor";
              const isExtras = key?.toLowerCase() === "extras";
              return (
                <div key={j} style={{ display: "flex", gap: 4, marginBottom: 1 }}>
                  {key && <span style={{ fontSize: 10, fontWeight: 700, color: isSabor || isExtras ? MAGENTA : "#AAA", flexShrink: 0 }}>{key}:</span>}
                  <span style={{ fontSize: 11, color: isSabor || isExtras ? MAGENTA : "#888", fontStyle: isSabor ? "italic" : "normal" }}>{val}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      ))}
      <button
        onClick={() => onMark(order.id)}
        disabled={isLoading}
        style={{
          marginTop: 12, width: "100%", height: 44, borderRadius: 12,
          background: MAGENTA, color: "#fff", fontSize: 14, fontWeight: 700,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          boxShadow: "0 3px 10px rgba(233,27,139,0.3)",
        }}
      >
        <CreditCard size={15} /> Cobrar con tarjeta
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Datafono() {
  useSwipeNavigation();
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "cobrar"
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrderNum, setSuccessOrderNum] = useState(null);
  const queryClient = useQueryClient();

  const { data: pendingOrders = [] } = useQuery({
    queryKey: ["orders-datafono-pending"],
    queryFn: () => base44.entities.Order.filter({ status: "pendiente" }, "-created_date", 50),
    refetchInterval: 3000,
    staleTime: 1000,
    gcTime: 5 * 60 * 1000,
  });

  const markTarjeta = useMutation({
    mutationFn: (id) =>
      base44.entities.Order.update(id, { status: "pagado_tarjeta", payment_method: "tarjeta" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-datafono-pending"] });
      toast.success("✅ Marcado como cobrado con tarjeta");
    },
  });

  const createOrder = useMutation({
    mutationFn: async () => {
      const settings = await base44.entities.Settings.filter({ key: "next_order_number" });
      const nextNum = parseInt(settings[0]?.value || "101");
      const order = await base44.entities.Order.create({
        order_number: nextNum,
        customer_name: customerName.trim(),
        items: cartItems.map(i => ({
          product_id: i.id,
          product_name: i.name,
          price: i.price,
          quantity: i.qty,
          notes: "💳 Datáfono",
        })),
        total: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
        status: "pagado_tarjeta",
        payment_method: "tarjeta",
      });
      await base44.entities.Settings.update(settings[0].id, { value: String(nextNum + 1) });
      return { order, orderNum: nextNum };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders-datafono-pending"] });
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
      setConfirmOpen(false);
      setSuccessOrderNum(data.orderNum);
      setShowSuccess(true);
    },
  });

  const handleAddItem = useCallback((product) => {
    // Acepta tanto el formato antiguo (product.id, product.name) como el nuevo ({ id, name, price, notes })
    const id = product.id || product.product_id;
    const name = product.name || product.product_name;
    const notes = product.notes || "";
    setCartItems(prev => {
      // Si tiene notas (personalización), siempre agregar como ítem nuevo para preservar customización
      if (notes) {
        return [...prev, { id, name, price: product.price, qty: 1, notes }];
      }
      const existing = prev.findIndex(i => i.id === id && !i.notes);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 };
        return next;
      }
      return [...prev, { id, name, price: product.price, qty: 1, notes: "" }];
    });
  }, []);

  const handleUpdateQty = (idx, delta) => {
    setCartItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      if (next[idx].qty <= 0) next.splice(idx, 1);
      return next;
    });
  };

  const handleRemove = (idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    setCartItems([]);
    setCustomerName("");
    setCartOpen(false);
  };

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F3F5", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #FFE4F3",
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={18} color="#666" />
            </div>
          </Link>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Datáfono</p>
            <p style={{ fontSize: 12, color: MAGENTA, fontWeight: 600, margin: "1px 0 0" }}>
              {pendingOrders.length} pedidos pendientes
            </p>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "10px 16px 12px", display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("menu")}
            style={{
              flex: 1, height: 38, borderRadius: 20,
              background: activeTab === "menu" ? MAGENTA : "#FFE4F3",
              color: activeTab === "menu" ? "#fff" : MAGENTA,
              border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            🛒 Nuevo pedido
          </button>
          <button
            onClick={() => setActiveTab("cobrar")}
            style={{
              flex: 1, height: 38, borderRadius: 20,
              background: activeTab === "cobrar" ? MAGENTA : "#FFE4F3",
              color: activeTab === "cobrar" ? "#fff" : MAGENTA,
              border: `1.5px solid ${MAGENTA}`,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.18s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            💳 Tarjeta facturado
            {pendingOrders.length > 0 && (
              <span style={{
                background: "#fff", color: MAGENTA,
                borderRadius: "50%", fontSize: 11, fontWeight: 800,
                width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {pendingOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 600, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeTab === "menu" && (
          <DatafonoMenuView onAddItem={handleAddItem} />
        )}

        {activeTab === "cobrar" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 100px" }}>
            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 60 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FFE4F3", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CreditCard size={36} color={MAGENTA} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Listo para cobrar</p>
                <p style={{ fontSize: 13, color: "#999", margin: "8px 0 20px" }}>Selecciona productos del menú para crear un pedido</p>
                <button
                  onClick={() => setActiveTab("menu")}
                  style={{
                    padding: "10px 24px", borderRadius: 20,
                    background: MAGENTA, color: "#fff",
                    border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Ir al menú →
                </button>
              </div>
            ) : (
              pendingOrders.map(order => (
                <PendingOrderCard
                  key={order.id}
                  order={order}
                  onMark={(id) => markTarjeta.mutate(id)}
                  isLoading={markTarjeta.isPending}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      <AnimatePresence>
        {activeTab === "menu" && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{ position: "fixed", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 30 }}
          >
            <button
              onClick={() => setCartOpen(true)}
              style={{
                background: MAGENTA, color: "#fff",
                borderRadius: 30, padding: "14px 28px",
                fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(233,27,139,0.4)",
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <ShoppingBag size={18} />
              Ver pedido · {totalItems} ítem{totalItems !== 1 ? "s" : ""} · {formatCOP(totalPrice)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart sheet */}
      <AnimatePresence>
        {cartOpen && (
          <CartSheet
            items={cartItems}
            customerName={customerName}
            onNameChange={setCustomerName}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onConfirm={() => { setCartOpen(false); setConfirmOpen(true); }}
            isLoading={createOrder.isPending}
            onClose={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmOpen && (
          <ConfirmModal
            total={totalPrice}
            name={customerName}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => createOrder.mutate()}
            isLoading={createOrder.isPending}
          />
        )}
      </AnimatePresence>

      {/* Success flash */}
      <AnimatePresence>
        {showSuccess && <SuccessFlash onDone={handleSuccessDone} orderNum={successOrderNum} />}
      </AnimatePresence>
    </div>
  );
}