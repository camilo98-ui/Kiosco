import React from "react";

export default function ProductDetailLine({ item }) {
  if (!item.notes) return null;

  // Parsear notas - pueden venir en varios formatos
  const lines = [];
  const notes = String(item.notes).trim();
  
  if (!notes) return null;

  // Dividir por pipe (|) o saltos de línea
  const sections = notes.split(/\||\n/).map(s => s.trim()).filter(Boolean);
  
  sections.forEach(section => {
    if (section) {
      lines.push(section);
    }
  });

  if (lines.length === 0) return null;

  return (
    <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: 9, color: "#666", lineHeight: 1.4, marginLeft: 0 }}>
          📝 {line}
        </div>
      ))}
    </div>
  );
}