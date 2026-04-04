'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchWithAuth } from './utils';
import DashboardHeader from './DashboardHeader';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import Pagination from './Pagination';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Edit form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Filter, search, and pagination states
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (filter) queryParams.append('status', filter);
      if (search) queryParams.append('search', search);

      const res = await fetchWithAuth(`http://localhost:5000/tasks?${queryParams.toString()}`);

      if (!res.ok) throw new Error('Failed to fetch tasks');

      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      toast.error(err.message);
      if (err.message.includes('Session expired')) {
        localStorage.clear();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [page, filter, search, router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Adding task...');

    try {
      const res = await fetchWithAuth('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc }),
      });

      if (!res.ok) throw new Error('Failed to create task');

      toast.success('Task added!', { id: loadingToast });
      setNewTitle('');
      setNewDesc('');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
      if (err.message.includes('Session expired')) router.push('/login');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated!');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
      if (err.message.includes('Session expired')) router.push('/login');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      toast.success('Task deleted!');
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
      if (err.message.includes('Session expired')) router.push('/login');
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
  };

  const handleUpdateTask = async (id: number) => {
    const loadingToast = toast.loading('Updating task...');

    try {
      const res = await fetchWithAuth(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });

      if (!res.ok) throw new Error('Failed to update task');

      toast.success('Task updated!', { id: loadingToast });
      setEditingId(null);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
      if (err.message.includes('Session expired')) router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        Loading your tasks...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <DashboardHeader onLogout={handleLogout} />

        <TaskForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDesc={newDesc}
          setNewDesc={setNewDesc}
          onSubmit={handleCreateTask}
        />

        <TaskFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          onFilterChange={handleFilterChange}
        />

        <TaskList
          tasks={tasks}
          editingId={editingId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editDesc={editDesc}
          setEditDesc={setEditDesc}
          onStartEditing={startEditing}
          onUpdate={handleUpdateTask}
          onCancelEdit={() => setEditingId(null)}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />

        <Pagination
          page={page}
          setPage={setPage}
          taskCount={tasks.length}
          limit={limit}
        />
      </div>
    </div>
  );
}