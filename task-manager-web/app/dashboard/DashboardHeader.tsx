'use client';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white">My Tasks</h1>
      <button
        onClick={onLogout}
        className="rounded bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
