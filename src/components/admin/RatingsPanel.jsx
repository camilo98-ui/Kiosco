import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const MAGENTA = "#C41E6A";

function StarBar({ score, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#888", width: 16, textAlign: "right" }}>{score}</span>
      <span style={{ fontSize: 13 }}>⭐</span>
      <div style={{ flex: 1, height: 8, background: "#FFE4F3", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: MAGENTA, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, color: "#888", width: 24, textAlign: "right" }}>{count}</span>
    </div>
  );
}

function StoreRatings({ storeName, ratings }) {
  const dist = [5, 4, 3, 2, 1].map(s => ({ score: s, count: ratings.filter(r => r.score === s).length }));
  const avg = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1) : "—";
  const recent = [...ratings].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, border: "1.5px solid #FFE4F3" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1A0A10", margin: 0 }}>{storeName}</p>
          <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{ratings.length} calificaciones</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 36, fontWeight: 900, color: MAGENTA, margin: 0, lineHeight: 1 }}>{avg}</p>
          <p style={{ fontSize: 14, margin: "2px 0 0" }}>⭐</p>
        </div>
      </div>

      {/* Distribution */}
      <div style={{ marginBottom: 16 }}>
        {dist.map(d => <StarBar key={d.score} score={d.score} count={d.count} total={ratings.length} />)}
      </div>

      {/* Recent comments */}
      {recent.filter(r => r.comment).length > 0 && (
        <>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>
            Comentarios recientes
          </p>
          {recent.filter(r => r.comment).slice(0, 3).map((r, i) => (
            <div key={i} style={{ background: "#FFFAF9", borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{"⭐".repeat(r.score)}</span>
                <span style={{ fontSize: 11, color: "#BBA8B0" }}>
                  {new Date(r.created_date).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
                {r.order_number && <span style={{ fontSize: 11, color: "#BBA8B0" }}>· Pedido #{r.order_number}</span>}
              </div>
              <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.4 }}>{r.comment}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function RatingsPanel() {
  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ["ratings"],
    queryFn: () => base44.entities.Rating.list("-created_date", 200),
  });

  const byStore = useMemo(() => {
    const map = {};
    ratings.forEach(r => {
      const key = r.store_name || r.store_slug || "General";
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [ratings]);

  const globalAvg = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
    : "—";

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <div style={{ width: 28, height: 28, border: `3px solid #FFE4F3`, borderTopColor: MAGENTA, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (ratings.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "#BBA8B0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
      <p style={{ fontSize: 16 }}>Aún no hay calificaciones</p>
    </div>
  );

  return (
    <div>
      {/* Global summary */}
      <div style={{ background: `linear-gradient(135deg, ${MAGENTA}, #FF6EB4)`, borderRadius: 20, padding: "20px 24px", marginBottom: 20, color: "#fff", textAlign: "center" }}>
        <p style={{ fontSize: 42, fontWeight: 900, margin: "0 0 4px", lineHeight: 1 }}>{globalAvg} ⭐</p>
        <p style={{ fontSize: 14, margin: 0, opacity: 0.9 }}>Promedio general · {ratings.length} reseñas</p>
      </div>

      {Object.entries(byStore).map(([name, list]) => (
        <StoreRatings key={name} storeName={name} ratings={list} />
      ))}
    </div>
  );
}