// components/TaskCard.tsx
'use client'

import { useState } from 'react'
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

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

type TaskCardProps = {
  task: Task
  categories: string[]
  categoryCounts: Record<string, number>
  toggleStatus: (id: number) => void
  deleteTask: (id: number) => void
  saveEdit: (id: number, title: string, category: string, dueDate: string) => void
  addChecklistItem: (taskId: number, text: string) => void
  toggleChecklistItem: (taskId: number, itemId: number) => void
  deleteChecklistItem: (taskId: number, itemId: number) => void
}

export default function TaskCard({
  task,
  categories,
  categoryCounts,
  toggleStatus,
  deleteTask,
  saveEdit,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
}: TaskCardProps) {
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editCategory, setEditCategory] = useState(task.category)
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '')
  const [modalTaskId, setModalTaskId] = useState<number | null>(null)
  const [checklistInput, setChecklistInput] = useState('')

  const startEdit = () => {
    setEditId(task.id)
    setEditTitle(task.title)
    setEditCategory(task.category)
    setEditDueDate(task.dueDate || '')
  }

  const handleSaveEdit = () => {
    saveEdit(task.id, editTitle, editCategory, editDueDate)
    setEditId(null)
  }

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return
    addChecklistItem(task.id, checklistInput)
    setChecklistInput('')
  }

  const completedCount = task.checklist?.filter(c => c.checked).length || 0
  const totalCount = task.checklist?.length || 0
  const isCompleted = task.status === 'done'

  return (
    <li
      className={`${
        isCompleted ? 'bg-green-300' : 'bg-white'
      } border border-gray-200 rounded-xl p-4 hover:shadow transition cursor-pointer`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          {editId === task.id ? (
            <div className="space-y-2">
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                autoFocus
                className="w-full p-2 border rounded-lg shadow-sm"
                placeholder="Task title..."
              />
              <select
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 shadow-sm bg-white"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryCounts[cat] || 0})
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 shadow-sm bg-white"
              />
              <button
                onClick={handleSaveEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <h3
                className="text-lg font-semibold text-gray-800"
                onClick={() => setModalTaskId(task.id)}
              >
                {task.title}
              </h3>
              <p className="text-sm text-gray-500">
                {task.category} • {task.status} •{' '}
                {task.dueDate && `📅 ${ task.dueDate}`}
              </p>
              {totalCount > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => toggleStatus(task.id)} title="Toggle Status">
            <ArrowPathIcon className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
          </button>
          <button onClick={startEdit} title="Edit">
            <PencilIcon className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
          </button>
          <button onClick={() => deleteTask(task.id)} title="Delete">
            <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Checklist Modal */}
      {modalTaskId === task.id && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModalTaskId(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative"
          >
            <button
              className="absolute top-3 right-3"
              onClick={() => setModalTaskId(null)}
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold mb-2">{task.title} - Checklist</h3>
            <div className="flex mb-4 gap-2">
              <input
                value={checklistInput}
                onChange={e => setChecklistInput(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 p-2 border rounded shadow-sm"
              />
              <button
                onClick={handleAddChecklistItem}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {(task.checklist || []).length === 0 ? (
                <p className="text-gray-400 text-sm">No checklist items.</p>
              ) : (
                task.checklist!.map(item => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <label className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(task.id, item.id)}
                        className="accent-indigo-500"
                      />
                      <span className={`${item.checked ? 'line-through text-gray-400' : ''}`}>
                        {item.text}
                      </span>
                    </label>
                    <button onClick={() => deleteChecklistItem(task.id, item.id)}>
                      <TrashIcon className="h-4 w-4 text-gray-300 hover:text-red-400" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}