'use client'

import { useEffect, useState } from 'react'
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const hours = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  '09:00 PM', '10:00 PM'
]

type TimeSlot = {
  hour: string
  task: string
  completed: boolean
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
          task: parsed[index]?.task || '',
          completed: parsed[index]?.completed || false
        }))
        setSlots(validated)
      } catch (e) {
        console.error('Failed to parse localStorage data:', e)
        setSlots(hours.map(h => ({ hour: h, task: '', completed: false })))
      }
    } else {
      setSlots(hours.map(h => ({ hour: h, task: '', completed: false })))
    }
  }, [])

useEffect(() => {
  if (slots.length > 0) {
    localStorage.setItem('dailyPlanner', JSON.stringify(slots))
  }
}, [slots])

  const updateTask = (i: number, value: string) => {
    const copy = [...slots]
    copy[i].task = value
    setSlots(copy)
  }

  const toggleDone = (i: number) => {
    const copy = [...slots]
    copy[i].completed = !copy[i].completed
    setSlots(copy)
  }

  const clearAllTasks = () => {
    setSlots(hours.map(h => ({ hour: h, task: '', completed: false })))
    setIsClearModalOpen(false)
  }

  const completedCount = slots.filter(slot => slot.completed).length

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">📅 Daily Planner</h2>
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-1" /> Clear All
          </button>
        </div>

        <p className="text-sm mb-4 text-gray-600">✅ Completed: {completedCount} / {slots.length}</p>

        {isClearModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 rounded-lg w-96"
            >
              <h3 className="font-semibold text-lg">Clear All Tasks?</h3>
              <p className="text-sm text-gray-600 my-2">This cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsClearModalOpen(false)} className="text-gray-500 px-3 py-1">Cancel</button>
                <button onClick={clearAllTasks} className="bg-red-500 text-white px-3 py-1 rounded-md">Clear</button>
              </div>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {slots.map((slot, i) => (
            <li key={slot.hour} className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-500">{slot.hour}</span>
              <input
                className={`flex-1 p-2 text-sm border rounded ${
                  slot.completed ? 'line-through text-gray-400 bg-gray-50' : ''
                }`}
                value={slot.task}
                onChange={e => updateTask(i, e.target.value)}
                placeholder="Enter task..."
              />
              <button
                onClick={() => toggleDone(i)}
                className={`px-2 py-1 rounded ${
                  slot.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
