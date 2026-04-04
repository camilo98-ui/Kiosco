import React from "react";

export default function ProductDetailLine({ item }) {
  if (!item.notes) return null;

  // Parsear notas para extraer sabores y adiciones
  const lines = [];
  
  // Detectar formato "N bolas: Sabor1, Sabor2..."
  const bolaMatch = item.notes.match(/(\d+)\s+bolas?:\s*(.+?)(?:\n|$)/i);
  if (bolaMatch) {
    const numBolas = bolaMatch[1];
    const flavorsText = bolaMatch[2];
    const flavors = flavorsText.split(",").map(f => f.trim());
    
    if (flavors.length === 1) {
      lines.push(`Sabor: ${flavors[0]}`);
    } else {
      flavors.forEach((f, i) => {
        lines.push(`Sabor ${i + 1}: ${f}`);
      });
    }
  } else if (item.notes.includes("Sabor")) {
    // Si la nota ya contiene "Sabor", mostrarla tal cual
    lines.push(item.notes);
  } else {
    // Para otros extras/adiciones - mostrar todas las líneas del notes
    const noteLines = item.notes.split("\n").filter(l => l.trim());
    lines.push(...noteLines);
  }

  return (
    <div style={{ marginTop: 3, display: "flex", flexDirection: "column", gap: 1 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: 10, color: "#666", fontStyle: "italic", lineHeight: 1.3 }}>
          📝 {line}
        </div>
      ))}
    </div>
  );
}