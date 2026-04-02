import React, { useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";

// Solo las categorías principales en el tab visible (resto en "Más" como sub-menú)
const MAIN_TABS = ["combos", "helados", "malteadas", "especialidades", "cafe", "galletas"];

export default function PremiumCategoryTabs({ activeCategory, onSelect }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeCategory]);

  const allCats = CATEGORIES;

  return (
    <div
      style={{ borderBottom: "1.5px solid #F0E4EA" }}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: 20, paddingRight: 20 }}
      >
        {allCats.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSelect(cat.id)}
              className="flex items-center gap-1 whitespace-nowrap shrink-0 py-3 px-3 relative transition-colors"
              style={{ border: "none", background: "transparent" }}
            >
              <span style={{ fontSize: 12 }}>{cat.emoji}</span>
              <span
                className="font-bold"
                style={{
                  fontSize: 13,
                  color: isActive ? "#2D1A22" : "#CCCCCC",
                  transition: "color 0.2s",
                }}
              >
                {cat.label}
              </span>
              {/* Línea activa */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: 2, background: "#C2185B", borderRadius: 2 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}