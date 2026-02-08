"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to elevate your productivity?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto"
        >
          Join thousands of professionals transforming their workflow with FlowSync.
          Start your free 14-day trial today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-white to-purple-100 text-purple-900 hover:from-white hover:to-purple-200 font-bold transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
            >
              Start Free Trial
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
