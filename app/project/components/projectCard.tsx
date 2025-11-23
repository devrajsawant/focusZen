"use client";

import { formatDate, getProjectColor } from "@/utils/utilities";
import React from "react";

export type Project = {
  id: string | number;
  title: string;
  progressPercent: number; // 0 - 100
  endDate?: string; // ISO or formatted string
};

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { title, progressPercent, endDate } = project;
  const bgColor = getProjectColor(index);
  return (
    <div className="flex flex-col justify-between rounded-lg min-h-[200px] p-4 shadow-sm min-w-[200px] max-w-[320px]" style={{ backgroundColor: bgColor }}>
      <div className="border-1 border-gray-500 rounded-md px-3 w-fit">
        <p className="text-md font-thin text-gray-500 mt-1">
          {formatDate(endDate ?? "—")}
        </p>
      </div>
      <div>
        <div>
          <h3 className="text-xl font-medium leading-tight truncate">
            {title}
          </h3>
        </div>
        <div className="mt-3">
          <span className="font-semibold text-3xl">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className="h-2 rounded-full"
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
