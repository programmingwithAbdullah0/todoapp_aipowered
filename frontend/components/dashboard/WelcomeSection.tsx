"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Task } from "@/lib/api";

interface WelcomeSectionProps {
  userName: string;
  tasks: Task[];
}

export default function WelcomeSection({
  userName,
  tasks,
}: WelcomeSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Calculate Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const inProgress = total - completed;
  // Mocking overdue for now as Task doesn't always have due date in this simple version, or we check it.
  // Assuming Task has dueDate string/date? I saw 'due_date' in mock API before but let's check basic Task type later.
  // For now, I'll assume 0 overdue or check if I can.
  // Let's stick to known props.

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: Circle,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {getGreeting()},{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-violet-600">
              {userName}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            You have{" "}
            <strong className="text-slate-800">{inProgress} tasks</strong>{" "}
            remaining today.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {/* <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bgColor} ${stat.textColor}`}>
                +12%
              </span> */}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
