'use client'

import { useEffect, useState } from 'react'
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

export default function TaskCardsOnly() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<string[]>([...defaultCategories])

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    const savedCategories = localStorage.getItem('categories')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedCategories) {
      const stored = JSON.parse(savedCategories)
      setCategories([...new Set([...defaultCategories, ...stored])])
    }
  }, [])

  const toggleStatus = (id: number) => {
    const next = { todo: 'inprogress', inprogress: 'done', done: 'todo' }
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, status: next[t.status] as Task['status'] } : t
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(t => t.id !== id)
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const saveEdit = (id: number, title: string, category: string, dueDate: string) => {
    const updatedTasks = tasks.map(t =>
      t.id === id
        ? { ...t, title, category, dueDate: dueDate || undefined }
        : t
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const addChecklistItem = (taskId: number, text: string) => {
    const updatedTasks = tasks.map(t =>
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
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const toggleChecklistItem = (taskId: number, itemId: number) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            checklist: (t.checklist || []).map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          }
        : t
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const deleteChecklistItem = (taskId: number, itemId: number) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            checklist: (t.checklist || []).filter(item => item.id !== itemId),
          }
        : t
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? tasks.length : tasks.filter(t => t.category === cat).length
    return acc
  }, {} as Record<string, number>)

  // Filter out completed tasks and sort by due date
  const activeTasks = tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => {
      // If both have due dates, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      // If only one has due date, prioritize the one with due date
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1
      // If neither has due date, sort by creation time (newest first)
      return b.id - a.id
    })
    .slice(0, 5) // Show only the first 5 tasks

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Recent Tasks</h3>
        <span className="text-sm text-gray-500">{tasks.length} total tasks</span>
      </div>
      
      {activeTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No active tasks. All tasks completed! 🎉</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {activeTasks.map((task: Task) => (
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
      )}
      
      {tasks.filter(task => task.status !== 'done').length > 5 && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Showing 5 of {tasks.filter(task => task.status !== 'done').length} active tasks
          </p>
        </div>
      )}
    </div>
  )
} 