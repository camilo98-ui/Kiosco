import React, { useState, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cartStore";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ChevronRight, MapPin, Bike } from "lucide-react";
import PopsyLogo from "@/components/menu/PopsyLogo";
import SearchModal from "@/components/menu/SearchModal";
import PromoBanners from "@/components/menu/PromoBanners";
import EditorialLayout from "@/components/menu/EditorialLayout";
import SuggestedRow from "@/components/menu/SuggestedRow";
import PremiumCartBar from "@/components/menu/PremiumCartBar";
import AdditionsUpsell from "@/components/menu/AdditionsUpsell";
import UpsellBanner from "@/components/menu/UpsellBanner";
import CheckoutDialog from "@/components/menu/CheckoutDialog";
import ConfirmationScreen from "@/components/menu/ConfirmationScreen";
import HiddenMenu from "@/components/menu/HiddenMenu";

// ── Paletas de fondo para tarjetas ──────────────────────────────────
const FAMILY_GRADIENTS = [
  "linear-gradient(135deg, #6D1B4E, #B5175A)",
  "linear-gradient(135deg, #7B3A00, #C97B30)",
  "linear-gradient(135deg, #3A2000, #7B5A1A)",
  "linear-gradient(135deg, #1A3A6D, #2A6DB5)",
  "linear-gradient(135deg, #1A2A1A, #2E7D32)",
];

const ITEM_BG = [
  "linear-gradient(135deg, #6D1B4E, #B5175A)",
  "linear-gradient(135deg, #7B3A00, #C97B30)",
  "linear-gradient(135deg, #1A3A6D, #2A6DB5)",
  "linear-gradient(135deg, #1A2A1A, #2E7D32)",
  "linear-gradient(135deg, #3A2000, #7B5A1A)",
];

const FAMILY_CARDS = [
  { id: "malteadas",     label: "Malteadas" },
  { id: "helados",       label: "Helados" },
  { id: "combos",        label: "Cookie Jar" },
  { id: "especialidades",label: "Especiales" },
  { id: "cafe",          label: "Café" },
];

// ── Sub-componentes ──────────────────────────────────────────────────

function CategoryIcons({ activeCategory, onSelect }) {
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", marginBottom: 12, margin: "0 0 12px" }}>
        Categorías
      </p>
      <div style={{ display: "flex", overflowX: "auto", gap: 16, scrollbarWidth: "none", paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: "50%",
                background: isActive ? "#FFF0F5" : "#F5F5F5",
                border: isActive ? "2.5px solid #B5175A" : "2px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, transition: "all 0.15s ease",
              }}>
                {cat.emoji}
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 500,
                color: isActive ? "#B5175A" : "#8A7880", whiteSpace: "nowrap",
              }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FamilyCarousel({ productCounts, onSelect }) {
  return (
    <div style={{ padding: "20px 0 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16, marginBottom: 12 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Explorar familias</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#B5175A" }}>Ver todo</button>
      </div>
      <div style={{ display: "flex", overflowX: "auto", gap: 10, paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none", paddingBottom: 4 }}>
        {FAMILY_CARDS.map((fam, idx) => (
          <button
            key={fam.id}
            onClick={() => onSelect(fam.id)}
            style={{
              flexShrink: 0, width: 120, height: 84, borderRadius: 16,
              background: FAMILY_GRADIENTS[idx % FAMILY_GRADIENTS.length],
              border: "none", cursor: "pointer", position: "relative",
              overflow: "hidden", display: "flex", alignItems: "flex-end",
              padding: "0 0 10px 10px",
            }}
          >
            <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={12} color="#fff" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{fam.label}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                {productCounts[fam.id] || 0} opciones
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MostOrderedItem({ product, idx, onAdd }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#fff", border: "none", borderBottom: "1px solid #F5EAEF",
        padding: "14px 0", cursor: "pointer", textAlign: "left", width: "100%",
      }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: ITEM_BG[idx % ITEM_BG.length],
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 24 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: "#BBA8B0", margin: 0, marginTop: 2 }}>
          {CATEGORIES.find(c => c.id === product.category)?.label || product.category} · {formatCOP(product.price)}
        </p>
      </div>
      <ChevronRight size={16} color="#DDD" style={{ flexShrink: 0, marginRight: 2 }} />
    </button>
  );
}

function MostOrdered({ products, onAdd }) {
  const top = useMemo(() =>
    [...products].filter(p => p.tag === "mas_vendido" && p.is_available !== false).slice(0, 8),
    [products]
  );
  if (top.length === 0) return null;
  return (
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Lo más pedido</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#B5175A" }}>Ver todo</button>
      </div>
      {top.map((product, idx) => (
        <MostOrderedItem key={product.id} product={product} idx={idx} onAdd={onAdd} />
      ))}
    </div>
  );
}

// ── PÁGINA PRINCIPAL ─────────────────────────────────────────────────

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [showAdditionsUpsell, setShowAdditionsUpsell] = useState(false);
  const upsellTimer = useRef(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const { addItem, cart, clearCart, total, itemCount } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
  });

  const productsByCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => (map[c.id] = []));
    products.forEach((p) => { if (map[p.category]) map[p.category].push(p); });
    return map;
  }, [products]);

  const productCounts = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return (productsByCategory[activeCategory] || []).filter((p) => p.is_available !== false);
  }, [productsByCategory, activeCategory]);

  const suggestedProducts = useMemo(() => {
    return products
      .filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false)
      .slice(0, 6);
  }, [products, activeCategory]);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      setHiddenMenuOpen(true);
    } else {
      logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    }
  };

  const handleAddProduct = useCallback((product) => {
    addItem(product);
    setAddedFlash(product.id);
    setTimeout(() => setAddedFlash(null), 600);
    if (product.category !== "adiciones") {
      clearTimeout(upsellTimer.current);
      setShowAdditionsUpsell(false);
      upsellTimer.current = setTimeout(() => {
        setLastAdded(product);
        setShowAdditionsUpsell(true);
        setTimeout(() => setShowAdditionsUpsell(false), 8000);
      }, 700);
    }
    const rule = UPSELL_RULES[product.category];
    if (rule && product.category === "adiciones") {
      upsellTimer.current = setTimeout(() => {
        setUpsellMsg(rule.message);
        setUpsellTarget(rule.targetCategory);
        setTimeout(() => setUpsellMsg(null), 6000);
      }, 800);
    }
  }, [addItem]);

  const handleUpsellAccept = () => {
    if (upsellTarget) setActiveCategory(upsellTarget);
    setUpsellMsg(null);
  };

  const handleCheckout = async (name) => {
    setIsSubmitting(true);
    const settings = await base44.entities.Settings.filter({ key: "next_order_number" });
    const nextNum = parseInt(settings[0]?.value || "101");
    const order = await base44.entities.Order.create({
      order_number: nextNum,
      customer_name: name,
      items: cart.map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        price: i.price,
        quantity: i.quantity,
        notes: i.notes,
      })),
      total,
      status: "pendiente",
    });
    await base44.entities.Settings.update(settings[0].id, { value: String(nextNum + 1) });
    clearCart();
    setCheckoutOpen(false);
    setConfirmedOrder({ ...order, order_number: nextNum, customer_name: name, items: cart, total });
    setIsSubmitting(false);
  };

  if (confirmedOrder) {
    return <ConfirmationScreen order={confirmedOrder} onNewOrder={() => setConfirmedOrder(null)} />;
  }

  // Vista de categoría seleccionada
  if (activeCategory) {
    return (
      <div className="min-h-screen" style={{ background: "#FFFCFD" }}>
        {/* Header compacto */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-3"
          style={{ height: 56, background: "linear-gradient(90deg, #B5175A 0%, #B5175A 55%, #5BA8A0 100%)" }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            ← Inicio
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </span>
          <button
            onClick={() => setSearchOpen(true)}
            style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Search size={14} color="#fff" />
          </button>
        </div>

        <div className="pb-36 pt-2">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5175A" }} />
            </div>
          ) : (
            <EditorialLayout
              products={categoryProducts}
              category={activeCategory}
              onAdd={handleAddProduct}
              addedFlash={addedFlash}
            />
          )}
          {!isLoading && suggestedProducts.length > 0 && (
            <SuggestedRow products={suggestedProducts} onAdd={handleAddProduct} />
          )}
        </div>

        <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
        {showAdditionsUpsell && (
          <AdditionsUpsell
            lastAdded={lastAdded}
            additions={productsByCategory["adiciones"] || []}
            onAdd={handleAddProduct}
            onDismiss={() => setShowAdditionsUpsell(false)}
          />
        )}
        <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
        <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
        <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={handleAddProduct} />
      </div>
    );
  }

  // Vista HOME
  return (
    <div className="min-h-screen" style={{ background: "#F7F3F5" }}>

      {/* ── HEADER ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #B5175A 0%, #B5175A 60%, #5BA8A0 100%)",
          padding: "14px 16px 16px",
          position: "sticky", top: 0, zIndex: 20,
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <PopsyLogo onClick={handleLogoClick} size="normal" dark />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Search size={15} color="#fff" />
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <button
          onClick={() => setSearchOpen(true)}
          style={{
            width: "100%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)",
            borderRadius: 24, padding: "9px 16px", display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", marginBottom: 10,
          }}
        >
          <Search size={14} color="rgba(255,255,255,0.75)" />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>Busca tu helado favorito...</span>
        </button>

        {/* Barra entrega */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "inline-block", boxShadow: "0 0 0 3px rgba(74,222,128,0.3)", flexShrink: 0 }} />
            <MapPin size={11} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
              <strong style={{ color: "#fff" }}>25–35 min</strong> · Bogotá
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 10px" }}>
            <Bike size={11} color="rgba(255,255,255,0.9)" />
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Domicilio gratis</span>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ background: "#F7F3F5", paddingBottom: 120 }}>

        {/* ── BANNER CARRUSEL (original) ── */}
        <div style={{ background: "#fff", padding: "16px 12px 12px" }}>
          <PromoBanners onCategorySelect={setActiveCategory} />
        </div>

        {/* ── CATEGORÍAS ── */}
        <div style={{ background: "#fff", marginTop: 10, padding: "0 0 16px" }}>
          <CategoryIcons activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* ── EXPLORAR FAMILIAS ── */}
        <div style={{ background: "#fff", marginTop: 10, paddingBottom: 16 }}>
          <FamilyCarousel productCounts={productCounts} onSelect={setActiveCategory} />
        </div>

        {/* ── LO MÁS PEDIDO ── */}
        {!isLoading && (
          <div style={{ background: "#fff", marginTop: 10 }}>
            <MostOrdered products={products} onAdd={handleAddProduct} />
            <div style={{ height: 16 }} />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5175A" }} />
          </div>
        )}
      </div>

      {/* ── OVERLAYS ── */}
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
      {showAdditionsUpsell && (
        <AdditionsUpsell
          lastAdded={lastAdded}
          additions={productsByCategory["adiciones"] || []}
          onAdd={handleAddProduct}
          onDismiss={() => setShowAdditionsUpsell(false)}
        />
      )}
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={handleAddProduct} />
    </div>
  );
}