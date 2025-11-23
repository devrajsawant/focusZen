"use client";

import React from "react";
import ProjectCard, { Project } from "./projectCard";

type Props = {
  projects?: Project[]; // up to 3 shown
  className?: string;
};

export default function ProjectPanel({ projects = [], className = "" }: Props) {
  // show up to 3 projects
  const visible = projects.slice(0, 3);

  // when empty -> placeholder / CTA
  return (
    <div className={`bg-none ${className}`}>
      <div className="mt-2">
        {visible.length === 0 ? (
          <div className="text-sm text-gray-800 bg-[#FFFBF0] rounded-xl py-2 px-2">
            No active projects. Add one to get started.
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto py-2">
            {visible.map((p, i) => (
              <div key={p.id} className="flex-shrink-0 w-[38%] sm:w-[32%]">
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
