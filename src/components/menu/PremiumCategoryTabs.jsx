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
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", padding: "10px 10px" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSelect(cat.id)}
              className="shrink-0 whitespace-nowrap font-bold transition-all"
              style={{
                fontSize: 10,
                letterSpacing: "0.5px",
                padding: "7px 14px",
                borderRadius: 30,
                border: "none",
                background: isActive ? "#C2185B" : "transparent",
                color: isActive ? "#fff" : "#BBA8B0",
                fontWeight: 700,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}