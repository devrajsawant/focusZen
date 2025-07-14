"use client";
import React, { useState } from "react";
import { useHabits } from "../habitContext";

const MonthlyCalendar: React.FC = () => {
  const { habits, getMonthlyProgress } = useHabits();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;
      
      if (direction === 'prev') {
        if (newMonth === 1) {
          newMonth = 12;
          newYear--;
        } else {
          newMonth--;
        }
      } else {
        if (newMonth === 12) {
          newMonth = 1;
          newYear++;
        } else {
          newMonth++;
        }
      }
      
      return { year: newYear, month: newMonth };
    });
  };

  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  if (habits.length === 0) {
    return null;
  }

  const calendarDays = generateCalendarDays(currentDate.year, currentDate.month);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Monthly History</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <span className="text-sm font-medium text-gray-600">
            {getMonthName(currentDate.month)} {currentDate.year}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const monthlyProgress = getMonthlyProgress(habit.id, currentDate.year, currentDate.month);
          
          return (
            <div key={habit.id} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="font-medium text-gray-800 mb-1">{habit.name}</h3>
                {habit.description && (
                  <p className="text-xs text-gray-500">{habit.description}</p>
                )}
              </div>
              
              <div className="calendar-grid">
                {/* Calendar header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="h-6"></div>;
                    }
                    
                    const dateString = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isCompleted = monthlyProgress[dateString] || false;
                    const isToday = dateString === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div
                        key={index}
                        className={`
                          h-6 w-6 rounded text-xs flex items-center justify-center font-medium
                          ${isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                          }
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                        `}
                        title={`${dateString} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Progress summary */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Completed:</span>
                  <span className="font-medium">
                    {Object.values(monthlyProgress).filter(Boolean).length} days
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar; 