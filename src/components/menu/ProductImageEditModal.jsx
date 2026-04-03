import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

export default function ProductImageEditModal({ open, product, onClose, onSave }) {
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [price, setPrice] = useState(product?.price || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await base44.entities.Product.update(product.id, {
        image_url: imageUrl || product.image_url,
        price: parseFloat(price) || product.price,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-center">
            Editar {product?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {imageUrl && (
            <div className="w-full h-32 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImageUrl("")} />
            </div>
          )}
          
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">URL de imagen</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">Precio (COP)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl h-10">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1 rounded-xl h-10 bg-primary hover:bg-primary/90">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}