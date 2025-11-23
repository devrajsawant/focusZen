// components/TaskCard.tsx
"use client";

import { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
};

type Task = {
  id: number;
  title: string;
  description?: string;
  category: string;
  project?: string;
  status: "todo" | "inprogress" | "done";
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "none";
  checklist?: ChecklistItem[];
};

type TaskCardProps = {
  task: Task;
  categories: string[];
  categoryCounts: Record<string, number>;
  toggleStatus: (id: number) => void;
  deleteTask: (id: number) => void;
  saveEdit: (
    id: number,
    title: string,
    category: string,
    dueDate: string,
    project?: string,
    priority?: string,
    description?: string
  ) => void;
  addChecklistItem: (taskId: number, text: string) => void;
  toggleChecklistItem: (taskId: number, itemId: number) => void;
  deleteChecklistItem: (taskId: number, itemId: number) => void;
};

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
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
  const [editProject, setEditProject] = useState(task.project || "");
  const [editPriority, setEditPriority] = useState<
    "none" | "low" | "medium" | "high"
  >(task.priority || "none");
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [modalTaskId, setModalTaskId] = useState<number | null>(null);
  const [checklistInput, setChecklistInput] = useState("");

  // helpers
  const startEdit = () => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate || "");
    setEditProject(task.project || "");
    setEditPriority(task.priority || "none");
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = () => {
    saveEdit(
      task.id,
      editTitle,
      editCategory,
      editDueDate,
      editProject,
      editPriority,
      editDescription
    );
    setEditId(null);
  };

  const handleAddChecklistItem = () => {
    if (!checklistInput.trim()) return;
    addChecklistItem(task.id, checklistInput.trim());
    setChecklistInput("");
  };

  const completedCount = task.checklist?.filter((c) => c.checked).length || 0;
  const totalCount = task.checklist?.length || 0;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = task.status === "done";
  const isDueToday =
    task.dueDate &&
    new Date(task.dueDate).toDateString() === new Date().toDateString();

  const formatDate = (d?: string) => {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  // subdued matte palette per priority
  const priorityStyles = {
    none: {
      stripe: "bg-gray-200",
      bg: "bg-white/96",
      border: "border-gray-200",
      pill: "text-gray-700 bg-gray-100",
    },
    low: {
      stripe: "bg-indigo-200",
      bg: "bg-indigo-50/60",
      border: "border-indigo-100",
      pill: "text-indigo-700 bg-indigo-50",
    },
    medium: {
      stripe: "bg-amber-200",
      bg: "bg-amber-50/60",
      border: "border-amber-100",
      pill: "text-amber-800 bg-amber-100",
    },
    high: {
      stripe: "bg-red-200",
      bg: "bg-red-50/60",
      border: "border-red-100",
      pill: "text-red-700 bg-red-100",
    },
  } as const;

  const p = priorityStyles[task.priority || "none"];

  const priorityPill = (pVal?: string) => {
    switch (pVal) {
      case "high":
        return "text-red-700 bg-red-100";
      case "medium":
        return "text-amber-800 bg-amber-100";
      case "low":
        return "text-indigo-700 bg-indigo-50";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const statusBadge = (s: Task["status"]) => {
    if (s === "done") return "Done";
    if (s === "inprogress") return "In Progress";
    return "To do";
  };

  return (
    <li
      className={`relative flex flex-col rounded-xl p-0 overflow-hidden shadow-sm transition-transform hover:translate-y-0.5`}
      role="listitem"
    >
      {/* colored left stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${p.stripe}`}
        aria-hidden
      />

      <div
        className={`ml-1 p-4 rounded-r-xl border ${p.border} ${p.bg}`}
        style={{ minHeight: 120 }}
      >
        {/* Tags above */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {task.project && (
            <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-gray-100">
              {task.project}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-gray-100">
            {task.category}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-gray-50">
            {statusBadge(task.status)}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-semibold ${priorityPill(
              task.priority
            )}`}
          >
            {task.priority
              ? task.priority[0].toUpperCase() + task.priority.slice(1)
              : "None"}
          </span>
          {task.dueDate && (
            <span className="ml-auto text-xs text-gray-500">
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Header row: title + actions */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {editId === task.id ? (
              <div className="space-y-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  autoFocus
                  className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
                  placeholder="Task title..."
                />
                {/* keep the rest of edit UI (omitted for brevity) */}
              </div>
            ) : (
              <>
                <h3
                  className={`text-lg md:text-xl font-semibold text-gray-900 truncate ${
                    isCompleted ? "line-through text-gray-400" : ""
                  }`}
                  onClick={() => setModalTaskId(task.id)}
                  style={{ cursor: "pointer" }}
                >
                  {task.title}
                </h3>

                {/* single-line truncated description */}
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {task.description}
                  </p>
                )}
              </>
            )}
          </div>

          <div
            className="flex items-start gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleStatus(task.id)}
              title="Toggle Status"
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={startEdit}
              title="Edit"
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <PencilIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              title="Delete"
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <TrashIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Footer: checklist progress and meta */}
        <div className="mt-4 flex items-center gap-4 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-700">
                    Checklist
                  </div>
                  <div className="text-sm text-gray-500">
                    {percent}% • {completedCount}/{totalCount}
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: "rgba(79, 70, 229, 0.9)", // indigo-600-ish
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="whitespace-nowrap text-xs text-gray-500">
            {isCompleted ? "Completed" : isDueToday ? "Due Today" : ""}
          </div>
        </div>
      </div>

      {/* Two-panel Modal: left = details, right = checklist */}
      {modalTaskId === task.id && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalTaskId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg w-[100%] max-w-4xl p-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              <button
                className="p-1"
                onClick={() => setModalTaskId(null)}
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: Details */}
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {task.description ? (
                    <p>{task.description}</p>
                  ) : (
                    <p className="text-gray-400">No description provided.</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div>
                    <span className="text-xs text-gray-500">Project</span>
                    <div className="mt-1 text-sm text-gray-800">
                      {task.project || "—"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Category</span>
                    <div className="mt-1 text-sm text-gray-800">
                      {task.category}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Status</span>
                    <div className="mt-1 text-sm text-gray-800">
                      {statusBadge(task.status)}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Due</span>
                    <div className="mt-1 text-sm text-gray-800">
                      {task.dueDate ? formatDate(task.dueDate) : "—"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Priority</span>
                    <div
                      className={`mt-1 inline-block px-2 py-1 text-sm rounded ${priorityPill(
                        task.priority
                      )}`}
                    >
                      {task.priority
                        ? task.priority[0].toUpperCase() +
                          task.priority.slice(1)
                        : "None"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={startEdit}
                    className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-2 rounded-md border text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* RIGHT: Checklist */}
              <div>
                <div className="mt-0">
                  <div className="flex gap-2">
                    <input
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      placeholder="Add checklist item..."
                      className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddChecklistItem()
                      }
                    />
                    <button
                      onClick={handleAddChecklistItem}
                      className="px-3 py-2 rounded-md bg-indigo-600 text-white"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <ul className="mt-4 space-y-3 max-h-[52vh] overflow-y-auto">
                    {(task.checklist || []).length === 0 ? (
                      <li className="text-sm text-gray-400">
                        No checklist items.
                      </li>
                    ) : (
                      task.checklist!.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <label className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() =>
                                toggleChecklistItem(task.id, item.id)
                              }
                              className="accent-indigo-500"
                            />
                            <span
                              className={`text-sm ${
                                item.checked
                                  ? "line-through text-gray-400"
                                  : "text-gray-700"
                              } truncate`}
                            >
                              {item.text}
                            </span>
                          </label>
                          <button
                            onClick={() =>
                              deleteChecklistItem(task.id, item.id)
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <TrashIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>

                  <div className="mt-4 text-xs text-gray-500">
                    {completedCount}/{totalCount} completed — {percent}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-md border"
                onClick={() => setModalTaskId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
