import React, { useRef } from "react";


export default function CategoryGrid({ categories, productCounts, onSelect }) {
  const containerRef = useRef(null);
  const startX = useRef(null);
  const scrollLeft = useRef(null);

  const handleMouseDown = (e) => {
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!startX.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    startX.current = null;
    containerRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: "flex",
        gap: 12,
        padding: "0 16px",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        cursor: "grab",
      }}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          style={{
            position: "relative",
            minWidth: 160,
            height: 210,
            borderRadius: 32,
            overflow: "hidden",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 12px 40px 0 rgba(100,60,30,0.10), 0 2px 8px 0 rgba(100,60,30,0.06)",
          }}
        >
          {/* Imagen de fondo */}
          {category.image && (
            <img
              src={category.image}
              alt={category.label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Glassmorphism panel inferior — ultra-thin 20% */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "18%",
              background: "rgba(255,255,255,0.20)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                lineHeight: 1.2,
                fontFamily: "'Poppins', sans-serif",
                textShadow: "0 1px 4px rgba(0,0,0,0.25)",
                letterSpacing: "0.01em",
              }}
            >
              {category.label}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}