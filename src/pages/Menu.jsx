import React, { useState, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cartStore";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { Search, ShoppingBag, Loader2, ChevronRight } from "lucide-react";
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
import HeaderLine from "@/components/menu/HeaderLine";
import QuickCombos from "@/components/menu/QuickCombos";

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
  { id: "malteadas",      label: "Malteadas",   image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
  { id: "helados",        label: "Helados",      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/f595fcc04_Helados.jpg" },
  { id: "combos",         label: "Cookie Jar",   image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/808f0498b_CookieJaar.png" },
  { id: "especialidades", label: "Especiales",   image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7b7dae157_image.jpeg" },
  { id: "cafe",           label: "Café",         image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0107c0b2c_image.png" },
];

function CategoryIcons({ activeCategory, onSelect }) {
  return (
    <div style={{ background: "#fff", padding: "18px 16px 16px" }}>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: "0 0 14px" }}>Categorías</p>
      <div style={{ display: "flex", overflowX: "auto", gap: 18, scrollbarWidth: "none", paddingBottom: 2 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: isActive ? "#FFF0F5" : "#F5F5F5",
                border: isActive ? "2.5px solid #B5175A" : "2px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, transition: "all 0.15s ease",
              }}>
                {cat.emoji}
              </div>
              <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? "#B5175A" : "#8A7880", whiteSpace: "nowrap" }}>
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
    <div style={{ background: "#fff", padding: "18px 0 16px", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Explorar categorías</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#B5175A" }}>Ver todo</button>
      </div>
      <div style={{ display: "flex", overflowX: "auto", gap: 10, paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
        {FAMILY_CARDS.map((fam, idx) => (
          <button
            key={fam.id}
            onClick={() => onSelect(fam.id)}
            style={{
              flexShrink: 0, width: 180, height: 140, borderRadius: 28,
              background: FAMILY_GRADIENTS[idx % FAMILY_GRADIENTS.length],
              border: "none", cursor: "pointer", position: "relative",
              overflow: "hidden", display: "flex", alignItems: "flex-end",
              padding: "0 0 16px 16px", scrollSnapAlign: "start",
            }}
          >
            {fam.image && (
              <img src={fam.image} alt={fam.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
            )}
            <div style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <ChevronRight size={16} color="#fff" />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{fam.label}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: 0 }}>{productCounts[fam.id] || 0} opciones</p>
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
      style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "none", borderBottom: "1px solid #F5EAEF", padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%" }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: ITEM_BG[idx % ITEM_BG.length], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 24 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 0" }}>
          {CATEGORIES.find(c => c.id === product.category)?.label} · {formatCOP(product.price)}
        </p>
      </div>
      <ChevronRight size={16} color="#DDD" style={{ flexShrink: 0 }} />
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
    <div style={{ background: "#fff", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 4px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Lo más pedido</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#B5175A" }}>Ver todo</button>
      </div>
      {top.map((product, idx) => (
        <MostOrderedItem key={product.id} product={product} idx={idx} onAdd={onAdd} />
      ))}
      <div style={{ height: 8 }} />
    </div>
  );
}

function CategoryView({ activeCategory, categoryProducts, suggestedProducts, onAdd, addedFlash, onBack, searchOpen, setSearchOpen, products, onAddProduct, checkoutOpen, setCheckoutOpen, handleCheckout, isSubmitting, hiddenMenuOpen, setHiddenMenuOpen, productsByCategory, showAdditionsUpsell, setShowAdditionsUpsell, lastAdded, upsellMsg, setUpsellMsg, handleUpsellAccept }) {
  return (
    <div className="min-h-screen" style={{ background: "#FFFCFD" }}>
      <div className="sticky top-0 z-20 flex items-center justify-between px-3" style={{ height: 56, background: "linear-gradient(90deg, #B5175A 0%, #B5175A 55%, #5BA8A0 100%)" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, padding: "5px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          ← Inicio
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {CATEGORIES.find(c => c.id === activeCategory)?.label}
        </span>
        <button onClick={() => setSearchOpen(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Search size={14} color="#fff" />
        </button>
      </div>
      <div className="pb-36 pt-2">
        <EditorialLayout products={categoryProducts} category={activeCategory} onAdd={onAdd} addedFlash={addedFlash} />
        {suggestedProducts.length > 0 && <SuggestedRow products={suggestedProducts} onAdd={onAdd} />}
      </div>
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
      {showAdditionsUpsell && <AdditionsUpsell lastAdded={lastAdded} additions={productsByCategory["adiciones"] || []} onAdd={onAdd} onDismiss={() => setShowAdditionsUpsell(false)} />}
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={onAddProduct} />
    </div>
  );
}

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
    return (productsByCategory[activeCategory] || []).filter(p => p.is_available !== false);
  }, [productsByCategory, activeCategory]);

  const suggestedProducts = useMemo(() => {
    return products.filter(p => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false).slice(0, 6);
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

  const handleAddProduct = useCallback((product, notes = "") => {
    addItem(product, notes);
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
      items: cart.map((i) => ({ product_id: i.product_id, product_name: i.product_name, price: i.price, quantity: i.quantity, notes: i.notes })),
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

  if (activeCategory) {
    return (
      <CategoryView
        activeCategory={activeCategory}
        categoryProducts={categoryProducts}
        suggestedProducts={suggestedProducts}
        onAdd={handleAddProduct}
        addedFlash={addedFlash}
        onBack={() => setActiveCategory(null)}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        products={products}
        onAddProduct={handleAddProduct}
        checkoutOpen={checkoutOpen}
        setCheckoutOpen={setCheckoutOpen}
        handleCheckout={handleCheckout}
        isSubmitting={isSubmitting}
        hiddenMenuOpen={hiddenMenuOpen}
        setHiddenMenuOpen={setHiddenMenuOpen}
        productsByCategory={productsByCategory}
        showAdditionsUpsell={showAdditionsUpsell}
        setShowAdditionsUpsell={setShowAdditionsUpsell}
        lastAdded={lastAdded}
        upsellMsg={upsellMsg}
        setUpsellMsg={setUpsellMsg}
        handleUpsellAccept={handleUpsellAccept}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F3F5" }}>
      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between pl-0 pr-3"
        style={{ height: 56, background: "linear-gradient(90deg, #B5175A 0%, #B5175A 55%, #5BA8A0 100%)", overflow: "hidden" }}
      >
        <HeaderLine hasCart={itemCount > 0} />
        <PopsyLogo onClick={handleLogoClick} size="normal" dark />
        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}>
            <Search size={14} color="#fff" />
          </button>
          <button className="flex items-center justify-center relative" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}>
            <ShoppingBag size={14} color="#fff" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 font-black flex items-center justify-center" style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", color: "#B5175A", fontSize: 8 }}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ paddingBottom: 120 }}>
        <div style={{ background: "#fff", padding: "14px 12px 12px" }}>
          <PromoBanners onCategorySelect={setActiveCategory} />
        </div>
        <FamilyCarousel productCounts={productCounts} onSelect={setActiveCategory} />
        <QuickCombos products={products} onAddMultiple={handleAddProduct} />
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B5175A" }} />
          </div>
        ) : (
          <MostOrdered products={products} onAdd={handleAddProduct} />
        )}
      </div>

      {/* ── OVERLAYS ── */}
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
      {showAdditionsUpsell && <AdditionsUpsell lastAdded={lastAdded} additions={productsByCategory["adiciones"] || []} onAdd={handleAddProduct} onDismiss={() => setShowAdditionsUpsell(false)} />}
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={handleAddProduct} />
    </div>
  );
}