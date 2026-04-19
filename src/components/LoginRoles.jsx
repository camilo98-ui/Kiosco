import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Crown, User } from "lucide-react";

const ROLES = [
  {
    id: "gerente",
    title: "Gerente",
    description: "Visión completa del negocio y toma de decisiones",
    icon: Briefcase,
  },
  {
    id: "lider",
    title: "Líder de Experiencia",
    description: "Control diario del punto, equipo y resultados",
    icon: Crown,
  },
  {
    id: "embajador",
    title: "Embajador",
    description: "Ejecución operativa y apoyo en ventas",
    icon: User,
  },
];

export default function LoginRoles() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleEnter = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FDE1E7 0%, #FFFFFF 100%)",
      }}
    >
      {/* Efecto blur suave de fondo */}
      <div className="absolute inset-0 backdrop-blur-3xl opacity-10" />

      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[380px] p-6 rounded-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <p
            className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
            style={{ letterSpacing: "0.15em" }}
          >
            Helado Gourmet
          </p>
          <p
            className="text-4xl font-black mb-2"
            style={{ color: "#E91E63", fontStyle: "italic" }}
          >
            Popsy
          </p>
          <h1 className="text-xl font-semibold text-pink-300 mb-2">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">
            Selecciona tu rol y comienza
          </p>
        </div>

        {/* Selector de Roles */}
        <div className="space-y-3 mb-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                whileTap={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                className="w-full p-4 rounded-2xl flex items-start gap-3 transition-all"
                style={{
                  background: isSelected ? "#FCE4EC" : "#FFFFFF",
                  border: isSelected ? "2px solid #E91E63" : "2px solid transparent",
                }}
              >
                <Icon
                  size={22}
                  style={{ color: isSelected ? "#E91E63" : "#999", flexShrink: 0 }}
                  className="mt-0.5"
                />
                <div className="text-left">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: isSelected ? "#E91E63" : "#1A1A1A" }}
                  >
                    {role.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {role.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Botón Entrar */}
        <motion.button
          onClick={handleEnter}
          disabled={!selectedRole}
          whileTap={selectedRole ? { scale: 0.98 } : {}}
          className="w-full h-12 rounded-xl font-bold text-sm transition-all mb-3"
          style={{
            background: selectedRole ? "#F8BBD0" : "#E8E8E8",
            color: selectedRole ? "#FFFFFF" : "#999",
            cursor: selectedRole ? "pointer" : "not-allowed",
          }}
        >
          Entrar 🚀
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          ¿Eres administrador?
        </p>
      </motion.div>
    </div>
  );
}