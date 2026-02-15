"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import GlowButton from "@/components/GlowButton";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
       <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 pointer-events-none"
      >
        <Link href="/" className="bg-black/20 backdrop-blur-md border border-white/5 rounded-full px-6 py-2 pointer-events-auto flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
             <Image src="/logo/logo.png" alt="GloBuyers" fill className="object-cover" />
          </div>
          <span className="font-bold tracking-tight">GloBuyers</span>
        </Link>
        <div className="pointer-events-auto">
          <Link href="/">
             <GlowButton variant="secondary" className="!py-2 !px-6 !text-xs">
              Back to Home
            </GlowButton>
          </Link>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-32 md:py-40 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-light">
            <p className="text-gray-400 mb-8">
              <strong>Effective Date:</strong> February 15, 2026
            </p>

            <p>
              GloBuyers ("we", "us", or "our") is committed to protecting the privacy of our merchants and their customers. 
              This Privacy Policy describes how we collect, use, and disclose personal information when you install or use 
              the <strong>GloBuyers</strong> app (the "App") in connection with your Shopify-supported store.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">1. Information We Collect</h3>
            <p>
              When you install the App, we are automatically able to access certain types of information from your Shopify account:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong>Merchant Information:</strong> We collect your name, email address, shop URL, and phone number 
                to provide you with our services and for billing purposes.
              </li>
              <li>
                <strong>Store Data:</strong> We may access data about your store's products, orders, and customers 
                as necessary to provide the App's functionality.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">2. How We Use Your Information</h3>
            <p>
              We use the personal information we collect from you and your customers in order to provide the Service 
              and to operate the App. Specific uses include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Providing Services:</strong> To operate the core features of the GloBuyers app.</li>
              <li><strong>Communication:</strong> To communicate with you about your account, app updates, or support requests.</li>
              <li><strong>Billing:</strong> To process payments for subscription or usage fees (if applicable).</li>
              <li><strong>Improvement:</strong> To analyze app usage and improve our features and user experience.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">3. Sharing Your Information</h3>
            <p>
              We do not sell your personal information. We may share your Personal Information to comply with applicable 
              laws and regulations, to respond to a subpoena, search warrant or other lawful request for information 
              we receive, or to otherwise protect our rights.
            </p>
            <p className="mt-4">
              We may also share your information with the following third parties to help us provide our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Shopify:</strong> We share information with Shopify to power our App’s functionality within your store.</li>
              <li><strong>Analytics Providers:</strong> We may use analytics services (such as Google Analytics) to help us understand how our customers use the App.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">4. Data Retention</h3>
            <p>
              We will maintain your Personal Information for our records unless and until you ask us to delete this information. 
              If you uninstall the App, we may retain certain information for billing or regulatory purposes for a limited time.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">5. Your Rights (GDPR & CCPA)</h3>
            <p>
              If you are a resident of the European Economic Area (EEA) or California, you have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> You have the right to request that we correct any inaccuracies in your personal information.</li>
              <li><strong>Deletion:</strong> You have the right to request that we delete your personal information.</li>
            </ul>
            <p className="mt-4">
              If you would like to exercise these rights, please contact us at the contact information below. 
              Additionally, if you are a merchant, note that we generally process your customers' information 
              as a data processor on your behalf; you are the data controller.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">6. Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time in order to reflect, for example, changes to 
              our practices or for other operational, legal or regulatory reasons.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">7. Contact Us</h3>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at:
            </p>
            <p className="mt-4 text-xl font-bold text-primary">
              <a href="mailto:support@globuyers.com">support@globuyers.com</a>
            </p>
            <p className="mt-4 text-gray-400">
              GloBuyers<br />
              [Physical Address Available Upon Request]
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="relative py-12 border-t border-white/5 bg-black mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} GloBuyers Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
