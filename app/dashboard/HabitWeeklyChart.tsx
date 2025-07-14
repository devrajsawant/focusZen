"use client";
import React, { useState } from "react";
import { useHabits } from "../habits/habitContext";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

const getWeekDates = (weekStart: string) => {
  const dates = [];
  const startDate = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const getDayLabel = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getCurrentWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
};

const HabitWeeklyChart: React.FC = () => {
  const { habits, getWeeklyProgress } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || "");
  const [currentWeekStart, setCurrentWeekStart] = useState(getCurrentWeekStart());

  React.useEffect(() => {
    if (habits.length > 0 && !habits.find(h => h.id === selectedHabitId)) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  if (habits.length === 0) {
    return <div className="text-gray-500 text-center py-8">No habits to show. Add a habit to see progress.</div>;
  }

  const weekDates = getWeekDates(currentWeekStart);
  const weekProgress = selectedHabitId ? getWeeklyProgress(selectedHabitId, currentWeekStart) : {};
  const chartData = weekDates.map(date => ({
    day: getDayLabel(date),
    Completed: weekProgress[date] ? 1 : 0,
  }));

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  const navigateWeek = (direction: "prev" | "next") => {
    const currentDate = new Date(currentWeekStart);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentWeekStart(currentDate.toISOString().split("T")[0]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm sm:text-base font-semibold">Weekly Habit Progress</h3>
        <select
          value={selectedHabitId}
          onChange={e => setSelectedHabitId(e.target.value)}
          className="ml-2 px-1.5 py-0.5 rounded border border-gray-300 text-xs bg-white"
          style={{ minWidth: 80 }}
        >
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 truncate max-w-[60%]">
          {selectedHabit?.description}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-0.5 rounded hover:bg-gray-100 text-gray-500 text-xs"
            title="Previous week"
          >
            ←
          </button>
          <span className="text-[10px] text-gray-600">
            {new Date(currentWeekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" - "}
            {new Date(weekDates[6]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button
            onClick={() => navigateWeek("next")}
            className="p-0.5 rounded hover:bg-gray-100 text-gray-500 text-xs"
            title="Next week"
          >
            →
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} domain={[0, 1]} ticks={[0, 1]} tick={{ fontSize: 10 }} />
          <Tooltip wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitWeeklyChart; 