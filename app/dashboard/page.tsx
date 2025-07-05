'use client'

import ProgressChart from "@/components/progressCharts"
import TaskCardsOnly from "../task/components/taskCardsOnly"
import CurrentTimeSlot from "../planner/components/currentTimeSlot"

export default function DashboardPage() {
  return (
    <section className="h-[92vh] flex flex-col space-y-6 p-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold">Welcome back, Dev 👋</h1>
        <p className="text-gray-600">Here’s your productivity summary</p>
      </div>

      {/* Main Quadrant Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* 1st Quadrant - Left side (Task Cards Only) */}
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-auto">
          <TaskCardsOnly />
        </div>

        {/* Right side (3 stacked quadrants) */}
        <div className="grid grid-rows-[1fr_2fr_2fr] gap-6 overflow-hidden">
          
          {/* 2nd Quadrant */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-auto">
            <CurrentTimeSlot />
          </div>

          {/* 3rd Quadrant */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Task Progress</h2>
            <ProgressChart />
          </div>

          {/* 4th Quadrant */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Upcoming Tasks</h2>
            {/* Your task preview here */}
          </div>
        </div>
      </div>
    </section>
  )
}