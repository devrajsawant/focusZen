export default function TaskFooter(props: any) {
  const { totalCount, completedCount, percent, isCompleted, isDueToday } =
    props;
  if (totalCount === 0) return null;

  return (
    <div className="mt-4 flex items-center gap-4 justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Checklist</div>
          <div className="text-sm text-gray-500">
            {percent}% • {completedCount}/{totalCount}
          </div>
        </div>

        <div className="w-full bg-slate-300 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${percent}%`,
              backgroundColor: "rgba(79,70,229,0.5)",
            }}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 whitespace-nowrap">
        {isCompleted ? "Completed" : isDueToday ? "Due Today" : ""}
      </div>
    </div>
  );
}
