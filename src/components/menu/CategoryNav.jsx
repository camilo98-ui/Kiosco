import React, { useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryNav({ activeCategory, onSelect }) {
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
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          ref={activeCategory === cat.id ? activeRef : null}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-bold transition-all shrink-0
            ${activeCategory === cat.id
              ? "text-primary-foreground scale-105"
              : "text-muted-foreground hover:text-foreground"
            }`}
          style={activeCategory === cat.id ? {
            background: "linear-gradient(135deg, hsl(42,100%,55%) 0%, hsl(32,100%,55%) 100%)",
            boxShadow: "0 0 14px hsla(42,100%,55%,0.4)"
          } : {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))"
          }}
        >
          <span className="text-base">{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}