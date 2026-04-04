'use client';

interface TaskFormProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDesc: string;
  setNewDesc: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TaskForm({
  newTitle,
  setNewTitle,
  newDesc,
  setNewDesc,
  onSubmit,
}: TaskFormProps) {
  return (
    <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-md border border-gray-700">
      <h2 className="mb-4 text-xl font-semibold">Add a New Task</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            placeholder="e.g., Buy groceries"
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300">Description (Optional)</label>
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="e.g., Milk, Eggs, Bread"
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-10.5 rounded-md bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
