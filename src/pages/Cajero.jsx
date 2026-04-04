import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CajeroOrderCard from "@/components/orders/CajeroOrderCard";
import DaySummary from "@/components/orders/DaySummary";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, BarChart3, X, Clock } from "lucide-react";
import OrderHistory from "@/components/orders/OrderHistory";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCOP, STATUS_CONFIG } from "@/lib/constants";
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

const STATUS_LABELS = {
  pendiente: "Pendiente",
  pagado_tarjeta: "En preparación",
  listo: "Listo para entregar",
  finalizado: "Cobrado y facturado",
};

function OrderDetailModal({ order, onClose, onFinalize }) {
  if (!order) return null;
  const statusLabel = STATUS_LABELS[order.status] || order.status;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "24px 24px 0 0",
          width: "100%", maxWidth: 600,
          padding: "24px 20px 40px",
          maxHeight: "85vh", overflowY: "auto",
        }}
      >
        {/* Header del modal */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 52, fontWeight: 800, color: "#1A1A1A", lineHeight: 1 }}>
              #{order.order_number}
            </div>
            <p style={{ fontSize: 14, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>{statusLabel}</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Cliente */}
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>
          👤 {order.customer_name}
        </p>

        {/* Ítems completos */}
        <div style={{ borderRadius: 12, border: "1px solid #F0F0F0", overflow: "hidden", marginBottom: 16 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ padding: "10px 14px", borderBottom: i < order.items.length - 1 ? "1px solid #F5F5F5" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                <span>{item.quantity}× {item.product_name}</span>
                <span style={{ color: "#C41E6A" }}>{formatCOP(item.price * item.quantity)}</span>
              </div>
              {item.notes && (
                <p style={{ fontSize: 11, color: "#999", margin: "3px 0 0 8px", fontStyle: "italic" }}>📝 {item.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: "#999" }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(order.total)}</span>
        </div>

        {/* Acciones */}
        {order.status === "pendiente" && (
          <button
            onClick={() => onFinalize(order)}
            style={{
              width: "100%", height: 52, borderRadius: 16,
              background: "#4CAF50", color: "#fff",
              fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <CheckCircle size={18} /> Cobrado y facturado
          </button>
        )}
        {order.status === "pagado_tarjeta" && (
          <button
            onClick={() => onFinalize(order)}
            style={{
              width: "100%", height: 52, borderRadius: 16,
              background: "#2196F3", color: "#fff",
              fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <AlertTriangle size={18} /> Facturado en POS
          </button>
        )}
      </div>
    </div>
  );
}

export default function Cajero() {
  const [showSummary, setShowSummary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [posAlert, setPosAlert] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders-cajero"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
    refetchInterval: 3000,
  });

  const activeOrders = orders.filter((o) => o.status !== "finalizado");

  const updateOrder = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-cajero"] });
      toast.success("Pedido actualizado");
      setSelectedOrder(null);
    },
  });

  const handleFinalize = (order) => {
    if (order.status === "pendiente") {
      updateOrder.mutate({ id: order.id, data: { status: "finalizado", payment_method: "efectivo" } });
    } else if (order.status === "pagado_tarjeta") {
      setPosAlert(order);
      setSelectedOrder(null);
    }
  };

  const handlePosConfirm = () => {
    if (posAlert) {
      updateOrder.mutate({ id: posAlert.id, data: { status: "finalizado", payment_method: "tarjeta" } });
      setPosAlert(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F7" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={18} color="#666" />
            </div>
          </Link>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1 }}>Cajero</p>
            <p style={{ fontSize: 13, color: "#C41E6A", fontWeight: 600, margin: "2px 0 0" }}>
              {activeOrders.length} pedidos activos
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowHistory(true)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0F7FF", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Clock size={18} color="#1A56DB" />
            </button>
            <button
              onClick={() => setShowSummary(!showSummary)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0F7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <BarChart3 size={18} color="#C41E6A" />
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: 16, display: "flex", gap: 16 }}>
         {/* Sidebar: Summary (desktop) */}
         <div style={{ width: 300, flexShrink: 0 }}>
           {showSummary && <DaySummary orders={orders} />}
         </div>

         {/* Main: Orders grid — Full width */}
         <div style={{ flex: 1 }}>
           {activeOrders.length === 0 ? (
             <div style={{ textAlign: "center", paddingTop: 80, color: "#999" }}>
               <p style={{ fontSize: 40, marginBottom: 8 }}>✨</p>
               <p style={{ fontWeight: 600 }}>No hay pedidos pendientes</p>
             </div>
           ) : (
             <div style={{
               display: "grid",
               gridTemplateColumns: "repeat(4, 1fr)",
               gap: 16,
             }}>
               {activeOrders.map((order) => (
                 <CajeroOrderCard
                   key={order.id}
                   order={order}
                   onFinalize={handleFinalize}
                 />
               ))}
             </div>
           )}
         </div>
       </div>

      {/* Modal detalle */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onFinalize={handleFinalize}
        />
      )}

      {/* Historial */}
      {showHistory && (
        <OrderHistory
          orders={orders}
          onClose={() => setShowHistory(false)}
        />
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
    </div>
  );
}