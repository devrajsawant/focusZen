"use client";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import CreateExpenseForm from "./components/createExpenseForm";
import ExpenseCard from "./components/expenseCard";

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
  const [categories, setCategories] = useState<string[]>([
    ...defaultCategories,
  ]);
  const [form, setForm] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    name: "",
    amount: 0,
    category: "Uncategorized",
    type: "Need",
  });

  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isTypeFilterDropdownOpen, setIsTypeFilterDropdownOpen] =
    useState(false);

  /* 🔹 MOBILE UI */
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  /* ---------- STORAGE ---------- */
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    const storedCats = localStorage.getItem("expenseCategories");
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    if (storedCats)
      setCategories([...defaultCategories, ...JSON.parse(storedCats)]);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    const custom = categories.filter((c) => !defaultCategories.includes(c));
    localStorage.setItem("expenseCategories", JSON.stringify(custom));
  }, [categories]);

  /* ---------- ACTIONS ---------- */
  const handleAddOrUpdate = () => {
    if (!form.name || !form.amount) return;

    const data: Expense = {
      id: editExpense ? editExpense.id : Date.now().toString(),
      ...form,
      amount: Number(form.amount),
    };

    setExpenses((prev) =>
      editExpense
        ? prev.map((e) => (e.id === data.id ? data : e))
        : [data, ...prev]
    );

    setEditExpense(null);
    setIsDrawerOpen(false);
    setForm({
      date: new Date().toISOString().split("T")[0],
      name: "",
      amount: 0,
      category: "Uncategorized",
      type: "Need",
    });
  };

  const handleEdit = (e: Expense) => {
    setEditExpense(e);
    setForm(e);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories((p) => [...p, newCategory.trim()]);
    }
    setNewCategory("");
    setIsCategoryModalOpen(false);
  };

  /* ---------- DERIVED ---------- */
  const categoryCounts = categories.reduce((acc, c) => {
    acc[c] =
      c === "All"
        ? expenses.length
        : expenses.filter((e) => e.category === c).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredExpenses = expenses.filter(
    (e) =>
      (filter === "All" || e.category === filter) &&
      (typeFilter === "all" || e.type.toLowerCase() === typeFilter)
  );

  const grouped = filteredExpenses.reduce<Record<string, Expense[]>>(
    (acc, e) => {
      acc[e.date] = acc[e.date] || [];
      acc[e.date].push(e);
      return acc;
    },
    {}
  );

  const sumByPeriod = (days: number) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff < days;
      })
      .reduce((s, e) => s + e.amount, 0);
  };

  /* ---------- FORM JSX (REUSED) ---------- */
  const ExpenseForm = (
    <CreateExpenseForm
      form={form}
      setForm={setForm}
      categories={categories}
      isEdit={!!editExpense}
      onSubmit={handleAddOrUpdate}
      onAddCategory={() => setIsCategoryModalOpen(true)}
    />
  );
  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6">
        Expense Tracker
      </h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
               bg-white text-sm font-medium text-gray-700
               shadow-sm focus:outline-none focus:ring-2
               focus:ring-amber-400 focus:border-amber-400
               hover:border-gray-300 transition
               appearance-none"
        >
          <option value="" disabled>
            Category
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
               bg-white text-sm font-medium text-gray-700
               shadow-sm focus:outline-none focus:ring-2
               focus:ring-sky-400 focus:border-sky-400
               hover:border-gray-300 transition
               appearance-none"
        >
          <option value="" disabled>
            Type
          </option>
          <option value="all">All</option>
          <option value="need">Need</option>
          <option value="want">Want</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsSummaryOpen(true)}
          className="sm:hidden w-full py-3 rounded-xl
             bg-gradient-to-r from-amber-500 to-orange-500
             text-white font-semibold text-sm
             shadow-md active:scale-[0.98]
             transition"
        >
          View Summary
        </button>
        <button
          onClick={exportToExcel}
          className="w-full py-3 rounded-xl
    bg-gradient-to-r from-green-500 to-emerald-500
    text-white font-semibold text-sm
    shadow-md active:scale-[0.98]
    transition"
        >
          Export to Excel
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-2">
        {/* DESKTOP FORM */}
        <div className="hidden sm:block col-span-1 bg-white p-4 rounded-xl shadow">
          {ExpenseForm}
        </div>

        {/* LIST */}
        <div className="col-span-2 space-y-4">
          {Object.entries(grouped).map(([date, list]) => (
            <ExpenseCard
              key={date}
              date={date}
              expenses={list}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* DESKTOP SUMMARY */}
        <div className="hidden sm:block col-span-1 bg-white p-4 rounded-xl shadow">
          <p className="font-semibold mb-2">Summary</p>
          <p>Today: ₹ {sumByPeriod(1)}</p>
          <p>Week: ₹ {sumByPeriod(7)}</p>
          <p>Month: ₹ {sumByPeriod(30)}</p>
        </div>
      </div>

      {/* MOBILE FAB */}
      <button
        onClick={() => setIsFabOpen((p) => !p)}
        className="md:hidden fixed right-5 bottom-20 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-xl bg-amber-800 text-white hover:scale-105 transition"
      >
        <PlusIcon
          className={`h-6 w-6 transition-transform duration-300 ease-in-out ${
            isFabOpen ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>

      {/* DROPUP */}
      {isFabOpen && (
        <div className="sm:hidden fixed right-5 bottom-36 flex flex-col items-end">
          <button
            onClick={() => {
              setEditExpense(null); // reset edit mode
              setForm({
                date: new Date().toISOString().split("T")[0],
                name: "",
                amount: 0,
                category: "Uncategorized",
                type: "Need",
              });
              setIsDrawerOpen(true);
              setIsFabOpen(false);
            }}
            className="block p-1 px-2 rounded w-full text-right bg-slate-200 mb-2"
          >
            Expense
          </button>

          <button
            onClick={() => {
              // setIsDrawerOpen(true);
              alert("this feature needs to be implemented, please wait....");
              setIsFabOpen(false);
            }}
            className="p-1 px-2 rounded w-fit text-right bg-slate-200"
          >
            Credit
          </button>
        </div>
      )}

      {/* DRAWER BACKDROP */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-opacity duration-300
                      ${
                        isDrawerOpen
                          ? "bg-black/40 opacity-100"
                          : "pointer-events-none opacity-0"
                      }
                  `}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* DRAWER PANEL */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden
    bg-amber-600 rounded-t-2xl pt-2
    transition-transform duration-300 ease-out
    will-change-transform
    ${isDrawerOpen ? "translate-y-0" : "translate-y-full"}
  `}
      >
        <div className="flex justify-end mb-2 mr-2">
          <XMarkIcon
            className="h-5 w-5 cursor-pointer text-white"
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>
        {ExpenseForm}
      </div>

      {/* SUMMARY MODAL */}
      {isSummaryOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setIsSummaryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-4 w-full max-w-md"
          >
            <h3 className="font-semibold mb-2">Summary</h3>
            <p>Today: ₹ {sumByPeriod(1)}</p>
            <p>Week: ₹ {sumByPeriod(7)}</p>
            <p>Month: ₹ {sumByPeriod(30)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
