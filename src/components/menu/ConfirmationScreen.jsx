import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";

export default function ConfirmationScreen({ order, onNewOrder }) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#F5A623", "#E91E63", "#4CAF50", "#2196F3", "#FF9800"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-8xl mb-4"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-md"
      >
        <div className="bg-primary text-primary-foreground rounded-3xl px-8 py-4 inline-block">
          <p className="text-5xl font-black">#{order.order_number}</p>
        </div>

        <h1 className="text-2xl font-black leading-tight">
          ¡Tu pedido está en camino, {order.customer_name}! 🍦✨
        </h1>

        <p className="text-muted-foreground leading-relaxed">
          En Popsy creemos que la felicidad tiene sabor, color y mucho amor.<br />
          ¡Gracias por ser parte de nuestra familia! 💛🌈
        </p>

        <div className="bg-card rounded-2xl border border-border p-4 text-left space-y-2">
          <p className="font-bold text-sm text-muted-foreground">Resumen del pedido</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.product_name}</span>
              <span className="font-semibold">{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between font-black">
            <span>Total</span>
            <span className="text-primary">{formatCOP(order.total)}</span>
          </div>
        </div>

        <div className="bg-muted rounded-2xl p-4">
          <p className="font-bold text-sm">
            📍 Preséntate en caja con tu número <span className="text-primary">#{order.order_number}</span>
          </p>
        </div>

        <Button
          onClick={onNewOrder}
          className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 mt-4"
        >
          Hacer otro pedido 🍦
        </Button>
      </motion.div>
    </motion.div>
  );
}