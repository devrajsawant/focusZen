"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  completedDates: string[];
  createdAt: string;
};

export type WeeklyProgress = {
  [habitId: string]: {
    [date: string]: boolean;
  };
};

export type HabitContextType = {
  habits: Habit[];
  weeklyProgress: WeeklyProgress;
  addHabit: (name: string, description?: string) => void;
  deleteHabit: (id: string) => void;
  editHabit: (id: string, name: string, description?: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  getWeeklyProgress: (habitId: string, weekStart: string) => { [date: string]: boolean };
  getMonthlyProgress: (habitId: string, year: number, month: number) => { [date: string]: boolean };
  getProgressPercentage: (habitId: string, weekStart: string) => number;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    const storedProgress = localStorage.getItem("weeklyProgress");
    
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
    if (storedProgress) {
      setWeeklyProgress(JSON.parse(storedProgress));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    if (Object.keys(weeklyProgress).length > 0) {
      localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
    }
  }, [weeklyProgress]);

  const addHabit = (name: string, description?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setWeeklyProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const editHabit = (id: string, name: string, description?: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id 
          ? { ...habit, name, description } 
          : habit
      )
    );
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setWeeklyProgress(prev => {
      const habitProgress = prev[habitId] || {};
      const isCompleted = habitProgress[date] || false;
      
      return {
        ...prev,
        [habitId]: {
          ...habitProgress,
          [date]: !isCompleted,
        },
      };
    });
  };

  const getWeeklyProgress = (habitId: string, weekStart: string) => {
    const habitProgress = weeklyProgress[habitId] || {};
    const weekProgress: { [date: string]: boolean } = {};
    
    // Generate dates for the week
    const startDate = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      weekProgress[dateString] = habitProgress[dateString] || false;
    }
    
    return weekProgress;
  };

  const getMonthlyProgress = (habitId: string, year: number, month: number) => {
    const habitProgress = weeklyProgress[habitId] || {};
    const monthProgress: { [date: string]: boolean } = {};
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const daysInMonth = endDate.getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      monthProgress[dateString] = habitProgress[dateString] || false;
    }
    
    return monthProgress;
  };

  const getProgressPercentage = (habitId: string, weekStart: string) => {
    const weekProgress = getWeeklyProgress(habitId, weekStart);
    const completedDays = Object.values(weekProgress).filter(Boolean).length;
    return Math.round((completedDays / 7) * 100);
  };

  return (
    <HabitContext.Provider value={{
      habits,
      weeklyProgress,
      addHabit,
      deleteHabit,
      editHabit,
      toggleHabitCompletion,
      getWeeklyProgress,
      getMonthlyProgress,
      getProgressPercentage,
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};
