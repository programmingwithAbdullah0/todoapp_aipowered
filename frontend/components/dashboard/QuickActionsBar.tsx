"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsBarProps {
  onNewTask: () => void;
}

export default function QuickActionsBar({ onNewTask }: QuickActionsBarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-4"
    >
      <motion.div variants={itemVariants}>
        <Button
          onClick={onNewTask}
          className="h-12 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-base font-medium"
        >
          <Plus size={20} />
          New Task
        </Button>
      </motion.div>

      {/* <motion.div variants={itemVariants}>
        <Button
          variant="outline"
          className="h-12 px-6 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-xl flex items-center gap-2 hover:border-slate-300 transition-all font-medium"
        >
          <Upload size={18} />
          Upload File
        </Button>
      </motion.div> */}
    </motion.div>
  );
}
