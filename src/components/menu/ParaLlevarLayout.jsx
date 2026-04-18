import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const TABS = [
  { id: "litros", label: "🍦 Litros" },
  { id: "tarrinas", label: "🫙 Tarrinas" },
  { id: "paletas", label: "🍡 Paletas" },
];

// Litros ordenados de más caro a más barato
const LITROS = [
  { id: "litro-crema-limon", name: "Litro Crema de Limón Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/909d79a23_LitroCremadeLimnGourmet46900.png" },
  { id: "litro-macadamia", name: "Litro Macadamia Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0538153b3_LitroMacadamiaGourmet46900.png" },
  { id: "litro-mms", name: "Litro M&M's Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/8108566f1_LitroMMsGourmet46900.png" },
  { id: "litro-brownie", name: "Litro Brownie Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6a0fab405_LitroBrownieGourmet46900.png" },
  { id: "litro-milkyway", name: "Litro Milky Way Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/8888d219a_LitroMilkyWayGourmet46900.png" },
  { id: "litro-oreo", name: "Litro Oreo Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5d6ccc029_LitroOreoGourmet46900.png" },
  { id: "litro-arequipe", name: "Litro Arequipe Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ddf9eae6_LitroArequipeGourmet39900.png" },
  { id: "litro-frutos-bosque", name: "Litro Frutos del Bosque Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fecff7510_LitroFrutosdelBosqueGourmet39900.png" },
  { id: "litro-mandarina", name: "Litro Mandarina Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d19d8c8bd_LitroMandarinaGourmet39900.png" },
  { id: "litro-vainilla-francesa", name: "Litro Vainilla Francesa Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/405c6a009_LitroVainillaFrancesaGourmet39900.png" },
  { id: "litro-vainilla", name: "Litro Vainilla Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ebeb0d17_LitroVainillaGourmet39900.png" },
  { id: "litro-chocolate-belga", name: "Litro Chocolate Belga Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5a6465869_LitroChocolateBelgaGourmet39900.png" },
  { id: "litro-chocolate", name: "Litro Chocolate Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4fe2affb4_LitroChocolateGourmet39900.png" },
  { id: "litro-mandarina-nieve", name: "Litro Mandarina Nieve", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/b2da110c9_LitroMandarinaNieve3990.png" },
  { id: "litro-maracuya-nieve", name: "Litro Maracuyá Nieve", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/aff47bf39_LitroMaracuyNieve39900.png" },
  { id: "litro-frutos-wellness", name: "Litro Frutos del Bosque Wellness", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d2e3b15e8_LitroFrutosWellness39900.png" },
  { id: "litro-vainilla-wellness", name: "Litro Vainilla Wellness", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0dab1e2f6_LitroVainillaWellness39900.png" },
  { id: "caja-4litros", name: "Caja 4 Litros Vainilla Gourmet", price: 88900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c8b3b4616_Caja4LitrosVainillaGourmet88900.png" },
  { id: "4pack-sabores", name: "4 Pack Sabores (4 vasitos)", price: 19900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/cbcc1802d_4-PackSabores19900.png" },
];

// Litros ordenados: más caros primero
const LITROS_SORTED = [...LITROS].sort((a, b) => b.price - a.price);

const TARRINAS = [
  { id: "tarrina-yogo-fresa", name: "Tarrina Yogo Yogo Fresa Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5e1bb30ce_TarrinaYogoYogoFresaGourmet46900.png" },
  { id: "tarrina-brownie", name: "Tarrina Brownie Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5824668ce_TarrinaBrownieGourmet46900.png" },
  { id: "tarrina-mocaccino", name: "Tarrina Mocaccino Gourmet", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/100b16821_TarrinaMocaccinoGourmet46900.png" },
  { id: "tarrina-cherrymana", name: "Tarrina Cherrymana", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0f1cdee81_TarrinaCherrymana46900.png" },
  { id: "tarrina-yogurt-cereza", name: "Tarrina Yogurt de Cereza Italiana", price: 46900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7584f736a_TarrinaYogurtDeCerezaItaliana46900.png" },
  { id: "tarrina-ron-pasas", name: "Tarrina Ron con Pasas", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/38ab20c56_TarrinaRonconPasas39900.png" },
  { id: "tarrina-nieve-limon", name: "Tarrina Nieve Limón", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/1e7abacc2_TarrinaNieveLimn39900.png" },
  { id: "tarrina-maracuya-nieve", name: "Tarrina Maracuyá Nieve", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/908e2cb48_TarrinaMaracuyNieve39900.png" },
  { id: "tarrina-fresa", name: "Tarrina Fresa Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9116f73c0_TarrinaFresaGourmet39900.png" },
  { id: "tarrina-chocolate", name: "Tarrina Chocolate Gourmet", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e87d3f5fb_TarrinaChocolateGourmet39900.png" },
  { id: "tarrina-chocolate-belga", name: "Tarrina Chocolate Belga", price: 39900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/ee9fb5d73_TarrinaChocolateBelga39900.png" },
];

const PALETAS = [
  { id: "paleta-vainilla", name: "Paleta Cremosa Vainilla x4", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/893ab8590_PaletaCremosaVainilla.png", priceLabel: "Consultar" },
  { id: "paleta-cereza", name: "Paleta Cremosa Cereza Italiana x4", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/80283630a_PaletaCremosaCerezaItalianaPackx4Und.png", priceLabel: "Consultar" },
  { id: "paleta-oreo", name: "Paleta Gourmet Selecta Oreo x4", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/bcb16e15a_PaletaGourmetSelectaOreopackx4und.png", priceLabel: "Consultar" },
  { id: "paleta-juan-valdez", name: "Paleta Gourmet Selecta Juan Valdez x4", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/def0af9aa_PaletaGourmetSelectaJuanValdezpackx4und.png", priceLabel: "Consultar" },
  { id: "paleta-mandarina", name: "Paleta Mandarina Agua x4", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e9abb6100_PaletaMandarinaAguaPackx4Und.png", priceLabel: "Consultar" },
];

function ProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  const displayPrice = product.priceLabel || (product.price > 0 ? formatCOP(product.price) : "Consultar");

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => product.price > 0 && onAdd(product)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "0.5px solid #FFE4F3",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(196,30,106,0.07)",
        display: "flex",
        flexDirection: "column",
        cursor: product.price > 0 ? "pointer" : "default",
      }}
    >
      <div style={{
        height: 140,
        background: "#FFF5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {product.image && !imgErr ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 40 }}>🍦</span>
        )}
      </div>
      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "#1A1A1A",
          margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{
            fontSize: 13, fontWeight: 800,
            color: product.price > 0 ? "#C41E6A" : "#888",
          }}>
            {displayPrice}
          </span>
          {product.price > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(product); }}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "#C41E6A", color: "#fff", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(196,30,106,0.3)",
                flexShrink: 0,
              }}
            >
              <Plus size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ParaLlevarLayout({ onAdd }) {
  const [activeTab, setActiveTab] = useState("litros");

  const handleAdd = (product) => {
    onAdd && onAdd({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  const products = activeTab === "litros" ? LITROS_SORTED
    : activeTab === "tarrinas" ? TARRINAS
    : PALETAS;

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "14px 14px 12px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              background: activeTab === tab.id ? "#C41E6A" : "#FFF0F5",
              color: activeTab === tab.id ? "#fff" : "#C41E6A",
              boxShadow: activeTab === tab.id ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteo */}
      <div style={{ padding: "0 14px 10px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#BBA8B0", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
          {products.length} productos disponibles
          {activeTab === "litros" && " · ordenados por precio"}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12,
            padding: "0 14px",
          }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <ProductCard product={product} onAdd={handleAdd} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}