"use client";

import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TaskModalDetails from "./taskModalDetails";
import TaskModalChecklist from "./taskModalChecklist";
import Link from "next/link";

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
        className="w-full max-w-5xl rounded-xl shadow-2xl  ring-1 ring-black/5 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-100 bg-slate-300 ">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {task.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {task.project && (
                <Link
                  href={`project/${task.project}`}
                  className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-900 bg-purple-300"
                >
                  {task.project}
                </Link>
              )}

              <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-900 bg-blue-200">
                {task.category}
              </span>

              <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-900 bg-pink-300">
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
        <div className="grid grid-cols-1 md:grid-cols-10 gap-2  bg-slate-200">
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
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-slate-300">
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
            className="px-3 py-2 rounded-md border text-sm bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
