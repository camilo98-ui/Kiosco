import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderCard from "@/components/orders/OrderCard";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Datafono() {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders-datafono"],
    queryFn: () => base44.entities.Order.filter({ status: "pendiente" }, "-created_date", 50),
    refetchInterval: 3000,
  });

  const updateOrder = useMutation({
    mutationFn: ({ id }) =>
      base44.entities.Order.update(id, { status: "pagado_tarjeta", payment_method: "tarjeta" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-datafono"] });
      toast.success("Pago con tarjeta registrado 💳");
    },
  });

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
          <span className="text-sm font-bold text-blue-500">💳 DATÁFONO</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <p className="text-sm font-bold text-muted-foreground">
          {orders.length} pedidos pendientes de cobro
        </p>

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            actions={
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl h-12"
                onClick={() => updateOrder.mutate({ id: order.id })}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Cobrar con tarjeta 💳
              </Button>
            }
          />
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-2">💳</p>
            <p className="font-semibold">No hay pedidos pendientes de cobro</p>
          </div>
        )}
      </div>
    </div>
  );
}