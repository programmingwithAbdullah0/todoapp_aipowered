"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MoreHorizontal, Filter } from "lucide-react";
import TaskItem from "./TaskItem";
import { Task } from "@/lib/api";

interface TodayTasksPanelProps {
  tasks: Task[];
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TodayTasksPanel({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodayTasksPanelProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Today&apos;s Tasks
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {tasks.length}
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Wednesday, 8 Jan</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === "all" ? "pending" : "all")}
            className={`p-2 rounded-lg transition-colors ${
              filter !== "all"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-slate-100 text-slate-400"
            }`}
            title="Filter tasks"
          >
            <Filter size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 icon-scale">
                <Calendar className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No tasks found</p>
              <p className="text-sm text-slate-400 mt-1">
                Enjoy your free time!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
