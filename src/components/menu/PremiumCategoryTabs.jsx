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
      



























      
    </div>);

}