"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
}: GlowButtonProps) {
  const variantClasses = {
    primary: "bg-white text-black hover:bg-gray-200 border border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    secondary: "bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative px-8 py-4 rounded-full font-semibold text-sm tracking-wide uppercase overflow-hidden transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
