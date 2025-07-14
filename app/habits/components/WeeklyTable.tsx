"use client";
import React, { useState } from "react";
import { useHabits } from "../habitContext";

const WeeklyTable: React.FC = () => {
  const { habits, getWeeklyProgress, toggleHabitCompletion, getProgressPercentage } = useHabits();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
  });

  const getWeekDates = (weekStart: string) => {
    const dates = [];
    const startDate = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentWeekStart);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentWeekStart(currentDate.toISOString().split('T')[0]);
  };

  const weekDates = getWeekDates(currentWeekStart);

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No habits added yet. Add your first habit to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Weekly Progress</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <span className="text-sm font-medium text-gray-600">
            {new Date(currentWeekStart).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })} - {
              new Date(weekDates[6]).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            }
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-600">Habit</th>
              {weekDates.map((date) => (
                <th key={date} className="text-center py-3 px-2 font-medium text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">{getDayName(date)}</span>
                    <span className="text-sm font-semibold">{getDayNumber(date)}</span>
                  </div>
                </th>
              ))}
              <th className="text-center py-3 px-2 font-medium text-gray-600">Progress</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const weekProgress = getWeeklyProgress(habit.id, currentWeekStart);
              const progressPercentage = getProgressPercentage(habit.id, currentWeekStart);
              
              return (
                <tr key={habit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="font-medium text-gray-800">{habit.name}</div>
                    {habit.description && (
                      <div className="text-xs text-gray-500">{habit.description}</div>
                    )}
                  </td>
                  {weekDates.map((date) => {
                    const isCompleted = weekProgress[date] || false;
                    const isToday = date === new Date().toISOString().split('T')[0];
                    
                    return (
                      <td key={date} className="text-center py-3 px-2">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleHabitCompletion(habit.id, date)}
                          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        {isToday && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-8">
                        {progressPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyTable; 