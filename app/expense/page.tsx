'use client';
import React, { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon, ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Expense {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  type: "Need" | "Want";
}

const defaultCategories = ["All", "Uncategorized"];

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([...defaultCategories]);
  const [form, setForm] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    name: "",
    amount: 0,
    category: "Uncategorized",
    type: "Need",
  });
  const [filter, setFilter] = useState<string>("All");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    const storedCats = localStorage.getItem("categories");
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    if (storedCats) {
      const saved = JSON.parse(storedCats);
      setCategories([...defaultCategories, ...saved]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    const custom = categories.filter((c) => !defaultCategories.includes(c));
    localStorage.setItem("categories", JSON.stringify(custom));
  }, [categories]);

  const handleAddOrUpdate = () => {
    if (!form.date || !form.name.trim() || !form.amount || !form.category || !form.type) return;

    const newExpense: Expense = {
      id: editExpense ? editExpense.id : Date.now().toString(),
      date: form.date,
      name: form.name,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
    };
    if (editExpense) {
      setExpenses(expenses.map((e) => (e.id === editExpense.id ? newExpense : e)));
      setEditExpense(null);
    } else {
      setExpenses([newExpense, ...expenses]);
    }
    setForm({
      date: new Date().toISOString().split("T")[0],
      name: "",
      amount: 0,
      category: "Uncategorized",
      type: "Need",
    });
  };

  const handleCancelEdit = () => {
    setEditExpense(null);
    setForm({
      date: new Date().toISOString().split("T")[0],
      name: "",
      amount: 0,
      category: "Uncategorized",
      type: "Need",
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditExpense(expense);
    setForm({ ...expense });
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    if (editExpense && editExpense.id === id) setEditExpense(null);
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    setNewCategory("");
    setIsCategoryModalOpen(false);
  };

  const deleteCategory = (cat: string) => {
    if (defaultCategories.includes(cat)) return;
    setCategories(categories.filter((c) => c !== cat));
    setExpenses((exps) =>
      exps.map((e) =>
        e.category === cat ? { ...e, category: "Uncategorized" } : e
      )
    );
    if (filter === cat) setFilter("All");
    if (form.category === cat) setForm({ ...form, category: "Uncategorized" });
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const grouped = filteredExpenses.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const stats: Record<string, number> = {};
  categories.forEach((c) => {
    stats[c] = c === "All" ? filteredExpenses.length : filteredExpenses.filter((e) => e.category === c).length;
  });

  const sumByPeriod = (days: number): number => {
    const now = new Date("2025-07-26T15:09:00Z"); // Current date and time: 03:09 PM IST, July 26, 2025
    now.setHours(0, 0, 0, 0); // Reset to start of day
    return expenses
      .filter((e) => {
        const expDate = new Date(e.date);
        expDate.setHours(0, 0, 0, 0); // Reset to start of day for comparison
        const diffDays = Math.floor((now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays < days && diffDays >= 0;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="min-h-screen sm:p-6 font-sans flex">
      <div className="max-w-6xl w-full ml-0 space-y-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-indigo-900 text-center">
          Expense Tracker
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-white text-sm font-medium text-indigo-900"
            >
              <span>
                {filter} ({stats[filter] || 0})
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  isFilterDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setFilter(c);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm ${
                      filter === c
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {c} ({stats[c] || 0})
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:flex gap-2 flex-wrap">
            {categories.map((c) => (
              <div key={c} className="relative">
                <button
                  onClick={() => setFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    filter === c
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-indigo-900 border border-gray-300 hover:bg-indigo-50"
                  }`}
                >
                  {c} ({stats[c] || 0})
                </button>
                {!defaultCategories.includes(c) && (
                  <button
                    onClick={() => deleteCategory(c)}
                    className="absolute -right-2 -top-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    title="Delete"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Left Column - Form */}
          <div className="bg-white p-4 h-fit sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-4 col-span-1">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Expense name..."
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <input
              type="number"
              placeholder="₹ Amount"
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) =>
                e.target.value === "add-type"
                  ? setIsCategoryModalOpen(true)
                  : setForm({ ...form, category: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-sm"
            >
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c} ({stats[c] || 0})
                </option>
              ))}
              <option value="add-type">+ Add Category</option>
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "Need" | "Want" })}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="">Need or Want?</option>
              <option value="Need">Need</option>
              <option value="Want">Want</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAddOrUpdate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                {editExpense ? "Update" : "Add"}
              </button>
              {editExpense && (
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Middle Column - Expense Cards (Wider) */}
          <div className="col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
            {Object.entries(grouped).length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                No expenses to show.
              </p>
            )}
            {Object.entries(grouped)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, exps]) => (
                <div
                  key={date}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                  {exps.map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between items-center p-2 rounded bg-white hover:bg-indigo-50 transition"
                    >
                      <div>
                        <p className="font-medium text-indigo-900">{e.name}</p>
                        <p className="text-xs text-gray-500">
                          {e.category} • {e.type}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="font-semibold text-indigo-900">
                          ₹ {e.amount.toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleEdit(e)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-semibold text-indigo-900 mt-2 border-t pt-1">
                    Total: ₹ {exps.reduce((sum, x) => sum + x.amount, 0).toFixed(2)}
                  </div>
                </div>
              ))}
          </div>

          {/* Right Column - Summary (h-fit) */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-2 h-fit col-span-1">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Summary</h3>
            <p className="text-sm">
              <strong>Today:</strong> ₹ {sumByPeriod(1).toFixed(2)}
            </p>
            <p className="text-sm">
              <strong>This Week:</strong> ₹ {sumByPeriod(7).toFixed(2)}
            </p>
            <p className="text-sm">
              <strong>This Month:</strong> ₹ {sumByPeriod(30).toFixed(2)}
            </p>
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
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative"
            >
              <button
                className="absolute top-3 right-3"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                Add New Category
              </h3>
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name..."
                  className="flex-1 p-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={addCategory}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;