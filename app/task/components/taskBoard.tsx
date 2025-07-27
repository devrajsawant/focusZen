// pages/index.tsx (or your main component file)
'use client'

import { useEffect, useState } from 'react'
import {
  Squares2X2Icon,
  Bars3Icon,
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import TaskCard from './taskCard'

type ChecklistItem = {
  id: number
  text: string
  checked: boolean
}

type Task = {
  id: number
  title: string
  category: string
  status: 'todo' | 'inprogress' | 'done'
  dueDate?: string
  checklist?: ChecklistItem[]
}

const defaultCategories = ['All', 'Personal', 'Uncategorized']

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [filter, setFilter] = useState('All')
  const [dueDate, setDueDate] = useState('')
  const [isGrid, setIsGrid] = useState(true)
  const [categories, setCategories] = useState<string[]>([...defaultCategories])
  const [newCategory, setNewCategory] = useState('')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    const savedCategories = localStorage.getItem('taskCategories')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedCategories) {
      const stored = JSON.parse(savedCategories)
      setCategories([...new Set([...defaultCategories, ...stored])])
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    const customCategories = categories.filter(c => !defaultCategories.includes(c))
    localStorage.setItem('taskCategories', JSON.stringify(customCategories))
  }, [categories])

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now(),
      title: newTask,
      category,
      status: 'todo',
      dueDate: dueDate || undefined,
    }
    setTasks([task, ...tasks])
    setNewTask('')
    setDueDate('')
  }

  const toggleStatus = (id: number) => {
    const next = { todo: 'inprogress', inprogress: 'done', done: 'todo' }
    setTasks(tasks.map(t => (t.id === id ? { ...t, status: next[t.status] as Task['status'] } : t)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const saveEdit = (id: number, title: string, category: string, dueDate: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, title, category, dueDate: dueDate || undefined }
        : t
    ))
  }

  const addChecklistItem = (taskId: number, text: string) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              checklist: [
                ...(t.checklist || []),
                { id: Date.now(), text, checked: false },
              ],
            }
          : t
      )
    )
  }

  const toggleChecklistItem = (taskId: number, itemId: number) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              checklist: (t.checklist || []).map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : t
      )
    )
  }

  const deleteChecklistItem = (taskId: number, itemId: number) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              checklist: (t.checklist || []).filter(item => item.id !== itemId),
            }
          : t
      )
    )
  }

  const addNewCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
      setNewCategory('')
      setIsCategoryModalOpen(false)
    }
  }

  const deleteCategory = (cat: string) => {
    if (defaultCategories.includes(cat)) return
    setCategories(categories.filter(c => c !== cat))
    setTasks(tasks.map(t => (t.category === cat ? { ...t, category: 'Uncategorized' } : t)))
    if (filter === cat) setFilter('All')
    if (category === cat) setCategory('Uncategorized')
  }

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? tasks.length : tasks.filter(t => t.category === cat).length
    return acc
  }, {} as Record<string, number>)

  const filtered = tasks.filter(task => filter === 'All' || task.category === filter)

  const completedToday = tasks.filter(
    t => t.status === 'done' &&
      new Date(t.id).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">📋 Task Manager</h1>

        {/* Inputs */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="New task..."
            className="w-full sm:flex-1 p-3 sm:p-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm sm:text-base"
          />
          <select
            value={category}
            onChange={e => {
              if (e.target.value === 'add-type') {
                setIsCategoryModalOpen(true)
              } else {
                setCategory(e.target.value)
              }
            }}
            className="w-full sm:w-auto p-3 sm:p-2 rounded-lg border border-gray-300 shadow-sm bg-white text-sm sm:text-base"
          >
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>
                {cat} ({categoryCounts[cat] || 0})
              </option>
            ))}
            <option value="add-type">Add Type</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full sm:w-auto p-3 sm:p-2 rounded-lg border border-gray-300 shadow-sm bg-white text-sm sm:text-base"
          />
          <button
            onClick={addTask}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 sm:py-2 rounded-lg text-sm sm:text-base font-medium"
          >
            Add Task
          </button>
        </div>

        {/* Category Modal */}
        {isCategoryModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md relative"
            >
              <button
                className="absolute top-3 right-3"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 p-2 border rounded shadow-sm text-sm sm:text-base"
                />
                <button
                  onClick={addNewCategory}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters + View Mode */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Mobile Filter Dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-white text-sm font-medium"
            >
              <span>{filter} ({categoryCounts[filter] || 0})</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat)
                      setIsFilterDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm ${
                      filter === cat ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {cat} ({categoryCounts[cat] || 0})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Filter Tabs */}
          <div className="hidden sm:flex gap-2 flex-wrap">
            {categories.map(cat => (
              <div key={cat} className="relative flex items-center">
                <button
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    filter === cat
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white text-gray-600 border'
                  }`}
                >
                  {cat} ({categoryCounts[cat] || 0})
                </button>
                {!defaultCategories.includes(cat) && (
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="absolute -right-2 -top-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    title="Delete Tab"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* View Mode - Only show on desktop */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => setIsGrid(true)}
              className={`p-2 rounded-lg border ${
                isGrid ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-400'
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsGrid(false)}
              className={`p-2 rounded-lg border ${
                !isGrid ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-400'
              }`}
              title="List View"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <p className="text-gray-500 text-xs sm:text-sm text-center">
          ✅ Completed Today: {completedToday} / {tasks.length}
        </p>

        {/* Tasks */}
        <ul
          className={`grid gap-3 sm:gap-4 ${
            isGrid 
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              categories={categories}
              categoryCounts={categoryCounts}
              toggleStatus={toggleStatus}
              deleteTask={deleteTask}
              saveEdit={saveEdit}
              addChecklistItem={addChecklistItem}
              toggleChecklistItem={toggleChecklistItem}
              deleteChecklistItem={deleteChecklistItem}
            />
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm sm:text-base">No tasks available.</p>
        )}
      </div>
    </div>
  )
}