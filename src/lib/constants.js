export const CATEGORIES = [
  { id: "combos", label: "Combos Destacados", emoji: "🔝" },
  { id: "helados", label: "Helados", emoji: "🍦" },
  { id: "malteadas", label: "Malteadas", emoji: "🥤" },
  { id: "especialidades", label: "Especialidades", emoji: "🌟" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "galletas", label: "Galletas", emoji: "🍪" },
  { id: "paletas_packs", label: "Paletas y Packs", emoji: "🍭" },
  { id: "popsy_toy", label: "Popsy Toy", emoji: "🧸" },
  { id: "para_llevar", label: "Para Llevar", emoji: "🍦" },
  { id: "tortas", label: "Tortas", emoji: "🎂" },
  { id: "regalos", label: "Regalos", emoji: "🎁" },
  { id: "bebidas", label: "Bebidas", emoji: "💧" },
  { id: "adiciones", label: "Adiciones", emoji: "➕" },
];

export const UPSELL_RULES = {
  helados: { message: "¿Le agregamos una adición? 🍫", targetCategory: "adiciones" },
  galletas: { message: "¡Complétala con helado! 🍦", targetCategory: "helados" },
  cafe: { message: "¿Una galleta para acompañar? 🍪", targetCategory: "galletas" },
  malteadas: { message: "¿Agregas una adición extra? ➕", targetCategory: "adiciones" },
};

export const TAG_CONFIG = {
  mas_vendido: { label: "🔥 Más vendido", className: "bg-red-500 text-white" },
  recomendado: { label: "⭐ Recomendado", className: "bg-primary text-primary-foreground" },
  promo: { label: "💰 Promo", className: "bg-accent text-accent-foreground" },
};

export const STATUS_CONFIG = {
  pendiente: { label: "🟡 Pendiente", color: "bg-yellow-400", textColor: "text-yellow-800", borderColor: "border-yellow-400" },
  pagado_tarjeta: { label: "💳 Tarjeta", color: "bg-blue-500", textColor: "text-blue-800", borderColor: "border-blue-500" },
  finalizado: { label: "✅ Finalizado", color: "bg-green-500", textColor: "text-green-800", borderColor: "border-green-500" },
};

export function formatCOP(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}