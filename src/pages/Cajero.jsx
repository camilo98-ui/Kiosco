import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderCard from "@/components/orders/OrderCard";
import DaySummary from "@/components/orders/DaySummary";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

export default function Cajero() {
  const [showSummary, setShowSummary] = useState(false);
  const [posAlert, setPosAlert] = useState(null);
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
    },
  });

  const handleFinalize = (order) => {
    if (order.status === "pendiente") {
      updateOrder.mutate({
        id: order.id,
        data: { status: "finalizado", payment_method: "efectivo" },
      });
    } else if (order.status === "pagado_tarjeta") {
      setPosAlert(order);
    }
  };

  const handlePosConfirm = () => {
    if (posAlert) {
      updateOrder.mutate({
        id: posAlert.id,
        data: { status: "finalizado", payment_method: "tarjeta" },
      });
      setPosAlert(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <PopsyLogo size="small" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">CAJERO</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(!showSummary)}
              className="rounded-full"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {showSummary && <DaySummary orders={orders} />}

        <p className="text-sm font-bold text-muted-foreground">
          {activeOrders.length} pedidos activos
        </p>

        {activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            actions={
              <>
                {order.status === "pendiente" && (
                  <Button
                    className="flex-1 bg-accent text-accent-foreground font-bold rounded-xl"
                    onClick={() => handleFinalize(order)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cobrado y facturado
                  </Button>
                )}
                {order.status === "pagado_tarjeta" && (
                  <Button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
                    onClick={() => handleFinalize(order)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Facturado en POS
                  </Button>
                )}
              </>
            }
          />
        ))}

        {activeOrders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-2">✨</p>
            <p className="font-semibold">No hay pedidos pendientes</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!posAlert} onOpenChange={() => setPosAlert(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">
              ⚠️ FALTA FACTURAR EN POS
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Este pedido fue pagado con tarjeta. Asegúrate de registrar la factura en el POS antes de continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              className="bg-accent text-accent-foreground rounded-xl font-bold"
              onClick={handlePosConfirm}
            >
              Ya facturé en POS ✅
            </AlertDialogAction>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}