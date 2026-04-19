import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import CajeroOrderCard from "@/components/orders/CajeroOrderCard";
import DaySummary from "@/components/orders/DaySummary";
import { ArrowLeft, BarChart3, Clock, X } from "lucide-react";
import OrderHistory from "@/components/orders/OrderHistory";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";

function getTimeState(order) {
  if (order.status === "finalizado") return "done";
  const elapsed = moment().diff(moment(order.created_date), "seconds");
  if (elapsed >= 600) return "urgent";
  if (elapsed >= 300) return "waiting";
  return "normal";
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#555", letterSpacing: "1px", fontVariantNumeric: "tabular-nums" }}>
      {time.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "urgent", label: "🔴 Urgentes" },
  { id: "new", label: "🟢 Nuevos" },
  { id: "done", label: "✅ Cobrados" },
];

export default function Cajero() {
  useSwipeNavigation();
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [posAlert, setPosAlert] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [tick, setTick] = useState(0);
  const queryClient = useQueryClient();

  // Tick each second to re-sort and re-badge cards
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders-cajero"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
    refetchInterval: 3000,
    staleTime: 1000,
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
      toast.success("Pedido actualizado");
    },
  });

  const handleFinalize = (order) => {
    if (order.status === "pendiente") {
      updateOrder.mutate({ id: order.id, data: { status: "finalizado", payment_method: "efectivo" } });
    } else if (order.status === "pagado_tarjeta") {
      setPosAlert(order);
    }
  };

  const handlePosConfirm = () => {
    if (posAlert) {
      updateOrder.mutate({ id: posAlert.id, data: { status: "finalizado", payment_method: "tarjeta" } });
      setPosAlert(null);
    }
  };

  // Sort: urgent first, done last
  const sortedOrders = [...orders].sort((a, b) => {
    const stateOrder = { urgent: 0, waiting: 1, normal: 2, done: 99 };
    return (stateOrder[getTimeState(a)] ?? 2) - (stateOrder[getTimeState(b)] ?? 2);
  });

  const activeOrders = sortedOrders.filter(o => o.status !== "finalizado");
  const doneToday = sortedOrders.filter(o => o.status === "finalizado" && moment(o.updated_date).isSame(moment(), "day"));

  const urgentCount = activeOrders.filter(o => getTimeState(o) === "urgent").length;
  const newCount = activeOrders.filter(o => getTimeState(o) === "normal").length;
  const waitingCount = activeOrders.filter(o => getTimeState(o) === "waiting").length;

  const filteredOrders = (() => {
    if (activeFilter === "urgent") return sortedOrders.filter(o => getTimeState(o) === "urgent");
    if (activeFilter === "new") return sortedOrders.filter(o => getTimeState(o) === "normal");
    if (activeFilter === "done") return sortedOrders.filter(o => o.status === "finalizado");
    return sortedOrders.filter(o => o.status !== "finalizado");
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: FONT }}>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #eee",
        width: "100%",
      }}>
        <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 20 }}>

          {/* Left: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <Link to="/">
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ArrowLeft size={18} color="#555" />
              </div>
            </Link>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.1 }}>Cajero</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{activeOrders.length} pedidos activos</p>
            </div>
          </div>

          {/* Center: filters */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 8 }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  fontFamily: FONT, fontSize: 12, fontWeight: 700,
                  background: activeFilter === f.id ? "#E8187A" : "#F0F0F0",
                  color: activeFilter === f.id ? "#fff" : "#555",
                  transition: "all 0.2s",
                  position: "relative",
                }}
              >
                {f.label}
                {f.id === "urgent" && urgentCount > 0 && (
                  <span style={{
                    position: "absolute", top: -5, right: -5,
                    background: "#EF4444", color: "#fff",
                    borderRadius: "50%", width: 17, height: 17,
                    fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                    animation: "pulse 1.5s infinite",
                  }}>{urgentCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Right: buttons */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setShowHistory(true)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0F7FF", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Clock size={17} color="#1A56DB" />
            </button>
            <button onClick={() => setShowSummary(!showSummary)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0F7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <BarChart3 size={17} color="#E8187A" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          padding: "8px 24px", borderTop: "1px solid #F0F0F0",
          display: "flex", alignItems: "center", gap: 24,
        }}>
          <StatDot color="#22C55E" label="Nuevos" value={newCount} />
          <StatDot color="#F59E0B" label="En espera" value={waitingCount} />
          <StatDot color="#EF4444" label="Urgentes" value={urgentCount} />
          <StatDot color="#999" label="Cobrados hoy" value={doneToday.length} />
          <div style={{ marginLeft: "auto" }}>
            <LiveClock />
          </div>
        </div>
      </div>

      {/* ── SUMMARY PANEL ── */}
      {showSummary && (
        <div style={{ padding: "16px 24px 0" }}>
          <DaySummary orders={orders} />
        </div>
      )}

      {/* ── ORDERS GRID ── */}
      <div style={{ padding: "20px 24px 60px" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: "#999" }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>✨</p>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No hay pedidos en esta vista</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 16,
          }}>
            {filteredOrders.map((order) => (
              <CajeroOrderCard
                key={order.id}
                order={order}
                onFinalize={handleFinalize}
              />
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      {showHistory && (
        <OrderHistory orders={orders} onClose={() => setShowHistory(false)} />
      )}

      {/* Alert POS */}
      <AlertDialog open={!!posAlert} onOpenChange={() => setPosAlert(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">⚠️ FALTA FACTURAR EN POS</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Este pedido fue pagado con tarjeta. Asegúrate de registrar la factura en el POS antes de continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction className="bg-accent text-accent-foreground rounded-xl font-bold" onClick={handlePosConfirm}>
              Ya facturé en POS ✅
            </AlertDialogAction>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

function StatDot({ color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "#888", fontFamily: "-apple-system, 'SF Pro Display', 'Poppins', sans-serif" }}>
        {label} · <strong style={{ color: "#333" }}>{value}</strong>
      </span>
    </div>
  );
}