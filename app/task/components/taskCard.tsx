// components/TaskCard.tsx
"use client";

import { useEffect, useState } from "react";
import TaskTags from "./taskCardComponents/taskTags";
import TaskHeader from "./taskCardComponents/taskHeader";
import TaskFooter from "./taskCardComponents/taskFooter";
import TaskModal from "./taskCardComponents/taskModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [checklistInput, setChecklistInput] = useState("");
  const [isClient, setIsClient] = useState(false);

  // ensure document is available for portal (used by TaskModal internally)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // start editing (prefill)
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
      stripe: "bg-green-200",
      bg: "bg-green-50/60",
      border: "border-green-100",
      pill: "text-green-700 bg-green-50",
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
        return "text-red-700 bg-red-100 border-2 border-red-400";
      case "medium":
        return "text-amber-800 bg-amber-100  border-2 border-amber-400";
      case "low":
        return "text-green-700 bg-green-50  border-2 border-green-400";
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
      className={`relative flex flex-col rounded-xl p-0 shadow-sm transition-transform hover:translate-y-0.5`}
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
        <TaskTags
          task={task as any}
          formatDate={formatDate as any}
          priorityPill={priorityPill as any}
          statusBadge={statusBadge as any}
        />

        {/* Header row: title + actions (header component handles edit input when editId === task.id) */}
        <TaskHeader
          task={task as any}
          editId={editId as any}
          editTitle={editTitle as any}
          setEditTitle={(v: string) => setEditTitle(v)}
          handleSaveEdit={handleSaveEdit as any}
          startEdit={startEdit as any}
          toggleStatus={toggleStatus as any}
          deleteTask={deleteTask as any}
          setModalOpen={(v: boolean) => setModalOpen(v)}
        />

        {/* Footer: checklist progress and meta */}
        <TaskFooter
          totalCount={totalCount as any}
          completedCount={completedCount as any}
          percent={percent as any}
          isCompleted={isCompleted as any}
          isDueToday={isDueToday as any}
        />
      </div>

      {/* Modal (portal-mounted inside TaskModal) */}
      <TaskModal
        isOpen={modalOpen as any}
        close={() => setModalOpen(false)}
        task={task as any}
        checklistInput={checklistInput as any}
        setChecklistInput={(v: string) => setChecklistInput(v)}
        handleAddChecklistItem={handleAddChecklistItem as any}
        toggleChecklistItem={toggleChecklistItem as any}
        deleteChecklistItem={deleteChecklistItem as any}
        completedCount={completedCount as any}
        totalCount={totalCount as any}
        percent={percent as any}
        priorityPill={priorityPill as any}
        statusBadge={statusBadge as any}
        formatDate={formatDate as any}
        startEdit={startEdit as any}
        deleteTask={deleteTask as any}
      />
    </li>
  );
}
