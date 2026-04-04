'use client';

import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
  editingId: number | null;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDesc: string;
  setEditDesc: (value: string) => void;
  onStartEditing: (task: Task) => void;
  onUpdate: (id: number) => void;
  onCancelEdit: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  editingId,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  onStartEditing,
  onUpdate,
  onCancelEdit,
  onToggle,
  onDelete,
}: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg border border-gray-700">
          No tasks found.
        </p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editDesc={editDesc}
            setEditDesc={setEditDesc}
            onStartEditing={onStartEditing}
            onUpdate={onUpdate}
            onCancelEdit={onCancelEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
