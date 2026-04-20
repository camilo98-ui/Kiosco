import React from "react";

/**
 * Parsea el campo notes y muestra sabor/extras de forma bonita.
 * Formato esperado: "Sabor: X | Extras: A, B | Salsa: Y | ..."
 */
export default function ProductDetailLine({ item, compact = false }) {
  if (!item?.notes) return null;

  const notes = String(item.notes).trim();
  if (!notes) return null;

  // Dividir por pipe
  const sections = notes.split("|").map(s => s.trim()).filter(Boolean);
  if (sections.length === 0) return null;

  // Parsear key: value
  const parsed = sections.map(section => {
    const colonIdx = section.indexOf(":");
    if (colonIdx === -1) return { key: null, value: section };
    return {
      key: section.substring(0, colonIdx).trim(),
      value: section.substring(colonIdx + 1).trim(),
    };
  });

  if (compact) {
    // Modo compacto: una sola línea con los datos más importantes
    const sabor = parsed.find(p => p.key?.toLowerCase() === "sabor");
    const extras = parsed.find(p => p.key?.toLowerCase() === "extras");
    const parts = [];
    if (sabor?.value) parts.push(sabor.value);
    if (extras?.value) parts.push(extras.value);
    if (parts.length === 0) return null;
    return (
      <p style={{ fontSize: 11, color: "#C41E6A", fontStyle: "italic", margin: "2px 0 0", lineHeight: 1.3 }}>
        {parts.join(" · ")}
      </p>
    );
  }

  return (
    <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      {parsed.map((item, i) => {
        const isSabor = item.key?.toLowerCase() === "sabor";
        const isExtras = item.key?.toLowerCase() === "extras";
        if (!item.value) return null;
        return (
          <div key={i} style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
            {item.key && (
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: isSabor ? "#C41E6A" : isExtras ? "#C41E6A" : "#999",
                flexShrink: 0,
                minWidth: 44,
                textTransform: "capitalize",
              }}>
                {item.key}:
              </span>
            )}
            <span style={{
              fontSize: 13,
              color: isSabor || isExtras ? "#C41E6A" : "#666",
              fontStyle: isSabor || isExtras ? "italic" : "normal",
              lineHeight: 1.4,
              fontWeight: isSabor ? 600 : 400,
            }}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}