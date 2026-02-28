"use client";

import { motion } from "framer-motion";
import React from "react";

// TODO: Process step copy (Discovery/Build/Launch/Support descriptions) — needs validation against actual GloBuyers service delivery. See STATE.md pending todos.
const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We map your current workflows, integrations, and goals. You get a clear project spec with milestones and delivery dates before we write a single line of code.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Iterative development with weekly demos. You see real progress every week — no black-box sprints, no surprises at handoff.",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Production deployment with full monitoring setup. We handle domain config, CI/CD, and post-launch smoke tests so the go-live is smooth.",
  },
  {
    number: "04",
    title: "Support",
    description:
      "30-day post-launch support included. Bug fixes, minor adjustments, and performance tuning covered at no additional cost.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowWeWorkSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section heading — matches existing Services section pattern exactly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neon-white">
            How We Work
          </h2>
          <div className="h-1 w-20 bg-primary mb-6" />
          <p className="text-xl text-gray-400">Four clear stages. No black boxes.</p>
        </motion.div>

        {/* Stagger container — timeline row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start gap-4 md:gap-0"
        >
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <motion.div
                variants={itemVariants}
                className="flex-1 min-w-0 p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10
                           hover:border-primary/40 hover:neon-glow-cyan transition-all duration-300"
              >
                <span className="block text-5xl md:text-6xl font-bold text-primary/30 mb-3 leading-none">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center flex-shrink-0 text-primary/30 text-xl px-3 self-center">
                  ──▶
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
