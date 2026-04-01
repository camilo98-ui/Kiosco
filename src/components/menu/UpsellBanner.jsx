import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function UpsellBanner({ message, onDismiss, onAccept }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-40 bg-secondary text-secondary-foreground rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 max-w-lg mx-auto"
        >
          <p className="font-bold text-sm flex-1">{message}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onAccept}
              className="bg-white text-secondary font-bold px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform"
            >
              ¡Sí!
            </button>
            <button onClick={onDismiss} className="p-2 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}