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

          {/* Label — clean white capsule */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 999,
              padding: "4px 14px",
              whiteSpace: "nowrap",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#2D1A12",
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
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