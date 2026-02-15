"use client";

import { motion } from "framer-motion";

interface GradientOrbProps {
  color?: "cyan" | "purple" | "pink";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function GradientOrb({
  color = "cyan",
  size = "md",
  className = "",
}: GradientOrbProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  };

  const colorClasses = {
    cyan: "bg-gradient-to-br from-primary via-accent-cyan to-transparent",
    purple: "bg-gradient-to-br from-secondary via-accent-purple to-transparent",
    pink: "bg-gradient-to-br from-accent-pink via-accent-purple to-transparent",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
