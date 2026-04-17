import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CookieJaarLayout from "@/components/menu/CookieJaarLayout";

export default function CookieJaarModal({ open, onClose, onAdd, addedFlash }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 600,
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F5EAEF", flexShrink: 0 }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Cookie Jaar 🍪</p>
              <button
                onClick={onClose}
                style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 14 }}>
              <CookieJaarLayout onAdd={onAdd} addedFlash={addedFlash} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}