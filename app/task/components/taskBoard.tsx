// pages/index.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Squares2X2Icon,
  Bars3Icon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import TaskCard from "./taskCard";
import { CalendarDaysIcon, ChevronDownIcon } from "lucide-react";

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
  priority?: "low" | "medium" | "high";
  checklist?: ChecklistItem[];
};

const defaultCategories = ["All", "Personal", "Uncategorized"];
const dummyProjects = ["Inbox Project", "Website", "Marketing", "Personal"];

export default function TaskBoard() {
  // tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  // new task fields (moved to right sidebar)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [project, setProject] = useState(dummyProjects[0]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [showChecklistInput, setShowChecklistInput] = useState(false);
  const [newChecklistItemText, setNewChecklistItemText] = useState("");
  const [newChecklist, setNewChecklist] = useState<ChecklistItem[]>([]);

  // UI state
  const [isGrid, setIsGrid] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    ...defaultCategories,
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedCategories = localStorage.getItem("taskCategories");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCategories) {
      const stored = JSON.parse(savedCategories);
      setCategories([...new Set([...defaultCategories, ...stored])]);
    }
  }, []);

  const isInitialSave = useRef(true);
  useEffect(() => {
    if (isInitialSave.current) {
      isInitialSave.current = false;
      return;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const customCategories = categories.filter(
      (c) => !defaultCategories.includes(c)
    );
    localStorage.setItem("taskCategories", JSON.stringify(customCategories));
  }, [categories]);

  // --- task CRUD helpers ---
  const addTask = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      project,
      status: "todo",
      dueDate: dueDate || undefined,
      priority: priority || "medium",
      checklist: newChecklist.length ? newChecklist : undefined,
    };
    setTasks((prev) => [task, ...prev]);
    // reset right panel
    setTitle("");
    setDescription("");
    setCategory("Uncategorized");
    setProject(dummyProjects[0]);
    setDueDate("");
    setPriority("medium");
    setShowChecklistInput(false);
    setNewChecklist([]);
    setNewChecklistItemText("");
  };

  const toggleStatus = (id: number) => {
    const next = { todo: "inprogress", inprogress: "done", done: "todo" };
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status: next[t.status] as Task["status"] } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const saveEdit = (
    id: number,
    title: string,
    category: string,
    dueDate: string
  ) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, title, category, dueDate: dueDate || undefined }
          : t
      )
    );
  };

  const addChecklistItemToTask = (taskId: number, text: string) => {
    setTasks((tasks) =>
      tasks.map((t) =>
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
    );
  };

  const toggleChecklistItem = (taskId: number, itemId: number) => {
    setTasks((tasks) =>
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: (t.checklist || []).map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : t
      )
    );
  };

  const deleteChecklistItem = (taskId: number, itemId: number) => {
    setTasks((tasks) =>
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: (t.checklist || []).filter(
                (item) => item.id !== itemId
              ),
            }
          : t
      )
    );
  };

  // --- categories management ---
  const addNewCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
      setIsCategoryModalOpen(false);
    }
  };

  const deleteCategory = (cat: string) => {
    if (defaultCategories.includes(cat)) return;
    setCategories(categories.filter((c) => c !== cat));
    setTasks(
      tasks.map((t) =>
        t.category === cat ? { ...t, category: "Uncategorized" } : t
      )
    );
    if (filter === cat) setFilter("All");
    if (category === cat) setCategory("Uncategorized");
  };

  // --- new-task checklist handlers ---
  const addNewChecklistItemLocal = () => {
    const txt = newChecklistItemText.trim();
    if (!txt) return;
    setNewChecklist((prev) => [
      ...prev,
      { id: Date.now(), text: txt, checked: false },
    ]);
    setNewChecklistItemText("");
  };

  const removeNewChecklistItemLocal = (id: number) => {
    setNewChecklist((prev) => prev.filter((i) => i.id !== id));
  };

  // counts & filters
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] =
      cat === "All"
        ? tasks.length
        : tasks.filter((t) => t.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = tasks.filter(
    (task) => filter === "All" || task.category === filter
  );

  const completedToday = tasks.filter(
    (t) =>
      t.status === "done" &&
      new Date(t.id).toDateString() === new Date().toDateString()
  ).length;

  return (
    // shift entire content to the right by 260px on md+ so it sits next to your primary sidebar
    <div className="min-h-screen font-sans p-4 sm:p-6">
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          {/* layout: left (flex-1) | right (30%) on md+; stacked on small */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* LEFT: task list (fills remaining space) */}
            <div className="w-full flex-1">
              {/* Filters + view row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3">
                {/* Desktop Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <div key={cat} className="relative flex items-center">
                      <button
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                          filter === cat
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-white text-gray-600 border"
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

                {/* View Mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsGrid(true)}
                    className={`p-2 rounded-lg border ${
                      isGrid
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-white text-gray-400"
                    }`}
                    title="Grid View"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsGrid(false)}
                    className={`p-2 rounded-lg border ${
                      !isGrid
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-white text-gray-400"
                    }`}
                    title="List View"
                  >
                    <Bars3Icon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <p className="text-gray-500 text-xs sm:text-sm mb-3">
                ✅ Completed Today: {completedToday} / {tasks.length}
              </p>

              {/* Tasks grid/list */}
              <ul
                className={`grid gap-3 sm:gap-4 ${
                  isGrid
                    ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    categories={categories}
                    categoryCounts={categoryCounts}
                    toggleStatus={toggleStatus}
                    deleteTask={deleteTask}
                    saveEdit={saveEdit}
                    addChecklistItem={addChecklistItemToTask}
                    toggleChecklistItem={toggleChecklistItem}
                    deleteChecklistItem={deleteChecklistItem}
                  />
                ))}
              </ul>

              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm sm:text-base mt-6">
                  No tasks available.
                </p>
              )}
            </div>

            {/* RIGHT: create task sidebar (30% of content area on md+) */}
            <aside className="w-full md:w-[30%]">
              <div className="sticky top-6 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-slate-800">
                  Create Task
                </h2>

                {/* Title */}
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full p-3 rounded-md bg-slate-100 border border-transparent focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 mb-4"
                />

                {/* Description */}
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  className="w-full p-3 rounded-md bg-slate-100 border border-transparent focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 mb-4 resize-y"
                  rows={3}
                />

                {/* Category + Project (two-column compact) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === "add-type") {
                            setIsCategoryModalOpen(true);
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        className="appearance-none w-full p-2.5 rounded-md bg-white/60 border border-gray-100 text-sm text-slate-800 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        aria-label="Category"
                      >
                        {categories
                          .filter((c) => c !== "All")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        <option value="add-type">+ Add</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                        <ChevronDownIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Project
                    </label>
                    <div className="relative">
                      <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="appearance-none w-full p-2.5 rounded-md bg-white/60 border border-gray-100 text-sm text-slate-800 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        aria-label="Project"
                      >
                        {dummyProjects.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
                        <ChevronDownIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* End date (styled input with calendar icon) */}
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  End date
                </label>
                <div className="relative mb-4">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 rounded-md bg-slate-50 border border-transparent text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 pr-10"
                    aria-label="End date"
                  />
                </div>

                {/* Priority chips */}
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Priority
                </label>
                <div className="flex gap-2 mb-4 text-sm">
                  <button
                    type="button"
                    onClick={() => setPriority("low")}
                    className={`flex-1 text-sm py-2 rounded-lg border transition ${
                      priority === "low"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm"
                        : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Low
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("medium")}
                    className={`flex-1 text-sm py-2 rounded-lg border transition ${
                      priority === "medium"
                        ? "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
                        : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority("high")}
                    className={`flex-1 text-sm py-2 rounded-lg border transition ${
                      priority === "high"
                        ? "bg-rose-50 border-rose-200 text-rose-800 shadow-sm"
                        : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    High
                  </button>
                </div>

                {/* Checklist toggle */}
                <div className="flex items-center gap-3 mb-3">
                  <input
                    id="checklistToggle"
                    type="checkbox"
                    checked={showChecklistInput}
                    onChange={(e) => setShowChecklistInput(e.target.checked)}
                    className="h-4 w-4 rounded-sm text-indigo-600 border-gray-200"
                  />
                  <label
                    htmlFor="checklistToggle"
                    className="text-sm text-slate-700"
                  >
                    Add checklist / subtasks
                  </label>
                </div>

                {/* checklist area */}
                {showChecklistInput && (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        value={newChecklistItemText}
                        onChange={(e) =>
                          setNewChecklistItemText(e.target.value)
                        }
                        placeholder="New subtask..."
                        className="flex-1 p-2.5 rounded-md bg-slate-50 border border-gray-100 text-sm text-slate-800"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewChecklistItemLocal();
                          }
                        }}
                      />
                      <button
                        onClick={addNewChecklistItemLocal}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                        aria-label="Add checklist item"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {newChecklist.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between text-sm bg-white/60 border border-gray-100 p-2 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              readOnly
                              className="h-4 w-4"
                            />
                            <span className="text-slate-800">{item.text}</span>
                          </div>
                          <button
                            onClick={() => removeNewChecklistItemLocal(item.id)}
                            className="text-xs text-rose-500"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={addTask}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-medium shadow-md hover:from-indigo-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5"
                  >
                    Add Task
                  </button>

                  <button
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setCategory("Uncategorized");
                      setProject(dummyProjects[0]);
                      setDueDate("");
                      setPriority("medium");
                      setShowChecklistInput(false);
                      setNewChecklist([]);
                      setNewChecklistItemText("");
                    }}
                    className="py-2.5 px-3 rounded-lg border border-gray-100 bg-white text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
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
                onChange={(e) => setNewCategory(e.target.value)}
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
    </div>
  );
}
