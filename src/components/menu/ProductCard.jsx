import React, { useState } from "react";
import { Plus } from "lucide-react";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAdd }) {
  const isAvailable = product.is_available !== false;
  const tag = TAG_CONFIG[product.tag];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 bg-white transition-all
        ${isAvailable
          ? "border-border hover:border-primary/30 hover:shadow-md cursor-pointer active:scale-[0.98]"
          : "border-border/50 opacity-50"
        }`}
      onClick={isAvailable ? () => onAdd(product) : undefined}
    >
      {tag && product.tag !== "none" && (
        <span className={`absolute -top-2 left-3 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${tag.className}`}>
          {tag.label}
        </span>
      )}

      <div className="flex items-center gap-3 flex-1 min-w-0">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-xl shrink-0 bg-muted"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl shrink-0 bg-secondary flex items-center justify-center text-3xl">
            {product.emoji || "🍦"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`font-bold text-sm leading-tight ${!isAvailable ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {product.name}
          </p>
          {!isAvailable
            ? <span className="text-xs text-destructive font-bold">Agotado</span>
            : <p className="text-primary font-black text-base mt-0.5">{formatCOP(product.price)}</p>
          }
        </div>
      </div>

      {isAvailable && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}