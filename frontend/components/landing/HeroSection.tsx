"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Play, ArrowRight } from "lucide-react";

function DemoTask({
  text,
  checked,
  index,
}: {
  text: string;
  checked: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.5 }}
      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm mb-3"
    >
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          checked ? "bg-blue-500 border-blue-500" : "border-gray-300"
        }`}
      >
        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <div
        className={`flex-1 text-sm ${
          checked ? "text-gray-400 line-through" : "text-gray-700 font-medium"
        }`}
      >
        {text}
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          checked ? "bg-gray-200" : "bg-blue-200"
        }`}
      />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-50/50 to-pink-50/50 opacity-60" />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/30 to-teal-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4 fill-purple-600" />
            <span>New: Smart Task Automation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Sync your tasks, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              elevate your flow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            FlowSync helps you manage tasks, automate workflows, and
            achieve peak productivity with an elegant, intuitive interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-600/20 hover:shadow-purple-600/30 transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-gray-200 hover:bg-gray-50 hover:text-slate-900 transition-all hidden sm:flex"
            >
              <Play className="mr-2 w-5 h-5 fill-current" />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Visual Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden aspect-video md:aspect-video flex flex-col">
            {/* Fake Browser Toolbar */}
            <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 w-full max-w-md bg-white border border-gray-200 rounded-md mx-auto opacity-50" />
              </div>
            </div>

            {/* App UI */}
            <div className="flex-1 flex bg-white overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 hidden sm:block">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="h-8 bg-blue-100 rounded-md w-full" />
                    <div className="h-8 bg-transparent rounded-md w-full" />
                    <div className="h-8 bg-transparent rounded-md w-full" />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 sm:p-8 bg-white relative">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <div className="h-8 w-48 bg-gray-900 rounded-md mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded-md" />
                  </div>
                  <div className="h-10 w-32 bg-blue-600 rounded-full hidden sm:block" />
                </div>

                <div className="space-y-2">
                  <DemoTask
                    index={0}
                    text="Review Q4 marketing goals"
                    checked={true}
                  />
                  <DemoTask
                    index={1}
                    text="Update landing page copy"
                    checked={false}
                  />
                  <DemoTask
                    index={2}
                    text="Sync with design team"
                    checked={false}
                  />
                  <DemoTask
                    index={3}
                    text="Prepare weekly metrics report"
                    checked={false}
                  />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-8 right-8 p-4 bg-white rounded-xl shadow-xl border border-gray-100 w-48 z-10 hidden md:block"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Status</div>
                      <div className="text-sm font-semibold text-gray-900">
                        Completed
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
