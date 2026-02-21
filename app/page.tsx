"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import GradientOrb from "@/components/GradientOrb";
import FloatingParticles from "@/components/FloatingParticles";
import ServiceCard from "@/components/ServiceCard";
import AnimatedText from "@/components/AnimatedText";
import GlowButton from "@/components/GlowButton";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import TechStackSection from "@/components/TechStackSection";
import WhyGloBuyersSection from "@/components/WhyGloBuyersSection";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-white selection:bg-primary/30">
      
      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 pointer-events-none"
      >
        <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-full px-6 py-2 pointer-events-auto flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
            <Image src="/logo/logo.png" alt="GloBuyers" fill className="object-cover" />
          </div>
          <span className="font-bold tracking-tight">GloBuyers</span>
        </div>
        <div className="pointer-events-auto">
          <GlowButton variant="secondary" onClick={scrollToContact} className="!py-2 !px-6 !text-xs">
            Let's Talk
          </GlowButton>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden cyber-grid">
        <FloatingParticles />
        <GradientOrb color="cyan" size="lg" className="top-[-10%] left-[-10%] opacity-40" />
        <GradientOrb color="purple" size="lg" className="bottom-[-10%] right-[-10%] opacity-40" />
        
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 z-10 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-400 font-medium">Accepting new projects</span>
          </div>

          <AnimatedText
            text="The Future of"
            className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-2"
          />
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-primary via-accent-cyan to-white bg-clip-text text-transparent text-neon-gradient">
              Digital Commerce
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            We build high-performance software, custom Shopify apps, and intelligent automation systems for forward-thinking brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <GlowButton onClick={scrollToContact} variant="primary">
              Start Your Project
            </GlowButton>
            <GlowButton onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} variant="secondary">
              Our Expertise
            </GlowButton>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
           animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm tracking-widest uppercase"
        >
          Scroll to Explore
        </motion.div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="relative py-32 bg-background">
        <div className="container mx-auto px-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20 max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neon-white">
              Command Center
            </h2>
            <div className="h-1 w-20 bg-primary mb-6" />
            <p className="text-xl text-gray-400">
              A comprehensive suite of technical services designed to scale your business operations and revenue.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Main Service - Spans 2 columns */}
            <ServiceCard
              className="md:col-span-2 md:row-span-2"
              icon={<span className="text-4xl">🚀</span>}
              title="Custom Software Development"
              description="Full-cycle development from concept to launch. We build scalable SaaS platforms, internal tools, and customer-facing applications using modern stack technologies."
              index={0}
              bullets={[
                "SaaS platforms and internal tooling on Next.js / Node.js",
                "Real-time dashboards and admin panels",
                "Third-party integrations and webhook pipelines",
                "Cloud deployment on Vercel, AWS, or GCP",
              ]}
            />
            
            {/* Secondary Services */}
            <ServiceCard
              className="md:col-span-1 md:row-span-1"
              icon={<span className="text-4xl">🛍️</span>}
              title="Shopify Apps"
              description="Custom apps to extend your store's functionality and boost conversion."
              index={1}
              bullets={[
                "Custom storefront extensions and theme app blocks",
                "Checkout UI extensions and post-purchase flows",
                "Subscription and loyalty program integrations",
              ]}
            />

            <ServiceCard
              className="md:col-span-1 md:row-span-1"
              icon={<span className="text-4xl">⚡</span>}
              title="Automation"
              description="Workflow automation to save hours of manual work every week."
              index={2}
              bullets={[
                "Custom workflow automation for any business process",
                "Order management and inventory sync pipelines",
                "Slack, email, and CRM notification automation",
              ]}
            />

            {/* Tertiary Services spanning bottom row */}
             <ServiceCard
              className="md:col-span-3 md:row-span-1 flex-row"
              icon={<span className="text-4xl">🔌</span>}
              title="Enterprise Integration & API Development"
              description="Seamlessly connect your business data across platforms with custom API integrations and data synchronization pipelines."
              index={3}
              bullets={[
                "REST and GraphQL API design and documentation",
                "ERP, CRM, and payment gateway connectors",
                "Real-time data sync across Shopify, HubSpot, and custom DBs",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
             <div>
               <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
               <p className="text-sm text-gray-500 uppercase tracking-wider">Uptime</p>
             </div>
             <div>
               <h3 className="text-4xl font-bold text-white mb-2">2x</h3>
               <p className="text-sm text-gray-500 uppercase tracking-wider">Faster Delivery</p>
             </div>
             <div>
               <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
               <p className="text-sm text-gray-500 uppercase tracking-wider">Support</p>
             </div>
             <div>
               <h3 className="text-4xl font-bold text-white mb-2">100+</h3>
               <p className="text-sm text-gray-500 uppercase tracking-wider">Happy Clients</p>
             </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <HowWeWorkSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Why GloBuyers Section */}
      <WhyGloBuyersSection />

      {/* Contact Section */}
      <section id="contact" className="relative py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none" />
        <GradientOrb color="pink" size="lg" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        
        <div className="container mx-auto px-6 z-10 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-neon-white">
              Ready to Upgrade?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Transform your business with future-proof technology.
            </p>

            <a 
              href="mailto:support@globuyers.com"
              className="group relative inline-flex items-center justify-center gap-4 bg-white text-black px-12 py-6 rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 group-hover:underline">support@globuyers.com</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 relative rounded-full overflow-hidden grayscale opacity-50 hover:opacity-100 transition-opacity">
               <Image src="/logo/logo.png" alt="GloBuyers" fill className="object-cover" />
             </div>
             <span className="font-bold text-gray-400">GloBuyers</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} GloBuyers Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
