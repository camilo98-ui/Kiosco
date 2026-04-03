export const CATEGORIES = [
  { id: "combos", label: "Combos", emoji: "🔝" },
  { id: "helados", label: "Helados", emoji: "🍦" },
  { id: "malteadas", label: "Malteadas", emoji: "🥤" },
  { id: "granizados", label: "Granizados", emoji: "🧊" },
  { id: "especialidades", label: "Especiales", emoji: "🌟" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "galletas", label: "Galletas", emoji: "🍪" },
  { id: "paletas_packs", label: "Paletas", emoji: "🍭" },
  { id: "popsy_toy", label: "Popsy Toy", emoji: "🧸" },
  { id: "para_llevar", label: "Para Llevar", emoji: "🛍️" },
  { id: "tortas", label: "Tortas", emoji: "🎂" },
  { id: "regalos", label: "Regalos", emoji: "🎁" },
  { id: "bebidas", label: "Bebidas", emoji: "💧" },
  { id: "adiciones", label: "Adiciones", emoji: "➕" },
];

// Upsell estratégico: mensaje corto y tentador + producto sugerido específico
export const UPSELL_RULES = {
  helados:       { message: "🍫 ¿Le agregamos una adición? (Choco-chips, nueces, salsa...)", targetCategory: "adiciones" },
  malteadas:     { message: "🍪 ¿Una galleta para acompañar tu malteada?", targetCategory: "galletas" },
  cafe:          { message: "🍪 ¡El café va perfecto con una galleta Popsy!", targetCategory: "galletas" },
  galletas:      { message: "🍦 ¿Un heladito para completar la experiencia?", targetCategory: "helados" },
  combos:        { message: "➕ ¿Le sumamos una adición al combo?", targetCategory: "adiciones" },
  especialidades:{ message: "☕ ¿Acompañas con un café o bebida caliente?", targetCategory: "cafe" },
  bebidas:       { message: "🍪 ¿Unos snacks para acompañar?", targetCategory: "galletas" },
  tortas:        { message: "🍦 ¿Una bola de helado para la torta?", targetCategory: "helados" },
};

export const TAG_CONFIG = {
  mas_vendido: { label: "🔥 Top", className: "bg-red-500 text-white" },
  recomendado: { label: "⭐ Chef", className: "bg-amber-400 text-amber-900" },
  promo:       { label: "💰 Promo", className: "bg-accent text-accent-foreground" },
};

export const STATUS_CONFIG = {
  pendiente:     { label: "Pendiente",   color: "bg-yellow-400", textColor: "text-yellow-900", borderColor: "border-yellow-400" },
  pagado_tarjeta:{ label: "Con Tarjeta", color: "bg-blue-500",   textColor: "text-blue-900",   borderColor: "border-blue-500" },
  finalizado:    { label: "Finalizado",  color: "bg-green-500",  textColor: "text-green-900",  borderColor: "border-green-500" },
};

export function formatCOP(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}