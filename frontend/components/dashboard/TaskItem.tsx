"use client";

import { Task } from "@/lib/api";
import { motion } from "framer-motion";
import { Check, Clock, Trash2, Edit2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const isCompleted = task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 border ${
        isCompleted
          ? "bg-slate-50/50 border-slate-100"
          : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md"
      }`}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id, !isCompleted)}
        className={`shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isCompleted
            ? "bg-blue-600 border-blue-600 shadow-sm scale-110"
            : "border-slate-300 hover:border-blue-400 bg-transparent"
        }`}
      >
        <Check
          size={14}
          className={`text-white transition-transform duration-200 ${
            isCompleted ? "scale-100" : "scale-0"
          }`}
          strokeWidth={3}
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
              isCompleted
                ? "bg-slate-100 text-slate-400"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            #{task.id}
          </span>
          <h4
            className={`text-base font-medium transition-colors duration-300 ${
              isCompleted
                ? "text-slate-400 line-through decoration-slate-300"
                : "text-slate-800"
            }`}
          >
            {task.title}
          </h4>
        </div>

        {task.description && (
          <p
            className={`mt-1 text-sm line-clamp-2 transition-colors duration-300 ${
              isCompleted ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />
            <span>
              {task.created_at
                ? new Date(task.created_at).toLocaleDateString()
                : "Today"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
