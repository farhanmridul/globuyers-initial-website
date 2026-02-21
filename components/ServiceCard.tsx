"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ReactNode, MouseEvent } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bullets?: string[];
  index: number;
  className?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  bullets,
  index,
  className = "",
}: ServiceCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(14, 165, 233, 0.10), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative group h-full ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight overlay — pointer-events-none so it doesn't block card interactions */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBackground }}
      />

      <div className="relative h-full bg-glass border border-glass-border rounded-3xl p-8 transition-all duration-300 hover:border-primary/40 hover:neon-glow-cyan overflow-hidden">
        {/* Subtle gradient blob */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:border-primary/30 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {bullets.map((bullet, i) => (
                <li key={i} className="text-sm text-gray-500 flex items-start gap-2 group-hover:text-gray-400 transition-colors duration-300">
                  <span className="text-primary mt-0.5 flex-shrink-0">›</span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
