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
      className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          ref={activeCategory === cat.id ? activeRef : null}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all shrink-0 ${
            activeCategory === cat.id
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-card text-foreground border border-border hover:bg-muted"
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}