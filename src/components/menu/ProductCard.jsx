import React from "react";
import { Plus } from "lucide-react";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAdd }) {
  const isAvailable = product.is_available !== false;
  const tag = TAG_CONFIG[product.tag];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card rounded-2xl border border-border p-4 flex items-center justify-between gap-3 transition-all ${
        isAvailable ? "hover:shadow-md hover:border-primary/30" : "opacity-50"
      }`}
    >
      {tag && product.tag !== "none" && (
        <span className={`absolute -top-2 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${tag.className}`}>
          {tag.label}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-tight ${!isAvailable ? "line-through text-muted-foreground" : ""}`}>
          {product.name}
        </p>
        {!isAvailable && (
          <span className="text-xs text-destructive font-bold">Agotado</span>
        )}
        <p className="text-primary font-bold text-base mt-1">
          {formatCOP(product.price)}
        </p>
      </div>

      {isAvailable && (
        <button
          onClick={() => onAdd(product)}
          className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}