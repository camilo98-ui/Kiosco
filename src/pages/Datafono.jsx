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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div
        className="sticky top-0 z-20 border-b border-border bg-white"
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <PopsyLogo size="small" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-black text-blue-600">DATÁFONO</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab("cobrar")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all border ${
              activeTab === "cobrar"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            💳 Cobrar tarjeta
            {pendingOrders.length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("facturado")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all border ${
              activeTab === "facturado"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
            Tarjeta facturado
            {tarjetaOrders.length > 0 && (
              <span className="ml-2 bg-accent text-white text-xs rounded-full px-1.5 py-0.5">
                {tarjetaOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 bg-background min-h-screen">
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
                    className="w-full font-black rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white"
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
            <div className="rounded-2xl p-4 mb-2 bg-green-50 border border-green-200">
              <p className="text-sm font-bold text-green-700">
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