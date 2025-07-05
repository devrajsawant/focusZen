'use client'

import { useEffect, useState } from 'react'
import { ClockIcon, CheckIcon } from '@heroicons/react/24/outline'

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

export default function CurrentTimeSlot() {
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

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
        
        // Find current time slot
        const now = currentTime
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        
        // Convert current time to 12-hour format for comparison
        let currentTimeString = ''
        if (currentHour === 0) {
          currentTimeString = '12:00 AM'
        } else if (currentHour < 12) {
          currentTimeString = `${currentHour.toString().padStart(2, '0')}:00 AM`
        } else if (currentHour === 12) {
          currentTimeString = '12:00 PM'
        } else {
          currentTimeString = `${(currentHour - 12).toString().padStart(2, '0')}:00 PM`
        }
        
        // Find the matching slot
        const slot = validated.find(s => s.hour === currentTimeString)
        setCurrentSlot(slot || null)
        
      } catch (e) {
        console.error('Failed to parse localStorage data:', e)
        setCurrentSlot(null)
      }
    } else {
      setCurrentSlot(null)
    }
  }, [currentTime])

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }



  return (
    
    <div className="space-y-2">

      {currentSlot ? (
        <div className="p-2 rounded-lg">
          <div className="mb-1">
            <span className="text-sm font-medium text-gray-800">{currentSlot.hour}</span>
          </div>
          
          {currentSlot.task ? (
            <div>
              <p className={`text-xs ${currentSlot.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {currentSlot.task}
              </p>
              {currentSlot.completed && (
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <CheckIcon className="h-3 w-3" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No task scheduled</p>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            No planning data available
          </p>
        </div>
      )}
    </div>
  )
} 