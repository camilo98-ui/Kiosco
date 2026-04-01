import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";

export default function ConfirmationScreen({ order, onNewOrder }) {
  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#F5A623", "#E91E8C", "#26C485", "#3B82F6", "#F59E0B"];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "hsl(230,25%,8%)" }}>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        className="text-8xl mb-4"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-sm w-full"
      >
        {/* Número de pedido */}
        <div
          className="inline-block rounded-3xl px-10 py-4 glow-yellow"
          style={{ background: "linear-gradient(135deg, hsl(42,100%,52%), hsl(32,100%,52%))" }}
        >
          <p className="text-5xl font-black text-primary-foreground">#{order.order_number}</p>
        </div>

        <h1 className="text-2xl font-black leading-tight text-foreground">
          ¡Listo, {order.customer_name}! 🍦✨
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Tu pedido está siendo preparado con mucho amor.<br />
          ¡Gracias por elegir Popsy! 💛
        </p>

        {/* Resumen */}
        <div
          className="rounded-2xl p-4 text-left space-y-2 border border-border/60"
          style={{ background: "hsl(var(--card))" }}
        >
          <p className="font-black text-xs text-muted-foreground uppercase tracking-wider mb-2">Tu pedido</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-foreground/80">{item.quantity}× {item.product_name}</span>
              <span className="font-bold text-foreground">{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border/60 pt-2 flex justify-between font-black">
            <span className="text-muted-foreground">Total</span>
            <span className="text-primary">{formatCOP(order.total)}</span>
          </div>
        </div>

        {/* Info */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "hsla(42,100%,55%,0.1)", border: "1px solid hsla(42,100%,55%,0.2)" }}
        >
          <p className="font-bold text-sm text-foreground">
            📍 Preséntate en caja con tu número{" "}
            <span className="text-primary font-black">#{order.order_number}</span>
          </p>
        </div>

        <Button
          onClick={onNewOrder}
          className="w-full h-14 text-base font-black rounded-2xl glow-yellow"
          style={{
            background: "linear-gradient(135deg, hsl(42,100%,52%), hsl(32,100%,52%))",
            color: "hsl(230,25%,8%)"
          }}
        >
          Hacer otro pedido 🍦
        </Button>
      </motion.div>
    </div>
  );
}