'use client';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

interface TaskItemProps {
  task: Task;
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

export default function TaskItem({
  task,
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
}: TaskItemProps) {
  const isEditing = editingId === task.id;

  return (
    <div
      className={`rounded-lg bg-gray-800 p-6 shadow-sm border ${
        task.status === 'COMPLETED' ? 'border-green-900/50 opacity-75' : 'border-gray-700'
      } transition-all`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onUpdate(task.id)}
              className="rounded bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="rounded bg-gray-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2
              className={`text-xl font-semibold ${
                task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-white'
              }`}
            >
              {task.title}
            </h2>
            {task.description && <p className="text-gray-400 mt-1">{task.description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                task.status === 'COMPLETED'
                  ? 'bg-green-900/30 text-green-400 border border-green-800'
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
              }`}
            >
              {task.status}
            </span>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => onStartEditing(task)}
                className="px-3 py-1.5 text-sm bg-blue-900/50 hover:bg-blue-800 text-blue-200 rounded transition border border-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => onToggle(task.id)}
                className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition"
              >
                {task.status === 'PENDING' ? 'Complete' : 'Undo'}
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-800 text-red-200 rounded transition border border-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
