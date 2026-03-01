import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, taskService } from '../api/taskService';

export const useTaskPolling = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const latestTaskDateRef = useRef<string | undefined>(undefined);

  const fetchNewTasks = useCallback(async () => {
    try {
      const newTasks = await taskService.fetchTasks(latestTaskDateRef.current);
      
      if (newTasks.length > 0) {
        const newestInFetch = newTasks[0]?.createdAt;
        if (!latestTaskDateRef.current || (newestInFetch && newestInFetch > latestTaskDateRef.current)) {
          latestTaskDateRef.current = newestInFetch;
        }

        setTasks((prevTasks) => {
          const newIds = new Set(newTasks.map(t => t._id));
          const filteredPrev = prevTasks.filter(t => !newIds.has(t._id));
          return [...newTasks, ...filteredPrev];
        });
      }
    } catch (err) {
      console.error('Polling error:', err);
      setError('Failed to sync tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (title: string) => {
    const newTask = await taskService.createTask(title);
    if (!latestTaskDateRef.current || newTask.createdAt > latestTaskDateRef.current) {
        latestTaskDateRef.current = newTask.createdAt;
    }
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = await taskService.updateTask(id, updates);
    setTasks(prev => prev.map(t => t._id === id ? updated : t));
  };

  const removeTask = async (id: string) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const clearAll = useCallback(async () => {
    try {
      await taskService.clearTasks();
      setTasks([]);
      latestTaskDateRef.current = undefined;
    } catch (err) {
      setError('Failed to clear tasks');
    }
  }, []);

  useEffect(() => {
    fetchNewTasks();
    const interval = setInterval(fetchNewTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchNewTasks]);

  return { tasks, loading, error, refresh: fetchNewTasks, clearAll, addTask, updateTask, removeTask };
};