"use client";

import { motion } from "framer-motion";
import { FiShoppingBag, FiZap, FiLifeBuoy } from "react-icons/fi";
import type { IconType } from "react-icons";

interface Differentiator {
  Icon: IconType;
  headline: string;
  expansion: string;
}

const differentiators: Differentiator[] = [
  {
    Icon: FiShoppingBag,
    headline: "Shopify Specialists",
    expansion:
      "We've shipped custom Shopify apps, checkout extensions, and storefront builds — you get a team that knows the platform's edge cases before they slow you down.",
  },
  {
    Icon: FiZap,
    headline: "Fast, Predictable Delivery",
    expansion:
      "Fixed-scope projects ship in 4–8 weeks with weekly demos, so you always know exactly where your build stands.",
  },
  {
    Icon: FiLifeBuoy,
    headline: "Post-Launch Support",
    expansion:
      "30-day post-launch coverage is included on every project — bugs fixed, adjustments made, no surprise invoices.",
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

export default function WhyGloBuyersSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neon-white">
            Why GloBuyers
          </h2>
          <div className="h-1 w-20 bg-primary mb-6" />
          <p className="text-xl text-gray-400">
            What makes the difference when you need it to ship.
          </p>
        </motion.div>

        {/* Differentiator card grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {differentiators.map(({ Icon, headline, expansion }) => (
            <motion.div
              key={headline}
              variants={itemVariants}
              className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10
                         hover:border-primary/40 hover:neon-glow-cyan transition-all duration-300"
            >
              <div className="mb-5 p-3 rounded-2xl bg-white/5 border border-white/10 w-fit">
                <Icon className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{headline}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{expansion}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
