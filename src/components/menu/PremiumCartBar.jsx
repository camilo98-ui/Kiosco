import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumCartBar({ onCheckout }) {
  const { cart, updateQuantity, removeItem, updateNotes, total, itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState(null);

  if (itemCount === 0) return null;

  return (
    <>
      {/* Pill flotante */}
      <AnimatePresence>
        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={() => setOpen(true)}
          className="fixed z-30 flex items-center justify-between active:scale-[0.98] transition-transform"
          style={{
            bottom: 20,
            left: 22,
            right: 22,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            background: "#C2185B",
            borderRadius: 18,
            padding: "12px 18px",
            boxShadow: "0 6px 24px rgba(194,24,91,0.4)",
          }}
        >
          {/* Izquierda: círculo contador + texto */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center font-black"
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#fff",
                color: "#C2185B",
                fontSize: 14,
              }}
            >
              {itemCount}
            </div>
            <span className="font-black text-white" style={{ fontSize: 15 }}>
              Ver mi pedido
            </span>
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
                    <p className="font-black text-sm" style={{ color: "#C2185B" }}>
                      {formatCOP(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#fff", border: "1.5px solid #F0E4EA" }}
                    >
                      <Minus className="w-3 h-3" style={{ color: "#2D1A22" }} />
                    </button>
                    <span className="font-black w-6 text-center" style={{ color: "#2D1A22" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#C2185B" }}
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center ml-1"
                      style={{ color: "#C2185B" }}
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
                      style={{ color: "#C2185B" }}
                      onClick={() => setEditingNotes(null)}
                    >
                      Listo ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingNotes(index)}
                    className="flex items-center gap-1 mt-1.5"
                    style={{ fontSize: 11, color: "#BBA8B0" }}
                  >
                    <MessageSquare className="w-3 h-3" />
                    {item.notes || "Agregar nota"}
                  </button>
                )}
                {item.notes && editingNotes !== index && (
                  <p className="italic mt-1" style={{ fontSize: 11, color: "#BBA8B0" }}>
                    📝 {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: "1.5px solid #F0E4EA" }}>
            <div className="flex justify-between font-black mb-4 px-1" style={{ fontSize: 20 }}>
              <span style={{ color: "#2D1A22" }}>Total</span>
              <span style={{ color: "#C2185B" }}>{formatCOP(total)}</span>
            </div>
            <button
              className="w-full font-black text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{
                height: 56, borderRadius: 18,
                background: "#C2185B",
                fontSize: 15,
                boxShadow: "0 4px 16px rgba(194,24,91,0.35)",
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