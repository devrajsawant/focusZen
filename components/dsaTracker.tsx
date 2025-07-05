'use client'

import { useEffect, useState } from 'react'

type DSALog = {
  [date: string]: string // e.g., "2025-07-04": "Solved 3 Array problems"
}

export default function DSATracker() {
  const [logs, setLogs] = useState<DSALog>({})
  const [input, setInput] = useState('')
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const stored = localStorage.getItem('dsaLogs')
    if (stored) setLogs(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('dsaLogs', JSON.stringify(logs))
  }, [logs])

  const handleSave = () => {
    if (!input.trim()) return
    setLogs(prev => ({ ...prev, [today]: input.trim() }))
    setInput('')
  }

  const getPast30Days = () => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold">🧠 DSA Tracker</h2>

      {/* Daily Log Input */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">What did you study today?</p>
        <textarea
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Solved Linked List problems, revised recursion..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
        >
          Save Log
        </button>
      </div>

      {/* Today’s Log */}
      {logs[today] && (
        <div className="text-sm text-gray-700">
          <strong>Today’s Log:</strong> {logs[today]}
        </div>
      )}

      {/* Streak Calendar */}
      <div>
        <h3 className="text-sm font-medium mb-2">📅 Last 30 Days</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {getPast30Days().map(date => (
            <div
              key={date}
              className={`h-6 rounded ${
                logs[date] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
              title={date}
            >
              {new Date(date).getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
