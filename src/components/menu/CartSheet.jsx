import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { formatCOP } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export default function CartSheet({ onCheckout }) {
  const { cart, updateQuantity, removeItem, updateNotes, total, itemCount } = useCart();
  const [editingNotes, setEditingNotes] = useState(null);
  const [open, setOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 left-4 right-4 z-30 bg-primary text-primary-foreground rounded-2xl p-4 shadow-xl flex items-center justify-between max-w-lg mx-auto hover:shadow-2xl transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-xs">
                {itemCount}
              </Badge>
            </div>
            <span className="font-bold">Ver carrito</span>
          </div>
          <span className="font-black text-lg">{formatCOP(total)}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-black">Tu pedido 🛒</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-4">
          {cart.map((item, index) => (
            <div key={index} className="bg-muted rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.product_name}</p>
                  <p className="text-primary font-bold text-sm">{formatCOP(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="w-8 h-8 rounded-full text-destructive hover:bg-destructive/10 flex items-center justify-center ml-1"
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
                    className="text-xs h-16"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" className="text-xs mt-1" onClick={() => setEditingNotes(null)}>
                    Listo
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNotes(index)}
                  className="flex items-center gap-1 text-xs text-muted-foreground mt-1 hover:text-foreground"
                >
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
        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between text-lg font-black mb-4">
            <span>Total</span>
            <span className="text-primary">{formatCOP(total)}</span>
          </div>
          <Button
            className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90"
            onClick={() => {
              setOpen(false);
              onCheckout();
            }}
          >
            Confirmar pedido 🎉
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}