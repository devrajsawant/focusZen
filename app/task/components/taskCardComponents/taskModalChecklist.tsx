export default function TaskModalChecklist(prop: any) {
  const {
    task,
    checklistInput,
    setChecklistInput,
    handleAddChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    completedCount,
    totalCount,
    percent,
  } = prop;

  return (
    <div className="h-full">
      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Checklist</h3>
          <div className="text-xs text-gray-500">{percent}%</div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 rounded-md border text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            value={checklistInput}
            onChange={(e) => setChecklistInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
            placeholder="Add checklist item..."
          />
          <button
            onClick={handleAddChecklistItem}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <ul className="space-y-3">
            {task.checklist?.length ? (
              task.checklist.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-2 rounded-md hover:bg-gray-50"
                >
                  <label className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(task.id, item.id)}
                      className="mt-1 accent-indigo-500"
                    />
                    <div className="min-w-0">
                      <div
                        className={`text-sm ${
                          item.checked
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteChecklistItem(task.id, item.id)}
                      className="p-1 rounded-md hover:bg-gray-100"
                      title="Delete item"
                    >
                      <span className="text-gray-400">🗑️</span>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">No checklist items.</li>
            )}
          </ul>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${percent}%`,
                backgroundColor: "rgba(79,70,229,0.6)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {completedCount}/{totalCount} completed
          </div>
        </div>
      </div>
    </div>
  );
}
