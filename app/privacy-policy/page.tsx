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
            <h2 className="text-3xl font-bold mb-4 text-white">Simple Bulk Operations – GB</h2>
            <p className="text-gray-400 mb-8">
              <strong>Effective Date:</strong> February 15, 2026
            </p>

            <p>
              Simple Bulk Operations – GB ("we", "us", or "our") is committed to protecting the privacy and data of Shopify merchants who install and use our application (the "App"). This Privacy Policy explains how we access, use, and safeguard information in connection with your Shopify store.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">1. Information We Access</h3>
            <p>
              When you install the App, you grant us access to certain Shopify store data through Shopify’s permission system. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Store information (such as shop name, shop URL, and contact email)</li>
              <li>Product data (including product titles, variants, and SKUs)</li>
              <li>Inventory data (including inventory quantities and location information)</li>
            </ul>
            <p className="mt-4">
              The App does not intentionally collect or process customer personal data. Our access is limited strictly to the data necessary to perform bulk product deletion and inventory update operations.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">2. How We Use Information</h3>
            <p>
              We use the accessed data solely to provide the App’s core functionality, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Bulk deleting products by SKU or product title</li>
              <li>Updating inventory quantities by SKU</li>
              <li>Updating inventory at a selected location</li>
              <li>Displaying operation results, including success and error reports</li>
            </ul>
            <p className="mt-4">
              We do not use store data for advertising, marketing, or profiling purposes.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">3. CSV File Handling</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>CSV files uploaded by merchants are used only to perform the requested bulk operation.</li>
              <li>Uploaded CSV files are processed temporarily and are deleted after the operation is completed. We do not retain uploaded CSV files and we do not sell or share their contents.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">4. Log Data and Retention</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>To ensure reliability, security, and troubleshooting support, we store limited operational logs related to bulk job execution (such as job status and error messages).</li>
              <li>Logs are retained for up to 30 days.</li>
              <li>If a merchant uninstalls the App, related logs are deleted.</li>
              <li>We do not retain store data beyond what is necessary to operate the App.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">5. Data Sharing</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>We do not sell merchant data.</li>
              <li>We may share limited data with trusted infrastructure and hosting providers strictly for the purpose of operating and maintaining the App. We may also disclose information if required by law or in response to valid legal requests.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-12 mb-6">6. Merchant Rights</h3>
            <p>
              Depending on your jurisdiction, you may have rights under applicable privacy laws, including the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Request access to your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of stored data</li>
            </ul>
            <p className="mt-4">
              If you are a Shopify merchant, you are the data controller of your customers’ data. The App acts as a data processor solely to perform the bulk operations you initiate.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">7. Security</h3>
            <p>
              We implement reasonable technical and organizational measures to protect store data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">8. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time for operational, legal, or regulatory reasons. Any updates will be reflected by revising the Effective Date above.
            </p>

            <h3 className="text-2xl font-semibold mt-12 mb-6">9. Contact Information</h3>
            <p>
              If you have any questions about this Privacy Policy or your data, please contact us at:
            </p>
            <p className="mt-4 text-xl font-bold text-primary">
              <a href="mailto:support@globuyers.com">support@globuyers.com</a>
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
