import React, { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cartStore";
import { toast } from "sonner";

export default function SearchModal({ open, onClose, products, onAddProduct }) {
  const [query, setQuery] = useState("");
  const { addItem } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.is_available !== false && (p.name.toLowerCase().includes(q) || p.category.includes(q)))
      .slice(0, 8);
  }, [query, products]);

  const handleAdd = (product) => {
    // Llamar a onAddProduct que abre customizers si es necesario
    onAddProduct(product);
    toast.success(`✓ ${product.name} agregado`, {
      style: {
        background: "#C41E6A",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
      },
      duration: 1500,
    });
    setQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-3xl bg-white border-border p-0 overflow-hidden">
        <div className="p-4">
          <Input
            placeholder="Buscar producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 text-base rounded-xl border-border bg-muted text-center font-semibold"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto px-4 pb-4 space-y-2">
          {results.length === 0 && query && (
            <p className="text-center text-muted-foreground py-6">No encontramos nada 😢</p>
          )}
          {results.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => handleAdd(product)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-secondary border border-border transition-colors text-left"
            >
              <span className="text-2xl">{product.emoji || "🍦"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <span className="font-black text-sm text-primary flex-shrink-0">{formatCOP(product.price)}</span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}