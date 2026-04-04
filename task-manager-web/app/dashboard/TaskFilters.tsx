'use client';

interface TaskFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  onFilterChange: () => void;
}

export default function TaskFilters({
  search,
  setSearch,
  filter,
  setFilter,
  onFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onFilterChange();
          }}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            onFilterChange();
          }}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Tasks</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
    </div>
  );
}
