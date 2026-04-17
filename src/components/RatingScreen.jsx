import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

const MAGENTA = "#E8187A";

const PLACEHOLDERS = {
  5: "¿Qué fue lo que más te gustó?",
  4: "¿Qué podemos mejorar?",
  3: "¿Qué podemos mejorar?",
  2: "Queremos saber qué pasó",
  1: "Queremos saber qué pasó",
};

export default function RatingScreen({ order, store, onDone }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return;
    setLoading(true);
    try {
      await base44.entities.Rating.create({
        store_slug: store?.slug || "default",
        store_name: store?.name || "Popsy",
        score,
        comment,
        order_number: order?.order_number,
      });
    } catch (e) {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFFAF9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{ textAlign: "center", maxWidth: 360 }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1A0A10", margin: "0 0 10px", fontFamily: "'Poppins', sans-serif" }}>
            ¡Gracias por tu calificación!
          </h2>
          <p style={{ fontSize: 15, color: "#888", margin: "0 0 32px", lineHeight: 1.5 }}>
            Tu opinión nos ayuda a mejorar cada día 💕
          </p>
          <button
            onClick={onDone}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: MAGENTA, color: "#fff", fontSize: 16, fontWeight: 800,
              border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 4px 16px rgba(232,24,122,0.35)",
            }}
          >
            Volver al inicio 🍦
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFAF9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1A0A10", margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>
            ¿Cómo fue tu experiencia en {store?.name || "Popsy"}?
          </h2>
          <p style={{ fontSize: 14, color: "#AAA", margin: 0 }}>
            Pedido #{order?.order_number}
          </p>
        </div>

        {/* Stars */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "24px 20px", marginBottom: 16, boxShadow: "0 2px 16px rgba(196,30,106,0.06)", border: "1.5px solid #FFE4F3" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#888", textAlign: "center", margin: "0 0 16px" }}>
            Toca para calificar
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setScore(s)}
                style={{
                  fontSize: score >= s ? 40 : 32,
                  background: "none", border: "none", cursor: "pointer", padding: 4,
                  filter: score >= s ? "none" : "grayscale(1) opacity(0.4)",
                  transition: "all 0.15s ease",
                  transform: score === s ? "scale(1.2)" : "scale(1)",
                }}
              >
                ⭐
              </button>
            ))}
          </div>

          {score > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={PLACEHOLDERS[score]}
                rows={3}
                style={{
                  width: "100%", border: "1.5px solid #FFE4F3", borderRadius: 14,
                  padding: "12px 14px", fontSize: 14, color: "#1A0A10",
                  fontFamily: "'Poppins', sans-serif", resize: "none", outline: "none",
                  background: "#FFFAF9", boxSizing: "border-box", lineHeight: 1.5,
                }}
              />
            </motion.div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={score === 0 || loading}
          style={{
            width: "100%", height: 56, borderRadius: 18,
            background: score === 0 ? "#EEE" : MAGENTA,
            color: score === 0 ? "#AAA" : "#fff",
            fontSize: 16, fontWeight: 800, border: "none",
            cursor: score === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: score > 0 ? "0 4px 16px rgba(232,24,122,0.35)" : "none",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Enviando..." : "Enviar calificación ✨"}
        </button>

        <button
          onClick={onDone}
          style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: "#BBA8B0", fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif", padding: 8 }}
        >
          Omitir
        </button>
      </motion.div>
    </div>
  );
}