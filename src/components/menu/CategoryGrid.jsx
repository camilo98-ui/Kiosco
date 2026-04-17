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
            height: 200,
            borderRadius: 16,
            overflow: "hidden",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 10px 25px 0 rgba(45,26,18,0.08)",
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

          {/* Glassmorphism panel inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "20%",
              background: "rgba(255,255,255,0.40)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 12,
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#3D2B1F",
                margin: 0,
                lineHeight: 1.2,
                fontFamily: "'Poppins', sans-serif",
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