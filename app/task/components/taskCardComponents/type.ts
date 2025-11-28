export type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
};

export type Task = {
  id: number;
  title: string;
  description?: string;
  category: string;
  project?: string;
  status: "todo" | "inprogress" | "done";
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "none";
  checklist?: ChecklistItem[];
};
