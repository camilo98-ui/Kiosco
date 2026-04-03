export const FAMILIES = [
  {
    key: "malteadas",
    name: "Malteadas",
    emoji: "🥤",
    gradient: "linear-gradient(135deg, #FFD6E0, #FFAFC5)",
    products: [
      { name: "Malteada Premium XL", desc: "Vainilla francesa, Oreo triturada y chispas de chocolate belga", price: 28900, emoji: "🥤", bg: "bg1", top: true },
      { name: "Malteada Strawberry Cheesecake", desc: "Fresas naturales, queso crema y galleta graham", price: 24900, oldPrice: 27900, emoji: "🍓", bg: "bg2", badge: "Nuevo" },
      { name: "Malteada Doble Chocolate", desc: "Chocolate amargo, brownie y fudge caliente", price: 22900, emoji: "🍫", bg: "bg3" },
      { name: "Malteada Maracuyá", desc: "Maracuyá tropical con sorbete de limón", price: 19900, emoji: "🍋", bg: "bg4" },
      { name: "Malteada Clásica", desc: "Vainilla suave con leche entera y crema", price: 16900, emoji: "🤍", bg: "bg5" },
    ],
  },
  {
    key: "conos",
    name: "Conos Gourmet",
    emoji: "🍦",
    gradient: "linear-gradient(135deg, #FFE4C4, #FFCC99)",
    products: [
      { name: "Cono Gourmet Triple", desc: "Tres bolas a elección con topping premium y waffle belga", price: 26900, emoji: "🍦", bg: "bg2", top: true },
      { name: "Cono Doble Especial", desc: "Dos sabores gourmet con salsa de caramelo artesanal", price: 21900, oldPrice: 24900, emoji: "🌰", bg: "bg1", badge: "Popular" },
      { name: "Cono Bañado en Chocolate", desc: "Helado de vainilla con cobertura de chocolate suizo", price: 18900, emoji: "🍫", bg: "bg3" },
      { name: "Cono Sencillo", desc: "Una bola del sabor que prefieras en cono crujiente", price: 13900, emoji: "🍦", bg: "bg4" },
    ],
  },
  {
    key: "cookie",
    name: "Cookie Sandwich",
    emoji: "🍪",
    gradient: "linear-gradient(135deg, #E8D5F5, #D0B0F0)",
    products: [
      { name: "Cookie Sandwich Deluxe", desc: "Galleta artesanal, helado de dulce de leche y decoración premium", price: 23900, emoji: "🍪", bg: "bg5", top: true },
      { name: "Cookie Choco Chips", desc: "Galleta con chips de chocolate y helado de vainilla", price: 19900, oldPrice: 22900, emoji: "🍫", bg: "bg1", badge: "Favorito" },
      { name: "Cookie Rojo Americano", desc: "Red velvet con helado de cream cheese", price: 21900, emoji: "❤️", bg: "bg2" },
      { name: "Cookie Mini Pack x3", desc: "Tres mini cookies con tres sabores diferentes", price: 27900, emoji: "🎁", bg: "bg3", badge: "Nuevo" },
    ],
  },
  {
    key: "helados",
    name: "Helados",
    emoji: "🍨",
    gradient: "linear-gradient(135deg, #C8F0E8, #A0E0D0)",
    products: [
      { name: "Tarrina Gourmet 1L", desc: "Helado artesanal en presentación familiar con sabores exclusivos", price: 52900, emoji: "🍨", bg: "bg4", top: true },
      { name: "Tarrina 500ml Premium", desc: "Media tarrina con helado de temporada selección chef", price: 32900, oldPrice: 36900, emoji: "🌟", bg: "bg1", badge: "Chef" },
      { name: "Bola Gourmet x4", desc: "Cuatro bolas en copa especial con toppings a elección", price: 29900, emoji: "🍧", bg: "bg2" },
      { name: "Copa Clásica x2", desc: "Dos sabores clásicos en copa con crema chantilly", price: 19900, emoji: "🍦", bg: "bg3" },
      { name: "Paleta Artesanal", desc: "Paleta de fruta natural hecha a mano sin conservantes", price: 8900, emoji: "🍭", bg: "bg5" },
    ],
  },
  {
    key: "especialidades",
    name: "Especialidades",
    emoji: "⭐",
    gradient: "linear-gradient(135deg, #FFE8E8, #FFB8B8)",
    products: [
      { name: "Sundae Signature Popsy", desc: "Helado, brownies calientes, caramelo, nueces y crema", price: 31900, emoji: "⭐", bg: "bg1", top: true },
      { name: "Waffles con Helado", desc: "Waffles belgas recién hechos con dos bolas y fresas", price: 27900, oldPrice: 31900, emoji: "🧇", bg: "bg2", badge: "Top ventas" },
      { name: "Banana Split Popsy", desc: "Banana, tres sabores, tres salsas y crema chantilly", price: 24900, emoji: "🍌", bg: "bg3" },
      { name: "Crepe Popsy", desc: "Crepe relleno de Nutella con helado y fresas", price: 22900, emoji: "🫔", bg: "bg4" },
      { name: "Brownie Caliente", desc: "Brownie de chocolate belga con bola de vainilla", price: 18900, emoji: "🍫", bg: "bg5" },
    ],
  },
  {
    key: "cafe",
    name: "Café & Bebidas",
    emoji: "☕",
    gradient: "linear-gradient(135deg, #FFF3C4, #FFE080)",
    products: [
      { name: "Affogato Premium", desc: "Shot de espresso italiano sobre helado de vainilla", price: 19900, emoji: "☕", bg: "bg3", top: true },
      { name: "Frappé de Caramelo", desc: "Café frío, caramelo, leche y crema batida", price: 17900, emoji: "🧋", bg: "bg1", badge: "Nuevo" },
      { name: "Frappé Moca", desc: "Café, chocolate, leche condensada y crema", price: 16900, oldPrice: 18900, emoji: "🍫", bg: "bg2" },
      { name: "Limonada de Coco", desc: "Limonada natural con leche de coco y menta", price: 12900, emoji: "🥥", bg: "bg4" },
    ],
  },
  {
    key: "combos",
    name: "Combos Especiales",
    emoji: "🎁",
    gradient: "linear-gradient(135deg, #D0E8FF, #A0C8FF)",
    featured: true,
    products: [
      { name: "Combo Romántico para 2", desc: "2 Sundaes signature + 2 malteadas + 2 cookies a elección", price: 89900, oldPrice: 108900, emoji: "💑", bg: "bg2", top: true, badge: "Ahorra $19.000" },
      { name: "Combo Familiar x4", desc: "4 bolas gourmet + 4 conos + 1 tarrina 500ml", price: 74900, oldPrice: 89900, emoji: "👨‍👩‍👧‍👦", bg: "bg1", badge: "Mejor precio" },
      { name: "Combo Amigos x2", desc: "2 malteadas XL + 2 cookie sandwich + 2 paletas", price: 59900, oldPrice: 69900, emoji: "🎉", bg: "bg3", badge: "Popular" },
      { name: "Combo Celebración", desc: "Tarrina 1L + waffles + 4 malteadas individuales", price: 98900, emoji: "🥳", bg: "bg4", top: true },
      { name: "Combo Ejecutivo", desc: "1 especialidad + 1 café + 1 cookie sandwich", price: 44900, oldPrice: 52900, emoji: "💼", bg: "bg5" },
    ],
  },
];

export const BG_GRADIENTS = {
  bg1: "linear-gradient(135deg, #FFD6E0, #FFAFC5)",
  bg2: "linear-gradient(135deg, #FFE4C4, #FFCC99)",
  bg3: "linear-gradient(135deg, #C8F0E8, #A0E0D0)",
  bg4: "linear-gradient(135deg, #E8D5F5, #D0B0F0)",
  bg5: "linear-gradient(135deg, #FFF3C4, #FFE080)",
};