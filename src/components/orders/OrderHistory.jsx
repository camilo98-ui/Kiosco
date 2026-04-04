import React, { useState } from "react";
import { Clock, X, ChevronDown } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import moment from "moment";

function HistoryOrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{
      background: "#FAFAFA",
      border: "1px solid #E8E8E8",
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>
            #{order.order_number}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              {order.customer_name}
            </p>
            <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>
              {moment(order.created_date).format("HH:mm")}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#C41E6A" }}>
            {formatCOP(order.total)}
          </span>
          <ChevronDown
            size={16}
            color="#999"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </button>

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E8E8E8" }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {item.quantity}× {item.product_name}
              </p>
              {item.notes && (
                <p style={{ margin: "2px 0 0 12px", color: "#999", fontStyle: "italic", fontSize: 10 }}>
                  {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderHistory({ orders, onClose }) {
  const finalizedOrders = orders
    .filter((o) => o.status === "finalizado")
    .sort((a, b) => moment(b.created_date).diff(moment(a.created_date)));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 600,
          maxHeight: "85vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: "1px solid #F0F0F0",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={20} color="#C41E6A" />
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              Historial del día
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F5F5F5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={18} color="#666" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 16, flex: 1 }}>
          {finalizedOrders.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 40, color: "#999" }}>
              <p style={{ fontSize: 40, marginBottom: 8 }}>📋</p>
              <p style={{ fontWeight: 600 }}>Sin pedidos finalizados aún</p>
            </div>
          ) : (
            finalizedOrders.map((order) => (
              <HistoryOrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}