'use client';

interface PaginationProps {
  page: number;
  setPage: (value: number) => void;
  taskCount: number;
  limit: number;
}

export default function Pagination({
  page,
  setPage,
  taskCount,
  limit,
}: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        className={`px-4 py-2 rounded font-medium ${
          page === 1
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Previous
      </button>
      <span className="text-gray-400 font-medium">Page {page}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={taskCount < limit}
        className={`px-4 py-2 rounded font-medium ${
          taskCount < limit
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Next
      </button>
    </div>
  );
}
