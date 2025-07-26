"use client";
import React from "react";
import { HabitProvider } from "./habitContext";
import HabitManager from "./components/HabitManager";
import WeeklyTable from "./components/WeeklyTable";
import MonthlyCalendar from "./components/MonthlyCalendar";

const HabitTrackerPage: React.FC = () => {
  return (
    <HabitProvider>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Habit Tracker</h1>
            <p className="text-gray-600">Track your daily habits and build better routines</p>
          </div>

          {/* Habit Management */}
          <HabitManager />

          {/* Weekly Progress Table */}
          <WeeklyTable />

          {/* Monthly History Calendars */}
          <MonthlyCalendar />
        </div>
      </div>
    </HabitProvider>
  );
};

export default HabitTrackerPage;
