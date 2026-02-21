"use client";

import { motion } from "framer-motion";
import {
  SiShopify,
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiStripe,
  SiGoogleanalytics,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface Tech {
  name: string;
  Icon: IconType;
}

interface Category {
  label: string;
  items: Tech[];
}

const categories: Category[] = [
  {
    label: "Frontend",
    items: [
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "React", Icon: SiReact },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "Framer Motion", Icon: SiFramer },
    ],
  },
  {
    label: "Ecommerce",
    items: [
      { name: "Shopify", Icon: SiShopify },
      { name: "Stripe", Icon: SiStripe },
    ],
  },
  {
    label: "Analytics",
    items: [{ name: "Google Analytics", Icon: SiGoogleanalytics }],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TechStackSection() {
  return (
    <section className="py-32 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neon-white">
            Our Stack
          </h2>
          <div className="h-1 w-20 bg-primary mb-6" />
          <p className="text-xl text-gray-400">
            Precise tools, chosen for performance and longevity.
          </p>
        </motion.div>

        {/* Badge categories */}
        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                {cat.label}
              </p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-3"
              >
                {cat.items.map(({ name, Icon }) => (
                  <motion.div
                    key={name}
                    variants={itemVariants}
                    className="flex items-center gap-2 px-4 py-2 rounded-full
                               bg-white/5 border border-white/10
                               hover:border-primary/40 hover:neon-glow-cyan
                               transition-all duration-300 cursor-default"
                  >
                    <Icon className="text-primary text-lg flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-300">
                      {name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
