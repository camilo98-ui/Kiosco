import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function UpsellBanner({ message, onDismiss, onAccept }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-4 right-4 z-40 max-w-lg mx-auto"
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-3 shadow-lg border"
            style={{
              background: "white",
              borderColor: "hsl(338,82%,44%)",
              borderWidth: "1.5px"
            }}
          >
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "hsl(338,70%,92%)" }}>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-sm flex-1 text-foreground">{message}</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onAccept}
                className="font-black px-4 py-2 rounded-xl text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                ¡Sí!
              </button>
              <button
                onClick={onDismiss}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}