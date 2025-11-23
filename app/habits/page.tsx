"use client";
import React, { useState } from "react";
import { HabitProvider } from "./habitContext";
import HabitManager from "./components/HabitManager";
import WeeklyTable from "./components/WeeklyTable";
import MonthlyCalendar from "./components/MonthlyCalendar";
import Modal from "./components/Modal";

const HabitTrackerPage: React.FC = () => {
  const [isHabitManagerOpen, setHabitManagerOpen] = useState(false);
  const [isMonthlyOpen, setMonthlyOpen] = useState(false);

  return (
    <HabitProvider>
      <div className="min-h-screen py-2 mt-0">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Habit Tracker
            </h1>
            <p className="text-gray-600">
              Track your daily habits and build better routines
            </p>
          </div>

          {/* Controls: open modals */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setHabitManagerOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
            >
              Manage Habits
            </button>

            <button
              onClick={() => setMonthlyOpen(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300"
            >
              Open Monthly Calendar
            </button>
          </div>

          {/* Weekly Progress Table (always visible) */}
          <WeeklyTable />

          {/* Modals */}
          <Modal
            isOpen={isHabitManagerOpen}
            onClose={() => setHabitManagerOpen(false)}
            title="Habit Manager"
          >
            {/* Optionally you can lazy-load or keep it as is */}
            <HabitManager />
          </Modal>

          <Modal
            isOpen={isMonthlyOpen}
            onClose={() => setMonthlyOpen(false)}
            title="Monthly History"
          >
            <MonthlyCalendar />
          </Modal>
        </div>
      </div>
    </HabitProvider>
  );
};

export default HabitTrackerPage;
