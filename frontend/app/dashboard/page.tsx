"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import QuickActionsBar from "@/components/dashboard/QuickActionsBar";
import TodayTasksPanel from "@/components/dashboard/TodayTasksPanel";
import TaskCreationModal from "@/components/dashboard/TaskCreationModal";
import { useAuth } from "@/lib/auth";
import { useTasks } from "@/components/useTasks";
import { AnimatePresence } from "framer-motion";
import { Task } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-8">
        {/* Welcome Section */}
        {user && (
          <WelcomeSection userName={user.name || "User"} tasks={tasks} />
        )}

        {/* Quick Actions */}
        <QuickActionsBar onNewTask={() => setIsTaskModalOpen(true)} />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto h-[600px]">
          <TodayTasksPanel
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </div>
      </div>

      {/* Modal - For both Create and Edit */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <TaskCreationModal
            onClose={handleCloseModal}
            onCreate={createTask}
            onUpdate={updateTask}
            task={editingTask}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
