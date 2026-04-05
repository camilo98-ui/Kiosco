import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, MessageSquare, Droplet } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import ProductDetailLine from "@/components/menu/ProductDetailLine.jsx";

// Umbrales de incentivo para aumentar ticket
const INCENTIVE_THRESHOLDS = [
  { min: 0,     max: 20000,  msg: "🍦 ¡Agrega algo más y arma el combo perfecto!" },
  { min: 20000, max: 40000,  msg: "🚀 ¡Solo te faltan un poco para el domicilio gratis!" },
  { min: 40000, max: 60000,  msg: "🎉 ¡Domicilio gratis desbloqueado! ¿Le sumamos algo?" },
  { min: 60000, max: 999999, msg: "⭐ ¡Pedido top! Revisa las adiciones para completarlo" },
];

function getIncentive(total) {
  return INCENTIVE_THRESHOLDS.find(t => total >= t.min && total < t.max)?.msg || null;
}

export default function PremiumCartBar({ onCheckout }) {
  const { cart, updateQuantity, removeItem, updateNotes, total, itemCount, addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState(null);
  const hasWater = cart.some(item => item.product_id === "water");

  if (itemCount === 0) return null;

  return (
    <>
      {/* Pill flotante */}
      <AnimatePresence>
        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="fixed z-30 flex items-center justify-between active:scale-[0.98] transition-transform"
          style={{
            bottom: 20,
            left: 22,
            right: 22,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            background: "#C41E6A",
            borderRadius: 18,
            padding: "12px 18px",
            boxShadow: "0 6px 24px rgba(233,27,139,0.4)",
            touchAction: "manipulation",
          }}
          data-cart-icon
        >
          {/* Izquierda: círculo contador + texto */}
          <div className="flex flex-col items-start gap-0">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex items-center justify-center font-black"
                style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", color: "#E91B8B", fontSize: 14, willChange: "transform" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                {itemCount}
              </motion.div>
              <span className="font-black text-white" style={{ fontSize: 15 }}>Ver mi pedido</span>
            </div>
            {getIncentive(total) && (
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.82)", marginTop: 2, marginLeft: 44, fontWeight: 600, lineHeight: 1.2 }}>
                {getIncentive(total)}
              </p>
            )}
          </div>
          {/* Derecha: precio */}
          <span className="font-black text-white" style={{ fontSize: 16 }}>
            {formatCOP(total)}
          </span>
        </motion.button>
      </AnimatePresence>

      {/* Sheet del pedido */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[88vh] overflow-y-auto"
          style={{ background: "#FFFCFD", border: "none" }}
        >
          <SheetHeader className="pb-2">
            <SheetTitle
              className="flex items-center justify-between"
              style={{ fontSize: 18, color: "#2D1A22" }}
            >
              <span className="font-black">Tu pedido</span>
              <span style={{ fontSize: 13, color: "#BBA8B0", fontWeight: 600 }}>
                {itemCount} items
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-2 mt-3">
            {cart.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-3"
                style={{ background: "#FFF0F5", border: "1.5px solid #F0E4EA" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "#2D1A22" }}>
                      {item.product_name}
                    </p>
                    <ProductDetailLine item={item} />
                    <p className="font-black text-sm" style={{ color: "#C41E6A", marginTop: 4 }}>
                       {formatCOP(item.price * item.quantity)}
                     </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                       onClick={() => updateQuantity(index, item.quantity - 1)}
                       className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ background: "#fff", border: "1.5px solid #F0E4EA" }}
                     >
                       <Minus className="w-3 h-3" style={{ color: "#999" }} />
                     </button>
                     <span className="font-black w-6 text-center" style={{ color: "#2D1A22" }}>
                       {item.quantity}
                     </span>
                     <button
                       onClick={() => updateQuantity(index, item.quantity + 1)}
                       className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ background: "#E91B8B" }}
                     >
                       <Plus className="w-3 h-3 text-white" />
                     </button>
                     <button
                       onClick={() => removeItem(index)}
                       className="w-8 h-8 rounded-full flex items-center justify-center ml-1"
                       style={{ color: "#CCC" }}
                     >
                       <Trash2 className="w-3 h-3" />
                     </button>
                  </div>
                </div>
                {editingNotes === index ? (
                  <div className="mt-2">
                    <Textarea
                      placeholder="Ej: sin nueces, más salsa..."
                      value={item.notes}
                      onChange={(e) => updateNotes(index, e.target.value)}
                      className="text-xs h-14"
                      autoFocus
                    />
                    <button
                       className="text-xs mt-1 font-bold"
                       style={{ color: "#E91B8B" }}
                       onClick={() => setEditingNotes(null)}
                     >
                       Listo ✓
                     </button>
                  </div>
                ) : (
                  !item.notes && (
                    <button
                      onClick={() => setEditingNotes(index)}
                      className="flex items-center gap-1 mt-1.5"
                      style={{ fontSize: 11, color: "#BBA8B0" }}
                    >
                      <MessageSquare className="w-3 h-3" />
                      Agregar nota
                    </button>
                  )
                )}
              </div>
            ))}
          </div>

          {!hasWater && (
            <button
              onClick={() => {
                addItem({ product_id: "water", product_name: "Agua", price: 3500, category: "bebidas", emoji: "💧" });
                setTimeout(() => setOpen(false), 200);
              }}
              className="w-full rounded-xl p-3 mb-3 bg-blue-50 border border-blue-200 flex items-center gap-2 hover:bg-blue-100 transition-colors"
            >
              <Droplet size={16} style={{ color: "#1E88E5" }} />
              <span className="flex-1 text-left font-bold text-sm" style={{ color: "#1E88E5" }}>
                Agregar agua · {formatCOP(3500)}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64B5F6" }}>+</span>
            </button>
          )}

          <div className="mt-4 pt-4" style={{ borderTop: "1.5px solid #F0E4EA" }}>
             <div className="flex justify-between font-black mb-4 px-1" style={{ fontSize: 20 }}>
               <span style={{ color: "#2D1A22" }}>Total</span>
               <span style={{ color: "#E91B8B" }}>{formatCOP(total)}</span>
             </div>
             <button
               className="w-full font-black text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
               style={{
                 height: 56, borderRadius: 18,
                 background: "#C41E6A",
                 fontSize: 15,
                 boxShadow: "0 4px 16px rgba(233,27,139,0.35)",
               }}
               onClick={() => { setOpen(false); onCheckout(); }}
             >
               ¡Confirmar pedido! 🎉
             </button>
           </div>
        </SheetContent>
      </Sheet>
    </>
  );
}