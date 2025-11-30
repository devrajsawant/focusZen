// components/taskCardComponents/taskHeader.tsx
import React from "react";
import {
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type Task = {
  id: number;
  title: string;
  description?: string;
  category: string;
  project?: string;
  status: "todo" | "inprogress" | "done";
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "none";
  checklist?: { id: number; text: string; checked: boolean }[];
};

type Props = {
  task: Task;
  editId?: number | null;
  editTitle?: string;
  setEditTitle?: (v: string) => void;
  handleSaveEdit?: () => void;
  startEdit?: () => void;
  toggleStatus: (id: number) => void;
  deleteTask: (id: number) => void;
  setModalOpen: (v: boolean) => void;
  onEdit?: (task: Task) => void; // optional handler provided by parent
};

export default function TaskHeader(prop: Props) {
  const {
    task,
    editId,
    editTitle,
    setEditTitle,
    handleSaveEdit,
    startEdit,
    toggleStatus,
    deleteTask,
    setModalOpen,
    onEdit,
  } = prop;

  const handleEditClick = () => {
    if (typeof onEdit === "function") {
      onEdit(task);
    } else if (typeof startEdit === "function") {
      startEdit();
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        {editId === task.id ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle && setEditTitle(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSaveEdit && handleSaveEdit()
            }
            autoFocus
            className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50"
          />
        ) : (
          <>
            <h3
              className={`text-lg md:text-xl font-semibold text-gray-900 truncate ${
                task.status === "done" ? "line-through text-gray-400" : ""
              }`}
              onClick={() => setModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {task.description}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex items-start gap-2 shrink-0">
        <button
          onClick={() => toggleStatus(task.id)}
          className="p-1 hover:bg-gray-100"
        >
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        </button>

        <button onClick={handleEditClick} className="p-1 hover:bg-gray-100">
          <PencilIcon className="h-5 w-5 text-gray-500" />
        </button>

        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 hover:bg-gray-100"
        >
          <TrashIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
