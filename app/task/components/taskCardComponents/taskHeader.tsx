import { PencilIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TaskHeader(prop: any) {
    const {  task,
  editId,
  editTitle,
  setEditTitle,
  handleSaveEdit,
  startEdit,
  toggleStatus,
  deleteTask,
  setModalOpen} = prop
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        {editId === task.id ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
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
              <p className="text-sm text-gray-600 mt-1 truncate">{task.description}</p>
            )}
          </>
        )}
      </div>

      <div className="flex items-start gap-2 shrink-0">
        <button onClick={() => toggleStatus(task.id)} className="p-1 hover:bg-gray-100">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        </button>
        <button onClick={startEdit} className="p-1 hover:bg-gray-100">
          <PencilIcon className="h-5 w-5 text-gray-500" />
        </button>
        <button onClick={() => deleteTask(task.id)} className="p-1 hover:bg-gray-100">
          <TrashIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
