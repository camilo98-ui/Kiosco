import React from "react";
import { formatCOP } from "@/lib/constants";
import { DollarSign, ShoppingBag, TrendingUp, CreditCard, Banknote } from "lucide-react";

export default function DaySummary({ orders }) {
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(
    (o) => o.created_date && o.created_date.startsWith(today)
  );
  const finalized = todayOrders.filter((o) => o.status === "finalizado");

  const totalRevenue = finalized.reduce((sum, o) => sum + (o.total || 0), 0);
  const cardTotal = finalized
    .filter((o) => o.payment_method === "tarjeta")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const cashTotal = totalRevenue - cardTotal;

  // Top products
  const productCount = {};
  finalized.forEach((o) =>
    o.items?.forEach((item) => {
      productCount[item.product_name] = (productCount[item.product_name] || 0) + item.quantity;
    })
  );
  const topProducts = Object.entries(productCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-primary/10 rounded-2xl p-4 col-span-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          Total recaudado hoy
        </div>
        <p className="text-3xl font-black text-primary mt-1">{formatCOP(totalRevenue)}</p>
      </div>
      <div className="bg-card rounded-2xl border border-border p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ShoppingBag className="w-3 h-3" />
          Pedidos
        </div>
        <p className="text-2xl font-black mt-1">{finalized.length}</p>
      </div>
      <div className="bg-card rounded-2xl border border-border p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          Ticket promedio
        </div>
        <p className="text-2xl font-black mt-1">
          {finalized.length > 0 ? formatCOP(totalRevenue / finalized.length) : "$0"}
        </p>
      </div>
      <div className="bg-card rounded-2xl border border-border p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Banknote className="w-3 h-3" />
          Efectivo
        </div>
        <p className="text-lg font-bold mt-1">{formatCOP(cashTotal)}</p>
      </div>
      <div className="bg-card rounded-2xl border border-border p-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CreditCard className="w-3 h-3" />
          Tarjeta
        </div>
        <p className="text-lg font-bold mt-1">{formatCOP(cardTotal)}</p>
      </div>
      {topProducts.length > 0 && (
        <div className="col-span-2 bg-card rounded-2xl border border-border p-3">
          <p className="text-xs text-muted-foreground font-semibold mb-2">🏆 Top 3 productos</p>
          {topProducts.map(([name, count], i) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{["🥇", "🥈", "🥉"][i]} {name}</span>
              <span className="font-bold">{count} uds</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}