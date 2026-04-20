import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { NormalOrderCard, DatafonoOrderCard } from "@/components/orders/CajeroOrderCard";
import DaySummary from "@/components/orders/DaySummary";
import { ArrowLeft, BarChart3, Clock } from "lucide-react";
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

const FONT = "'Poppins', -apple-system, sans-serif";

function getTimeState(order) {
  if (order.status === "finalizado") return "done";
  const elapsed = moment().diff(moment(order.created_date), "seconds");
  if (elapsed >= 600) return "urgent";
  if (elapsed >= 300) return "waiting";
  return "normal";
}

function isDatafonoOrder(order) {
  return order.payment_method === "tarjeta";
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      fontFamily: FONT, fontSize: 13, fontWeight: 700,
      color: "#666", letterSpacing: "1.5px", fontVariantNumeric: "tabular-nums",
    }}>
      {time.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "urgent", label: "Urgentes" },
  { id: "new", label: "Nuevos" },
  { id: "done", label: "Cobrados" },
];

function StatPill({ label, value, color, bg }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: bg, borderRadius: 20, padding: "4px 12px",
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontFamily: FONT, color: "#555", fontWeight: 600 }}>
        {label} <strong style={{ color: "#111" }}>{value}</strong>
      </span>
    </div>
  );
}

export default function Cajero() {
  useSwipeNavigation();
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [posAlert, setPosAlert] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [tick, setTick] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders-cajero"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
    refetchInterval: 3000,
    staleTime: 0,
  });

  useEffect(() => {
    const unsub = base44.entities.Order.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
    });
    return unsub;
  }, [queryClient]);

  const updateOrder = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
      toast.success("✓ Pedido cobrado y facturado");
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

  const sortedOrders = [...orders].sort((a, b) => {
    const stateOrder = { urgent: 0, waiting: 1, normal: 2, done: 99 };
    return (stateOrder[getTimeState(a)] ?? 2) - (stateOrder[getTimeState(b)] ?? 2);
  });

  const activeOrders = sortedOrders.filter(o => o.status !== "finalizado");
  const doneToday = sortedOrders.filter(o =>
    o.status === "finalizado" && moment(o.updated_date).isSame(moment(), "day")
  );

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
    <div style={{ minHeight: "100vh", background: "#F4F4F8", fontFamily: FONT }}>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)", width: "100%",
      }}>
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 20 }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <Link to="/">
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F0F5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ArrowLeft size={17} color="#444" />
              </div>
            </Link>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#0A0A0A", margin: 0, lineHeight: 1, letterSpacing: "-0.5px" }}>Cajero</p>
              <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0", fontWeight: 500 }}>
                {activeOrders.length} pedido{activeOrders.length !== 1 ? "s" : ""} activo{activeOrders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Center: filters */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
            {FILTERS.map(f => {
              const isActive = activeFilter === f.id;
              const count = f.id === "urgent" ? urgentCount : f.id === "new" ? newCount : f.id === "done" ? doneToday.length : null;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: "7px 18px", borderRadius: 12, border: "none", cursor: "pointer",
                    fontFamily: FONT, fontSize: 12, fontWeight: 700,
                    background: isActive ? "#0A0A0A" : "#F0F0F5",
                    color: isActive ? "#fff" : "#666",
                    transition: "all 0.2s",
                    position: "relative",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {f.label}
                  {f.id === "urgent" && urgentCount > 0 && (
                    <span style={{
                      position: "absolute", top: -5, right: -5,
                      background: "#EF4444", color: "#fff",
                      borderRadius: "50%", width: 18, height: 18,
                      fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                      animation: "pulse 1.2s infinite",
                      boxShadow: "0 0 0 3px rgba(239,68,68,0.2)",
                    }}>{urgentCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setShowHistory(true)}
              style={{ width: 38, height: 38, borderRadius: 12, background: "#F0F7FF", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Clock size={16} color="#3B82F6" />
            </button>
            <button onClick={() => setShowSummary(!showSummary)}
              style={{ width: 38, height: 38, borderRadius: 12, background: "#FFF0F7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <BarChart3 size={16} color="#E8187A" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ padding: "6px 24px 12px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <StatPill label="Nuevos" value={newCount} color="#22C55E" bg="#F0FDF4" />
          <StatPill label="En espera" value={waitingCount} color="#F59E0B" bg="#FFFBEB" />
          <StatPill label="Urgentes" value={urgentCount} color="#EF4444" bg="#FEF2F2" />
          <StatPill label="Cobrados hoy" value={doneToday.length} color="#8B5CF6" bg="#F5F3FF" />
          <div style={{ marginLeft: "auto" }}><LiveClock /></div>
        </div>
      </div>

      {/* Summary Panel */}
      {showSummary && (
        <div style={{ padding: "16px 24px 0" }}>
          <DaySummary orders={orders} />
        </div>
      )}

      {/* ── ORDERS GRID ── */}
      <div style={{ padding: "20px 24px 60px" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: "#BBB" }}>
            <p style={{ fontSize: 48, marginBottom: 8 }}>✨</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#999" }}>No hay pedidos aquí</p>
            <p style={{ fontSize: 13, color: "#CCC", marginTop: 4 }}>Todo al día 🎉</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}>
            {filteredOrders.map((order) =>
              isDatafonoOrder(order) ? (
                <DatafonoOrderCard
                  key={`${order.id}-${order.updated_date}`}
                  order={order}
                  onFinalize={handleFinalize}
                />
              ) : (
                <NormalOrderCard
                  key={`${order.id}-${order.updated_date}`}
                  order={order}
                  onFinalize={handleFinalize}
                />
              )
            )}
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
            <AlertDialogTitle className="text-center text-xl font-black">⚠️ FALTA FACTURAR EN POS</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              Este pedido fue pagado con tarjeta. Asegúrate de registrar la factura en el POS antes de continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction className="bg-green-500 text-white rounded-2xl font-bold h-12" onClick={handlePosConfirm}>
              Ya facturé en POS ✅
            </AlertDialogAction>
            <AlertDialogCancel className="rounded-2xl h-11">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}