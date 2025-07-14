'use client'

import { useEffect, useState } from 'react'

// Types
interface DSARecord {
  title: string
  category: string
}

type DSALog = {
  [date: string]: DSARecord[]
}

const defaultCategories = ['Array', 'String', 'Other']

const getMonthName = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })

export default function DSATracker() {
  const [logs, setLogs] = useState<DSALog>({})
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(defaultCategories[0])
  const [categories, setCategories] = useState<string[]>([...defaultCategories])
  const [newCategory, setNewCategory] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editData, setEditData] = useState<DSARecord>({ title: '', category: defaultCategories[0] })
  const [showDeleteIdx, setShowDeleteIdx] = useState<number | null>(null)
  const [calendarBase, setCalendarBase] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Load logs and categories from localStorage
  useEffect(() => {
    const storedLogs = localStorage.getItem('dsaLogsV2')
    const storedCategories = localStorage.getItem('dsaCategories')
    if (storedLogs) setLogs(JSON.parse(storedLogs))
    if (storedCategories) {
      const stored = JSON.parse(storedCategories)
      setCategories([...new Set([...defaultCategories, ...stored])])
    }
  }, [])

  // Persist logs
  useEffect(() => {
    localStorage.setItem('dsaLogsV2', JSON.stringify(logs))
  }, [logs])

  // Persist custom categories
  useEffect(() => {
    const customCategories = categories.filter(c => !defaultCategories.includes(c))
    localStorage.setItem('dsaCategories', JSON.stringify(customCategories))
  }, [categories])

  // Add new record for today
  const handleSave = () => {
    if (!title.trim()) return
    setLogs(prev => ({
      ...prev,
      [today]: [ ...(prev[today] || []), { title: title.trim(), category } ]
    }))
    setTitle('')
    setCategory(categories[0])
  }

  // Add new category
  const addNewCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
      setCategory(trimmed)
      setNewCategory('')
      setIsCategoryModalOpen(false)
    }
  }

  // Calendar helpers
  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: string[] = []
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      days.push(date.toISOString().split('T')[0])
    }
    return { days, firstDay: firstDay.getDay() }
  }

  // Color intensity for calendar
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-400'
    if (count === 1) return 'bg-green-200 text-green-900'
    if (count === 2) return 'bg-green-400 text-white'
    if (count >= 3) return 'bg-green-600 text-white'
    return 'bg-gray-100 text-gray-400'
  }

  // Show 3 months: prev, current, next
  const monthsToShow = [
    { year: calendarBase.year, month: calendarBase.month - 1 },
    { year: calendarBase.year, month: calendarBase.month },
    { year: calendarBase.year, month: calendarBase.month + 1 },
  ].map(({ year, month }) => {
    let y = year, m = month
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    return { year: y, month: m }
  })

  // Records for selected day
  const selectedRecords = selectedDay ? logs[selectedDay] || [] : []

  // Edit record
  const openEdit = (idx: number) => {
    setEditIdx(idx)
    setEditData(selectedRecords[idx])
  }
  const closeEdit = () => {
    setEditIdx(null)
    setEditData({ title: '', category: categories[0] })
  }
  const saveEdit = () => {
    if (!selectedDay || editIdx === null) return
    setLogs(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((rec, i) => i === editIdx ? { ...editData } : rec)
    }))
    closeEdit()
  }

  // Delete record
  const confirmDelete = (idx: number) => setShowDeleteIdx(idx)
  const doDelete = () => {
    if (!selectedDay || showDeleteIdx === null) return
    setLogs(prev => {
      const arr = prev[selectedDay].slice()
      arr.splice(showDeleteIdx, 1)
      return { ...prev, [selectedDay]: arr }
    })
    setShowDeleteIdx(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-0 w-full">
      <div className="w-full space-y-6 px-0 md:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🧠 DSA Tracker</h2>
          <p className="text-gray-600">Track your daily DSA progress and visualize your journey</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Problem name/title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => {
                  if (e.target.value === 'add-type') {
                    setIsCategoryModalOpen(true)
                  } else {
                    setCategory(e.target.value)
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="add-type">Add Category</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mt-2 md:mt-0"
            >
              Add Record
            </button>
          </div>
        </div>

        {/* Category Modal */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white p-4 rounded-xl shadow-xl w-full max-w-md relative"
            >
              <button
                className="absolute top-3 right-3 text-xl"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                ×
              </button>
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 p-2 border rounded shadow-sm text-sm"
                />
                <button
                  onClick={addNewCategory}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3-Month Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monthsToShow.map(({ year, month }, idx) => {
            const { days, firstDay } = getMonthDays(year, month)
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => idx === 0 && setCalendarBase(b => ({
                      year: b.month === 0 ? b.year - 1 : b.year,
                      month: b.month === 0 ? 11 : b.month - 1
                    }))}
                    className={`p-1 rounded hover:bg-gray-100 transition-colors ${idx !== 0 ? 'invisible' : ''}`}
                  >←</button>
                  <span className="text-sm font-medium text-gray-700">{getMonthName(year, month)}</span>
                  <button
                    onClick={() => idx === 2 && setCalendarBase(b => ({
                      year: b.month === 11 ? b.year + 1 : b.year,
                      month: b.month === 11 ? 0 : b.month + 1
                    }))}
                    className={`p-1 rounded hover:bg-gray-100 transition-colors ${idx !== 2 ? 'invisible' : ''}`}
                  >→</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["S","M","T","W","T","F","S"].map((d, i) => (
                    <div key={d + i} className="text-center text-xs font-medium text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(firstDay)].map((_, i) => <div key={i} className="h-6"></div>)}
                  {days.map(date => {
                    const count = logs[date]?.length || 0
                    const isToday = date === today
                    return (
                      <button
                        key={date}
                        className={`h-6 w-6 rounded flex items-center justify-center text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-400 ${getColor(count)} ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                        title={date}
                        onClick={() => setSelectedDay(date)}
                      >
                        {new Date(date).getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Day Records Modal */}
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedDay(null)}>
            <div onClick={e => e.stopPropagation()} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <button className="absolute top-3 right-3 text-xl" onClick={() => setSelectedDay(null)}>×</button>
              <h3 className="text-lg font-semibold mb-4">Records for {selectedDay}</h3>
              {selectedRecords.length === 0 ? (
                <p className="text-gray-500">No records for this day.</p>
              ) : (
                <ul className="space-y-3">
                  {selectedRecords.map((rec, i) => (
                    <li key={i} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="font-medium text-gray-800">{rec.title}</div>
                        <div className="text-xs text-gray-500">{rec.category}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button onClick={() => openEdit(i)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit">✏️</button>
                        <button onClick={() => confirmDelete(i)} className="text-red-500 hover:text-red-700 p-1" title="Delete">🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div onClick={e => e.stopPropagation()} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <button className="absolute top-3 right-3 text-xl" onClick={closeEdit}>×</button>
              <h3 className="text-lg font-semibold mb-4">Edit Record</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Name *</label>
                <input
                  value={editData.title}
                  onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editData.category}
                  onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <button onClick={closeEdit} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Update</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div onClick={e => e.stopPropagation()} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <button className="absolute top-3 right-3 text-xl" onClick={() => setShowDeleteIdx(null)}>×</button>
              <h3 className="text-lg font-semibold mb-4">Delete Record?</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete this record?</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeleteIdx(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={doDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
