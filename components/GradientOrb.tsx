"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

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
      ref={ref}
      className={`absolute rounded-full blur-3xl opacity-20 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={
        isInView
          ? { scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }
          : false
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
