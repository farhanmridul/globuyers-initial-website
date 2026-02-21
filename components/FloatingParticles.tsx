"use client";

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            isInView
              ? { y: [0, -100, 0], opacity: [0, 1, 0] }
              : false
          }
          transition={
            isInView
              ? { duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}
