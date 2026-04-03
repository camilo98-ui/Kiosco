import React, { useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";

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

  return (
    <div style={{ background: "#fff", borderBottom: "1.5px solid #F0E4EA" }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          padding: "0 12px",
          gap: 4,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "10px 12px",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2.5px solid #C2185B" : "2.5px solid transparent",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: isActive ? 800 : 500,
                color: isActive ? "#C2185B" : "#BBA8B0",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 15 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}