"use client";

import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TaskModalDetails from "./taskModalDetails";
import TaskModalChecklist from "./taskModalChecklist";

export default function TaskModal(prop: any) {
  const {
    isOpen,
    close,
    task,
    completedCount,
    totalCount,
    percent,
    checklistInput,
    setChecklistInput,
    handleAddChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    priorityPill,
    statusBadge,
    formatDate,
    startEdit,
    deleteTask,
  } = prop;

  if (typeof window === "undefined") return null;
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-xl shadow-2xl bg-white ring-1 ring-black/5 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {task.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                {task.category}
              </span>

              {task.project && (
                <a
                  href={`project/${task.project}`}
                  className="px-2 py-1 rounded-md text-indigo-700 bg-indigo-50"
                >
                  {task.project}
                </a>
              )}

              <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-600">
                {task.dueDate ? formatDate(task.dueDate) : "No due date"}
              </span>

              <span
                className={`px-2 py-1 rounded-md font-medium ${priorityPill(
                  task.priority
                )}`}
              >
                {task.priority
                  ? task.priority[0].toUpperCase() + task.priority.slice(1)
                  : "None"}
              </span>

              <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-700">
                {statusBadge(task.status)}
              </span>
            </div>
          </div>

          <button
            onClick={close}
            aria-label="Close"
            className="ml-auto p-2 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body with 30/70 ratio: left = desc, right = checklist */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 p-6">
          <div className="md:col-span-3">
            <TaskModalDetails
              task={task}
              formatDate={formatDate}
              priorityPill={priorityPill}
              statusBadge={statusBadge}
              /* removed startEdit/deleteTask from details as requested */
            />
          </div>

          <div className="md:col-span-7">
            <TaskModalChecklist
              task={task}
              checklistInput={checklistInput}
              setChecklistInput={setChecklistInput}
              handleAddChecklistItem={handleAddChecklistItem}
              toggleChecklistItem={toggleChecklistItem}
              deleteChecklistItem={deleteChecklistItem}
              completedCount={completedCount}
              totalCount={totalCount}
              percent={percent}
            />
          </div>
        </div>

        {/* Footer: actions only */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => {
              startEdit();
              close();
            }}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Edit task
          </button>

          <button
            onClick={() => deleteTask(task.id)}
            className="px-3 py-2 rounded-md border text-sm"
          >
            Delete
          </button>

          <button
            onClick={close}
            className="px-3 py-2 rounded-md bg-white border text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
