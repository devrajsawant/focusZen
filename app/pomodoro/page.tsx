'use client'

import { useState, useEffect, useRef } from 'react'
import { PlayIcon, PauseIcon, StopIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

type ChecklistItem = {
  id: number
  text: string
  checked: boolean
}

type PomodoroSession = {
  id: number
  taskName: string
  duration: number
  completed: boolean
  createdAt: number
}

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [taskName, setTaskName] = useState('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [initialTime, setInitialTime] = useState(25 * 60) // Track the initial time set
  const [hasCompleted, setHasCompleted] = useState(false) // Flag to prevent duplicate saves
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions')
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('pomodoroSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  // Save checklist to sessionStorage
  useEffect(() => {
    if (checklist.length > 0) {
      sessionStorage.setItem('pomodoroChecklist', JSON.stringify(checklist))
    }
  }, [checklist])

  // Load checklist from sessionStorage
  useEffect(() => {
    const savedChecklist = sessionStorage.getItem('pomodoroChecklist')
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist))
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0 && !hasCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsPaused(false)
            setHasCompleted(true)
            
            // Save completed session only if task name exists and hasn't been saved yet
            if (taskName.trim()) {
              const actualDuration = initialTime // The full duration since timer completed
              const newSession: PomodoroSession = {
                id: Date.now(),
                taskName: taskName.trim(),
                duration: actualDuration,
                completed: true,
                createdAt: Date.now()
              }
              setSessions(prev => [newSession, ...prev])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, timeLeft, taskName, initialTime, hasCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const setTimer = (minutes: number) => {
    const newTime = minutes * 60
    setTimeLeft(newTime)
    setInitialTime(newTime) // Update initial time when setting timer
    setIsRunning(false)
    setIsPaused(false)
    setHasCompleted(false) // Reset completion flag
    setShowCustomInput(false)
  }

  const startTimer = () => {
    if (timeLeft > 0 && !hasCompleted) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setHasCompleted(false) // Reset completion flag
    setTimeLeft(25 * 60) // Reset to 25 minutes
    setInitialTime(25 * 60) // Reset initial time
  }

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now(),
        text: newChecklistItem.trim(),
        checked: false
      }
      setChecklist([...checklist, newItem])
      setNewChecklistItem('')
    }
  }

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const deleteChecklistItem = (id: number) => {
    setChecklist(checklist.filter(item => item.id !== id))
  }

  const setCustomTime = () => {
    const minutes = parseInt(customMinutes)
    if (minutes > 0 && minutes <= 480) { // Max 8 hours
      setTimer(minutes)
      setCustomMinutes('')
    }
  }

  const loadTaskFromSession = (session: PomodoroSession) => {
    setTaskName(session.taskName)
    setTimer(Math.floor(session.duration / 60))
  }

  const completedToday = sessions.filter(
    session => session.completed && 
    new Date(session.createdAt).toDateString() === new Date().toDateString()
  ).length

  const totalFocusTime = sessions.reduce((total, session) => total + session.duration, 0)
  const totalFocusHours = Math.floor(totalFocusTime / 3600)
  const totalFocusMinutes = Math.floor((totalFocusTime % 3600) / 60)

  const currentDuration = Math.floor(timeLeft / 60)

  return (
    <div className="min-h-screen sm:p-6 font-sans flex">
      <div className="max-w-6xl w-full ml-0 space-y-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-indigo-900 text-center">
          🍅 Pomodoro Timer
        </h1>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Left Column - Recent Tasks */}
          <div className="bg-white p-4 h-fit sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-4 col-span-1">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Recent Tasks</h3>
            {sessions.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No completed tasks yet.
              </p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 8).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadTaskFromSession(session)}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-indigo-900 text-sm">{session.taskName}</div>
                    <div className="text-xs text-gray-600">
                      {Math.floor(session.duration / 60)} minutes • {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Middle Column - Timer (Wider) */}
          <div className="col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
            {/* Shortcut Pills */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              <button
                onClick={() => setTimer(25)}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium hover:bg-indigo-200 transition-colors"
              >
                25 min
              </button>
              <button
                onClick={() => setTimer(45)}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium hover:bg-indigo-200 transition-colors"
              >
                45 min
              </button>
              <button
                onClick={() => setTimer(60)}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium hover:bg-indigo-200 transition-colors"
              >
                60 min
              </button>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Custom
              </button>
            </div>

            {/* Custom Time Input */}
            {showCustomInput && (
              <div className="flex gap-2 mb-6 justify-center">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Enter minutes (1-480)"
                  min="1"
                  max="480"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  onClick={setCustomTime}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Set
                </button>
              </div>
            )}

            {/* Big Clock */}
            <div className="text-center mb-6">
              <div className="text-6xl sm:text-8xl font-bold text-gray-800 mb-4 font-mono">
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((initialTime - timeLeft) / initialTime) * 100}%` 
                  }}
                ></div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-4 justify-center">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Start
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resumeTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                  >
                    <PauseIcon className="h-5 w-5" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={stopTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <StopIcon className="h-5 w-5" />
                  Stop
                </button>
              </div>
            </div>

            {/* Task Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What are you working on?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Checklist */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Checklist (Optional)
              </label>
              
              {/* Add Checklist Item */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add a checklist item..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <button
                  onClick={addChecklistItem}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Checklist Items */}
              {checklist.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4 col-span-1">
            {/* General Summary */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-2">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Today's Progress</h3>
              <p className="text-sm">
                <strong>Sessions:</strong> {completedToday}
              </p>
              <p className="text-sm">
                <strong>Focus Time:</strong> {Math.floor(sessions.filter(s => 
                  s.completed && new Date(s.createdAt).toDateString() === new Date().toDateString()
                ).reduce((total, session) => total + session.duration, 0) / 60)} minutes
              </p>
            </div>

            {/* Overall Stats */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-2">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Overall Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 font-semibold">Total Sessions:</span>
                  <span className="text-sm font-medium">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 font-semibold">Total Focus Time:</span>
                  <span className="text-sm font-medium">{totalFocusHours}h {totalFocusMinutes}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600 font-semibold">Avg Session:</span>
                  <span className="text-sm font-medium">
                    {sessions.length > 0 ? Math.floor(totalFocusTime / sessions.length / 60) : 0} minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Current Session Info */}
            {isRunning && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-2">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">Current Session</h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Task:</strong> {taskName || 'Untitled Task'}
                  </div>
                  <div className="text-sm">
                    <strong>Duration:</strong> {Math.floor(initialTime / 60)} minutes
                  </div>
                  <div className="text-sm">
                    <strong>Status:</strong> 
                    <span className={`ml-1 ${isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
                      {isPaused ? 'Paused' : 'Running'}
                    </span>
                  </div>
                  {checklist.length > 0 && (
                    <div className="text-sm">
                      <strong>Checklist:</strong> {checklist.filter(item => item.checked).length}/{checklist.length} completed
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
