export default function TaskModalDetails(prop: any) {
  const { task, formatDate, statusBadge, priorityPill } = prop;

  return (
    <div className="h-full">
      <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Description
        </h3>

        <div className="prose max-w-none text-sm text-gray-700 mb-4">
          {task.description ? (
            <p>{task.description}</p>
          ) : (
            <p className="text-gray-400">No description provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}
