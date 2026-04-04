import React, { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Plus, Minus, X, CheckCircle2, ShoppingBag, Search } from "lucide-react";
import { formatCOP, CATEGORIES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const MAGENTA = "#E91B8B";

// ── Mini product grid ──────────────────────────────────────────────────────────

function ProductCard({ product, onAdd, flashId }) {
  const [imgError, setImgError] = useState(false);
  const isFlash = flashId === product.id;

  return (
    <motion.div
      animate={isFlash ? { scale: 1.05 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "#fff",
        border: "1px solid #FFE4F3",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(233,27,139,0.06)",
      }}
    >
      <div style={{ height: 100, background: "#FFF0F8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 36 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3, margin: 0, flex: 1 }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: MAGENTA }}>{formatCOP(product.price)}</span>
          <button
            onClick={() => onAdd(product)}
            style={{
              width: 26, height: 26, borderRadius: "50%",
              background: MAGENTA, color: "#fff", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(233,27,139,0.3)",
            }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MenuView({ onAddItem }) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]?.id || "malteadas");
  const [flashId, setFlashId] = useState(null);
  const [search, setSearch] = useState("");

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
  });

  const isSearching = search.trim().length > 0;
  const displayProducts = isSearching
    ? products.filter(p => p.is_available !== false && p.name.toLowerCase().includes(search.toLowerCase()))
    : products.filter(p => p.category === activeCat && p.is_available !== false);

  const handleAdd = (product) => {
    onAddItem(product);
    setFlashId(product.id);
    setTimeout(() => setFlashId(null), 300);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Search bar */}
      <div style={{ padding: "10px 16px 6px", background: "#fff", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#FFF0F8", borderRadius: 12,
          padding: "8px 12px", border: "1.5px solid #FFE4F3",
        }}>
          <Search size={15} color={MAGENTA} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 13, color: "#1A1A1A", fontFamily: "'Poppins', sans-serif",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={14} color="#BBBBBB" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs — hidden while searching */}
      {!isSearching && (
        <div style={{
          display: "flex", gap: 8, padding: "6px 16px 10px",
          overflowX: "auto", scrollbarWidth: "none", background: "#fff",
          borderBottom: "1px solid #FFE4F3", flexShrink: 0,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer",
                background: activeCat === cat.id ? MAGENTA : "#FFE4F3",
                color: activeCat === cat.id ? "#fff" : MAGENTA,
                transition: "all 0.18s ease",
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Products grid */}
      <div style={{
        flex: 1, overflowY: "auto", padding: 12,
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
        alignContent: "start",
      }}>
        {displayProducts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "#CCCCCC" }}>
            <p style={{ fontSize: 32 }}>🔍</p>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{isSearching ? "Sin resultados para esa búsqueda" : "Sin productos en esta categoría"}</p>
          </div>
        ) : (
          displayProducts.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} flashId={flashId} />
          ))
        )}
      </div>
    </div>
  );
}

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

function SuccessFlash({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 70,
      background: "rgba(255,255,255,0.95)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12,
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <CheckCircle2 size={80} color="#4CAF50" strokeWidth={1.5} />
      </motion.div>
      <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A" }}>¡Cobrado con éxito!</p>
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
        <p key={i} style={{ fontSize: 12, color: "#777", margin: "2px 0" }}>
          {item.quantity}× {item.product_name}
          {item.notes && <span style={{ color: "#BBBBBB" }}> · {item.notes}</span>}
        </p>
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
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "cobrar"
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingOrders = [] } = useQuery({
    queryKey: ["orders-datafono-pending"],
    queryFn: () => base44.entities.Order.filter({ status: "pendiente" }, "-created_date", 50),
    refetchInterval: 3000,
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
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-datafono-pending"] });
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
      setConfirmOpen(false);
      setShowSuccess(true);
    },
  });

  const handleAddItem = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.findIndex(i => i.id === product.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 };
        return next;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
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
          <MenuView onAddItem={handleAddItem} />
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
        {showSuccess && <SuccessFlash onDone={handleSuccessDone} />}
      </AnimatePresence>
    </div>
  );
}