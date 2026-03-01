import { CONFIG } from '../constants/Config';

export interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
}

export const taskService = {
  async fetchTasks(afterDate?: string): Promise<Task[]> {
    const url = afterDate 
      ? `${CONFIG.API_URL}/tasks?after=${afterDate}` 
      : `${CONFIG.API_URL}/tasks`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async createTask(title: string, status: string = 'todo'): Promise<Task> {
    const response = await fetch(`${CONFIG.API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${CONFIG.API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${CONFIG.API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  async triggerSimulation(): Promise<void> {
    const response = await fetch(`${CONFIG.API_URL}/simulate`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to start simulation');
  },

  async clearTasks(): Promise<void> {
    const response = await fetch(`${CONFIG.API_URL}/tasks`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to clear tasks');
  }
};