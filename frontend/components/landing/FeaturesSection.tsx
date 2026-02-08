"use client";

import { motion, Variants } from "framer-motion";
import { Zap, Shield, Users } from "lucide-react";

// --- Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase mb-2">
            Powerful Features
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to{" "}
            <span className="text-purple-600">achieve more.</span>
          </p>
          <p className="text-lg text-slate-600">
            Designed for individuals and teams who want to focus on what matters most.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <Zap className="w-6 h-6 text-purple-500" />,
              title: "Smart Automation",
              desc: "Intelligent task sorting and automation to save your valuable time.",
            },
            {
              icon: <Shield className="w-6 h-6 text-pink-500" />,
              title: "Military-Grade Security",
              desc: "Your data is protected with end-to-end encryption and secure protocols.",
            },
            {
              icon: <Users className="w-6 h-6 text-cyan-500" />,
              title: "Seamless Collaboration",
              desc: "Work together in real-time with shared workspaces and instant sync.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50 border border-purple-100/50 hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
