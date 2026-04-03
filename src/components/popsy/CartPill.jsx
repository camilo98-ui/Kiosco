import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

export default function CartPill({ items, total }) {
  return (
    <AnimatePresence>
      {items > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: 388,
            zIndex: 100,
          }}
        >
          <button
            style={{
              width: "100%",
              background: "#1A0A10",
              borderRadius: 50,
              padding: "13px 18px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(26,10,16,0.45)",
            }}
          >
            {/* Left: count + text */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#E8004D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {items}
              </span>
              <span
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Ver pedido
              </span>
            </div>

            {/* Right: total */}
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {formatCOP(total)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}