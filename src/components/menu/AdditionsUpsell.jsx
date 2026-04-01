import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Sparkles } from "lucide-react";
import { formatCOP } from "@/lib/constants";

// Categorías que disparan upsell de adiciones
const ADDABLE_CATEGORIES = ["helados", "malteadas", "especialidades", "combos", "tortas"];

export default function AdditionsUpsell({ lastAdded, additions, onAdd, onDismiss }) {
  if (!lastAdded || !ADDABLE_CATEGORIES.includes(lastAdded.category)) return null;
  if (!additions || additions.length === 0) return null;

  // Mostrar máx 4 adiciones populares
  const topAdditions = additions
    .filter(a => a.is_available !== false)
    .sort((a, b) => {
      // Priorizar mas_vendido
      if (a.tag === "mas_vendido") return -1;
      if (b.tag === "mas_vendido") return 1;
      return 0;
    })
    .slice(0, 4);

  const messages = {
    helados: `🍫 ¡Personaliza tu helado con una adición!`,
    malteadas: `✨ ¿Le sumamos algo especial a tu malteada?`,
    especialidades: `🍒 ¡Hazlo aún más especial con una adición!`,
    combos: `➕ ¡Completa tu combo con una adición!`,
    tortas: `🍦 ¿Una bola de helado para acompañar la torta?`,
  };

  const msg = messages[lastAdded.category] || "¿Le agregamos algo más?";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed bottom-24 left-4 right-4 z-40 max-w-lg mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-primary/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="font-black text-sm text-foreground">{msg}</p>
            </div>
            <button
              onClick={onDismiss}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Adiciones en grid horizontal */}
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {topAdditions.map((addition) => (
              <button
                key={addition.id}
                onClick={() => { onAdd(addition); onDismiss(); }}
                className="shrink-0 flex flex-col items-center gap-1.5 bg-secondary/50 hover:bg-secondary border border-border rounded-2xl p-3 w-24 transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">{addition.emoji || "➕"}</span>
                <p className="text-[10px] font-bold text-center leading-tight text-foreground line-clamp-2">{addition.name}</p>
                <div className="flex items-center gap-0.5 bg-primary text-white rounded-full px-2 py-0.5">
                  <Plus className="w-2.5 h-2.5" />
                  <span className="text-[10px] font-black">{formatCOP(addition.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}