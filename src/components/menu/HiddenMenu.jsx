import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";

export default function HiddenMenu({ open, onClose }) {
  const navigate = useNavigate();

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-center">
            🔒 Acceso personal
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Button
            variant="outline"
            className="w-full h-14 justify-start gap-3 text-base font-semibold rounded-2xl"
            onClick={() => goTo("/cajero")}
          >
            <Lock className="w-5 h-5 text-primary" />
            Modo Cajero
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 justify-start gap-3 text-base font-semibold rounded-2xl"
            onClick={() => goTo("/datafono")}
          >
            <CreditCard className="w-5 h-5 text-blue-500" />
            Modo Datáfono
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 justify-start gap-3 text-base font-semibold rounded-2xl"
            onClick={() => goTo("/admin")}
          >
            <ShieldCheck className="w-5 h-5 text-accent" />
            Modo Administrador
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}