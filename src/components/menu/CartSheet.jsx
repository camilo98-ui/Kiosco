import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { formatCOP } from "@/lib/constants";

export default function CartSheet({ onCheckout }) {
  const { cart, updateQuantity, removeItem, updateNotes, total, itemCount } = useCart();
  const [editingNotes, setEditingNotes] = useState(null);
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 left-4 right-4 z-30 bg-primary text-primary-foreground rounded-2xl p-4 shadow-xl flex items-center justify-between max-w-lg mx-auto transition-all active:scale-[0.98] hover:opacity-95">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs font-black bg-white text-primary">
                {itemCount}
              </span>
            </div>
            <span className="font-black">Ver pedido</span>
          </div>
          <span className="font-black text-lg">{formatCOP(total)}</span>
        </button>
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto bg-white border-t border-border">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-xl font-black flex items-center gap-2 text-foreground">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Tu pedido
            <span className="ml-auto text-sm font-bold text-muted-foreground">{itemCount} items</span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-2 mt-3">
          {cart.map((item, index) => (
            <div key={index} className="rounded-2xl p-3 bg-muted/50 border border-border">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-foreground">{item.product_name}</p>
                  <p className="text-primary font-black text-sm">{formatCOP(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary/40">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black w-6 text-center text-foreground">{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeItem(index)}
                    className="w-8 h-8 rounded-full flex items-center justify-center ml-1 text-destructive hover:bg-destructive/10">
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
                  <Button size="sm" variant="ghost" className="text-xs mt-1 text-primary" onClick={() => setEditingNotes(null)}>
                    Listo ✓
                  </Button>
                </div>
              ) : (
                <button onClick={() => setEditingNotes(index)}
                  className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5 hover:text-foreground">
                  <MessageSquare className="w-3 h-3" />
                  {item.notes || "Agregar nota"}
                </button>
              )}
              {item.notes && editingNotes !== index && (
                <p className="text-xs text-muted-foreground italic mt-1">📝 {item.notes}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-xl font-black mb-4 px-1">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatCOP(total)}</span>
          </div>
          <Button
            className="w-full h-14 text-base font-black rounded-2xl bg-primary hover:bg-primary/90 text-white"
            onClick={() => { setOpen(false); onCheckout(); }}
          >
            ¡Confirmar pedido! 🎉
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}