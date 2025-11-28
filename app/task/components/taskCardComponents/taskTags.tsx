import Link from "next/link";

export default function TaskTags({
  task,
  formatDate,
  priorityPill,
  statusBadge,
}: any) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {task.project && (
        <Link
          href={`project/${task.project}`}
          className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-purple-300"
        >
          {task.project}
        </Link>
      )}

      <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-blue-200">
        {task.category}
      </span>

      <span className="text-xs px-2 py-0.5 rounded-md font-medium text-gray-700 bg-pink-300">
        {statusBadge(task.status)}
      </span>

      <span
        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${priorityPill(
          task.priority
        )}`}
      >
        {task.priority
          ? task.priority[0].toUpperCase() + task.priority.slice(1)
          : "None"}
      </span>

      {task.dueDate && (
        <span className="ml-auto text-xs text-gray-500">
          📅 {formatDate(task.dueDate)}
        </span>
      )}
    </div>
  );
}
