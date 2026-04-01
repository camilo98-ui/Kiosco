import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutDialog({ open, onClose, onConfirm, isLoading }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-3xl bg-white border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-foreground">
            ¿Cómo te llamas? 🍦
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Te llamamos cuando tu pedido esté listo
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 text-lg rounded-2xl text-center font-bold bg-muted border-border"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full h-14 text-base font-black rounded-2xl bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? "Enviando..." : "¡Confirmar pedido! 🎊"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}