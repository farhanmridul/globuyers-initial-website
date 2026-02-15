"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  index,
  className = "",
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`relative group h-full ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      <div className="relative h-full bg-glass border border-glass-border rounded-3xl p-8 hover:border-primary/30 transition-colors duration-300 overflow-hidden">
         {/* Subtle gradient blob background */}
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
        </div>
      </div>
    </motion.div>
  );
}
