"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Expense {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  type: "Need" | "Want";
}

interface Props {
  date: string;
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

const typeStripe = {
  Need: "bg-emerald-500",
  Want: "bg-amber-500",
};

const ExpenseCard: React.FC<Props> = ({ date, expenses, onEdit, onDelete }) => {
  return (
    <div className="relative flex flex-col rounded-md shadow-sm">
      {/* Date header */}
      <div className="px-4 py-2 border-b text-sm font-semibold text-slate-700 bg-amber-200 rounded-t-xl">
        {date}
      </div>

      <div className="divide-y">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="relative flex items-center justify-between py-4 px-2 bg-red-50/60 hover:bg-slate-50 transition"
          >

            {/* Content */}
            <div className="ml-2">
              <p className="font-medium text-slate-800">{e.name}</p>
              <p className="text-xs text-slate-500">
                {e.category} • {e.type}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-slate-700">₹{e.amount}</span>

              <div className="flex items-center gap-1">
                <PencilSquareIcon
                onClick={() => onEdit(e)}
                className="h-4 w-4 cursor-pointer text-slate-500 hover:text-slate-800 transition"
              />

              <TrashIcon
                onClick={() => onDelete(e.id)}
                className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600 transition"
              />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCard;
