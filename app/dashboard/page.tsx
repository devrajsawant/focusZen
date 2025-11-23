"use client";

import ProgressChart from "@/components/progressCharts";
import TaskCardsOnly from "../task/components/taskCardsOnly";
import CurrentTimeSlot from "../planner/components/currentTimeSlot";
import HabitWeeklyChart from "./HabitWeeklyChart";
import { HabitProvider } from "../habits/habitContext";
import { Project } from "../project/components/projectCard";
import ProjectPanel from "../project/components/projectPanel";

export default function DashboardPage() {
  // Example projects - replace with real data or pass from props/context
  const exampleProjects: Project[] = [
    {
      id: 1,
      title: "Landing page revamp",
      progressPercent: 42,
      endDate: "2025-12-05",
    },
    {
      id: 2,
      title: "Onboarding flow",
      progressPercent: 78,
      endDate: "2025-11-30",
    },
    {
      id: 3,
      title: "Metrics dashboard",
      progressPercent: 20,
      endDate: "2026-01-15",
    },
  ];

  return (
    <HabitProvider>
      <section className="min-h-[95vh] sm:h-[98vh] flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="shrink-0">
          <h1 className="text-xl md:text-4xl font-bold">
            Welcome back, Champ 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Here's your productivity summary
          </p>
        </div>

        {/* Main layout: stacks vertically on small screens, side-by-side from md */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden">
          {/* LEFT column (full width on small, ~70% on md+) */}
          <div className="flex flex-col w-full md:w-[70%] gap-4 overflow-hidden">
            {/* Project panel (top) */}
            <div className="shrink-0">
              <ProjectPanel projects={exampleProjects} />
            </div>

            {/* Task list (fills remaining left space) */}
            <div className="flex-1 bg-white rounded-xl shadow-sm p-4 sm:p-6 overflow-auto">
              <TaskCardsOnly />
            </div>
          </div>

          {/* RIGHT column (full width below on small, ~30% on md+) */}
          <div className="flex flex-col w-full md:w-[30%] gap-4 overflow-hidden">
            {/* Top: Timeline - on small screens give a fixed height, on md behave as 60% of column */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 overflow-auto h-48 md:flex-[0_0_60%] md:h-auto">
              <CurrentTimeSlot />
            </div>

            {/* Bottom: Habit chart - fixed height on small, 40% on md */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 overflow-auto h-40 md:flex-[0_0_40%] md:h-auto">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                Habits
              </h2>
              <HabitWeeklyChart />
            </div>
          </div>
        </div>
      </section>
    </HabitProvider>
  );
}
