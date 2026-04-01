import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderCard from "@/components/orders/OrderCard";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";
import { useCart } from "@/lib/cartStore";
import { useNavigate } from "react-router-dom";

// Vista split: Menú normal para tomar el pedido + botón "Pagar con tarjeta"
// También muestra los pedidos con status pagado_tarjeta para que el cajero los facture

export default function Datafono() {
  const [activeTab, setActiveTab] = useState("cobrar"); // "cobrar" | "menu"
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { itemCount, total } = useCart();

  // Pedidos que ya marcaron tarjeta (pendiente de facturar)
  const { data: tarjetaOrders = [] } = useQuery({
    queryKey: ["orders-tarjeta"],
    queryFn: () => base44.entities.Order.filter({ status: "pagado_tarjeta" }, "-created_date", 50),
    refetchInterval: 3000,
  });

  // Pedidos pendientes (llegaron del menú, sin cobrar)
  const { data: pendingOrders = [] } = useQuery({
    queryKey: ["orders-datafono"],
    queryFn: () => base44.entities.Order.filter({ status: "pendiente" }, "-created_date", 50),
    refetchInterval: 3000,
  });

  const markTarjeta = useMutation({
    mutationFn: ({ id }) =>
      base44.entities.Order.update(id, { status: "pagado_tarjeta", payment_method: "tarjeta" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-datafono"] });
      queryClient.invalidateQueries({ queryKey: ["orders-tarjeta"] });
      toast.success("✅ Marcado como tarjeta — listo para facturar");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-20 backdrop-blur-md border-b border-border/60"
        style={{ background: "hsla(230,25%,8%,0.92)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <PopsyLogo size="small" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: "hsla(210,90%,60%,0.15)", border: "1px solid hsla(210,90%,60%,0.3)" }}>
            <CreditCard className="w-4 h-4" style={{ color: "hsl(210,90%,65%)" }} />
            <span className="text-sm font-black" style={{ color: "hsl(210,90%,65%)" }}>DATÁFONO</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab("cobrar")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "cobrar"
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={activeTab === "cobrar" ? {
              background: "linear-gradient(135deg, hsl(210,90%,50%), hsl(230,90%,50%))",
              boxShadow: "0 0 14px hsla(210,90%,50%,0.4)"
            } : {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))"
            }}
          >
            💳 Cobrar tarjeta
            {pendingOrders.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("facturado")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "facturado"
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={activeTab === "facturado" ? {
              background: "linear-gradient(135deg, hsl(162,72%,38%), hsl(162,72%,30%))",
              boxShadow: "0 0 14px hsla(162,72%,45%,0.4)"
            } : {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))"
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
            Tarjeta facturado
            {tarjetaOrders.length > 0 && (
              <span className="ml-2 bg-accent text-accent-foreground text-xs rounded-full px-1.5 py-0.5">
                {tarjetaOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {activeTab === "cobrar" && (
          <>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {pendingOrders.length} pedidos pendientes de cobro con tarjeta
            </p>
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  <Button
                    className="w-full font-black rounded-xl h-12 text-white"
                    style={{
                      background: "linear-gradient(135deg, hsl(210,90%,50%), hsl(230,80%,55%))",
                      boxShadow: "0 0 12px hsla(210,90%,50%,0.4)"
                    }}
                    onClick={() => markTarjeta.mutate({ id: order.id })}
                    disabled={markTarjeta.isPending}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Cobrar con tarjeta 💳
                  </Button>
                }
              />
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-5xl mb-3">💳</p>
                <p className="font-bold">No hay pedidos pendientes de cobro</p>
                <p className="text-xs mt-1">Los pedidos del menú aparecerán aquí</p>
              </div>
            )}
          </>
        )}

        {activeTab === "facturado" && (
          <>
            <div
              className="rounded-2xl p-4 mb-2"
              style={{
                background: "linear-gradient(135deg, hsla(162,72%,18%,0.8), hsla(162,72%,12%,0.8))",
                border: "1px solid hsla(162,72%,40%,0.3)"
              }}
            >
              <p className="text-sm font-bold" style={{ color: "hsl(162,72%,65%)" }}>
                ✅ Estos pedidos ya fueron cobrados con tarjeta y están esperando factura en caja.
                El cajero debe facturarlos manualmente.
              </p>
            </div>

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {tarjetaOrders.length} pedidos tarjeta — pendientes de factura
            </p>
            {tarjetaOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={null}
              />
            ))}
            {tarjetaOrders.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-5xl mb-3">✅</p>
                <p className="font-bold">No hay pedidos tarjeta por facturar</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}