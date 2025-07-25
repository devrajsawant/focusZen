'use client'

import { useEffect, useState } from 'react'
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const hours = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  '09:00 PM', '10:00 PM', '11:00 PM', '12:00'
]

type Task = {
  text: string
  completed: boolean
}

type TimeSlot = {
  hour: string
  tasks: Task[]
}

export default function DailyPlanner() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dailyPlanner')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const validated = hours.map((hour, index) => ({
          hour,
          tasks: parsed[index]?.tasks || []
        }))
        setSlots(validated)
      } catch {
        setSlots(hours.map(hour => ({ hour, tasks: [] })))
      }
    } else {
      setSlots(hours.map(hour => ({ hour, tasks: [] })))
    }
  }, [])

  useEffect(() => {
    if (slots.length > 0) {
      localStorage.setItem('dailyPlanner', JSON.stringify(slots))
    }
  }, [slots])

  const addTask = (hourIndex: number) => {
    const copy = [...slots]
    copy[hourIndex].tasks.push({ text: '', completed: false })
    setSlots(copy)
  }

  const updateTask = (hourIndex: number, taskIndex: number, value: string) => {
    const copy = [...slots]
    copy[hourIndex].tasks[taskIndex].text = value
    setSlots(copy)
  }

  const toggleDone = (hourIndex: number, taskIndex: number) => {
    const copy = [...slots]
    copy[hourIndex].tasks[taskIndex].completed = !copy[hourIndex].tasks[taskIndex].completed
    setSlots(copy)
  }

  const removeTask = (hourIndex: number, taskIndex: number) => {
    const copy = [...slots]
    copy[hourIndex].tasks.splice(taskIndex, 1)
    setSlots(copy)
  }

  const clearAllTasks = () => {
    setSlots(hours.map(hour => ({ hour, tasks: [] })))
    setIsClearModalOpen(false)
  }

  const completedCount = slots.reduce((acc, slot) => {
    return acc + slot.tasks.filter(task => task.completed).length
  }, 0)

  const totalTasks = slots.reduce((acc, slot) => acc + slot.tasks.length, 0)

  return (
    <div className="min-h-screen sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold">📅 Daily Planner</h2>
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="text-red-600 hover:text-red-800 flex items-center justify-center sm:justify-start text-sm sm:text-base"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" /> Clear All
          </button>
        </div>

        <p className="text-xs sm:text-sm mb-4 text-gray-600">
          ✅ Completed: {completedCount} / {totalTasks}
        </p>

        {isClearModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm"
            >
              <h3 className="font-semibold text-base sm:text-lg">Clear All Tasks?</h3>
              <p className="text-xs sm:text-sm text-gray-600 my-2">This cannot be undone.</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="text-gray-500 px-3 py-2 text-sm sm:text-base rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllTasks}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm sm:text-base hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="space-y-4">
          {slots.map((slot, hourIndex) => (
            <li key={slot.hour} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">{slot.hour}</span>
                <button
                  onClick={() => addTask(hourIndex)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  + Add Task
                </button>
              </div>

              {slot.tasks.length === 0 && (
                <p className="text-gray-400 text-sm">No tasks yet.</p>
              )}

              <ul className="space-y-2">
                {slot.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-center gap-2">
                    <input
                      className={`flex-1 p-2 text-sm border rounded-md ${
                        task.completed ? 'line-through text-gray-400 bg-gray-100' : ''
                      } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                      value={task.text}
                      onChange={(e) => updateTask(hourIndex, taskIndex, e.target.value)}
                      placeholder="Enter task..."
                    />
                    <button
                      onClick={() => toggleDone(hourIndex, taskIndex)}
                      className={`px-2 py-1 rounded-md text-white text-xs ${
                        task.completed
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeTask(hourIndex, taskIndex)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
