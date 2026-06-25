"use client";

import type { Category, Pin, Task } from "@/lib/types";
import { newId } from "@/lib/storage";
import { CategoryColumn } from "./CategoryColumn";
import { AddCategory } from "./AddCategory";

type Props = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  pins: Pin[];
};

// Owns all to-do mutations; the parent just holds the persisted arrays.
export function TodoBoard({
  categories,
  setCategories,
  tasks,
  setTasks,
  pins,
}: Props) {
  // --- task ops ---
  const addTask = (categoryId: string, title: string, detail?: string) =>
    setTasks((prev) => [
      ...prev,
      { id: newId(), categoryId, title, detail, done: false, createdAt: Date.now() },
    ]);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  // --- category ops ---
  const addCategory = (name: string, accentColor: string) =>
    setCategories((prev) => [...prev, { id: newId(), name, accentColor }]);

  const renameCategory = (id: string, name: string) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );

  const recolorCategory = (id: string, accentColor: string) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, accentColor } : c)),
    );

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.filter((t) => t.categoryId !== id));
  };

  const attachPin = (categoryId: string, pinId: string | undefined) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, attachedPinId: pinId } : c,
      ),
    );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((cat) => (
        <CategoryColumn
          key={cat.id}
          category={cat}
          tasks={tasks.filter((t) => t.categoryId === cat.id)}
          pins={pins}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onRename={renameCategory}
          onRecolor={recolorCategory}
          onDelete={deleteCategory}
          onAttach={attachPin}
        />
      ))}
      <AddCategory onAdd={addCategory} />
    </div>
  );
}
