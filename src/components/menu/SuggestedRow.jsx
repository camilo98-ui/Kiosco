import React, { useState } from "react";
import { Plus } from "lucide-react";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";

const PASTELS = ["#FFF0F5", "#F0FFF4", "#FFFAF0", "#FFF5F0", "#F0F5FF"];

export default function SuggestedRow({ products, onAdd }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Label sección */}
      <p
        className="uppercase font-extrabold tracking-widest px-5 mb-3"
        style={{ fontSize: 8, color: "#BBA8B0", letterSpacing: "2px" }}
      >
        También te puede gustar
      </p>

      <div
        className="flex gap-3 overflow-x-auto pl-5 pr-5"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p, idx) => {
          const tag = TAG_CONFIG[p.tag];
          const pastel = PASTELS[idx % PASTELS.length];
          const [imgError, setImgError] = React.useState(false);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="shrink-0 flex flex-col"
              style={{
                width: 96,
                background: "#FFFFFF",
                border: "1.5px solid #F0E4EA",
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Imagen / emoji zona pastel */}
              <div
                className="flex items-center justify-center"
                style={{ height: 66, background: pastel, position: "relative" }}
              >
                {p.image_url && !imgError ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ fontSize: 32 }}>{p.emoji || "🍦"}</span>
                )}
                {/* Badge Chef */}
                {tag && p.tag === "recomendado" && (
                  <span
                    className="absolute top-1.5 left-1.5 font-black"
                    style={{
                      fontSize: 8,
                      background: "#FCE4EC",
                      color: "#880E4F",
                      borderRadius: 20,
                      padding: "2px 6px",
                    }}
                  >
                    ⭐ Chef
                  </span>
                )}
              </div>

              {/* Texto */}
              <div className="flex flex-col gap-0.5 p-2 pb-7">
                <p
                  className="font-extrabold leading-tight line-clamp-2"
                  style={{ fontSize: 10, color: "#2D1A22" }}
                >
                  {p.name}
                </p>
                <p className="font-black" style={{ fontSize: 10, color: "#C2185B" }}>
                  {formatCOP(p.price)}
                </p>
              </div>

              {/* Botón + */}
              <button
                onClick={() => onAdd(p)}
                className="absolute bottom-2 right-2 flex items-center justify-center transition-transform active:scale-90 hover:scale-110"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#C2185B",
                  color: "#fff",
                  boxShadow: "0 2px 6px rgba(194,24,91,0.35)",
                }}
              >
                <Plus size={13} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}