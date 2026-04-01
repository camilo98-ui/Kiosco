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
          <div className="rounded-2xl p-4 flex items-center gap-3 shadow-2xl glow-pink"
            style={{
              background: "linear-gradient(135deg, hsl(338,90%,28%) 0%, hsl(280,70%,22%) 100%)",
              border: "1px solid hsla(338,90%,58%,0.4)"
            }}
          >
            <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "hsla(338,90%,58%,0.25)" }}>
              <Sparkles className="w-5 h-5" style={{ color: "hsl(338,90%,70%)" }} />
            </div>
            <p className="font-bold text-sm flex-1 text-white">{message}</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onAccept}
                className="font-black px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "hsl(338,90%,58%)",
                  color: "white",
                  boxShadow: "0 0 12px hsla(338,90%,58%,0.5)"
                }}
              >
                ¡Sí! ✨
              </button>
              <button
                onClick={onDismiss}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ background: "hsla(0,0%,100%,0.1)" }}
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}