"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type ExpenseFormData = {
  date: string;
  name: string;
  amount: number;
  category: string;
  type: "Need" | "Want";
};

interface Props {
  form: ExpenseFormData;
  setForm: React.Dispatch<React.SetStateAction<ExpenseFormData>>;
  categories: string[];
  isEdit: boolean;
  onSubmit: () => void;
  onAddCategory: () => void;
}

const CreateExpenseForm: React.FC<Props> = ({
  form,
  setForm,
  categories,
  isEdit,
  onSubmit,
  onAddCategory,
}) => {
  return (
    <div
      className="
  space-y-2.5
  max-h-[80vh] overflow-y-auto
  bg-white/80
  rounded-xl
  p-2
"
    >
      {" "}
      <h2 className="text-lg font-semibold text-slate-800">
        {isEdit ? "Edit Expense" : "Add Expense"}
      </h2>
      {/* Date */}
      <label className="block text-xs font-medium text-slate-600">Date</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full p-3 rounded-md bg-slate-50 border border-transparent text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      {/* Name */}
      <label className="block text-xs font-medium text-slate-600">
        Expense name
      </label>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="e.g. Groceries, Coffee"
        className="w-full p-3 rounded-md bg-slate-100 border border-transparent text-sm
                   focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
      />
      {/* Amount */}
      <label className="block text-xs font-medium text-slate-600">Amount</label>
      <input
        type="number"
        placeholder="₹ Amount"
        value={form.amount || ""}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        className="w-full p-3 rounded-md bg-slate-100 border border-transparent text-sm
                   focus:ring-2 focus:ring-indigo-100"
      />
      {/* Category */}
      <label className="block text-xs font-medium text-slate-600">
        Category
      </label>
      <div className="relative">
        <select
          value={form.category}
          onChange={(e) =>
            e.target.value === "add"
              ? onAddCategory()
              : setForm({ ...form, category: e.target.value })
          }
          className="appearance-none w-full p-2.5 rounded-md bg-white/60
                     border border-gray-100 text-sm pr-9
                     focus:ring-2 focus:ring-indigo-100"
        >
          {categories
            .filter((c) => c !== "All")
            .map((c) => (
              <option key={c}>{c}</option>
            ))}
          <option value="add">+ Add Category</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </div>
      {/* Type chips */}
      <label className="block text-xs font-medium text-slate-600">Type</label>
      <div className="flex gap-2 text-sm">
        {(["Need", "Want"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t })}
            className={`flex-1 py-2 rounded-lg border transition ${
              form.type === t
                ? "bg-indigo-50 border-indigo-200 text-indigo-800 shadow-sm"
                : "bg-white border-gray-100 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Action */}
      <button
        onClick={onSubmit}
        className="w-full py-2.5 rounded-lg bg-gradient-to-b
                   from-amber-600 to-amber-800 text-white font-medium
                   shadow-md hover:from-indigo-600 hover:to-indigo-700
                   transition transform hover:-translate-y-0.5"
      >
        {isEdit ? "Update Expense" : "Add Expense"}
      </button>
    </div>
  );
};

export default CreateExpenseForm;
