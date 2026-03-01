import type { Request, Response } from 'express';
import Task, { TaskStatus } from '../models/task.js';

export const getTasks = async (req: Request, res: Response) => {
	try {
		const { after } = req.query;

		const filter = after ? { createdAt: { $gt: new Date(after as string) } } : {};

		const tasks = await Task.find(filter)
			.sort({ createdAt: -1 }) 
			.limit(20);

		res.json(tasks);
	} catch (e) {
		res.status(500).json({ message: "Server error" })
	}
};

export const createTask = async (req: Request, res: Response) => {
	try {
		const { title, status } = req.body;
		const task = await Task.create({ title, status });
		res.status(201).json(task);
	} catch (e) {
		res.status(400).json({ message: "Error creating task" });
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title, status } = req.body;
		const task = await Task.findByIdAndUpdate(
			id, 
			{ title, status }, 
			{ new: true }
		);
		if (!task) return res.status(404).json({ message: "Task not found" });
		res.json(task);
	} catch (e) {
		res.status(400).json({ message: "Error updating task" });
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const task = await Task.findByIdAndDelete(id);
		if (!task) return res.status(404).json({ message: "Task not found" });
		res.json({ message: "Task deleted successfully" });
	} catch (e) {
		res.status(400).json({ message: "Error deleting task" });
	}
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const simulateTasks = async (req: Request, res: Response) => {
	res.status(202).json({ message: "Simulation started..." });

	const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

	for (let i = 0; i < 10; i++) {
		if (i > 0)
			await delay(5000);
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		await Task.create({
			title: `Automated task ${i + 1}`,
			status: status
		})
		console.log(`Simulated task ${i + 1} created`)
	}
}

export const clearTasks = async (req: Request, res: Response) => {
	try {
		await Task.deleteMany({});
		res.json({ message: "All tasks cleared" });
	} catch (e) {
		res.status(500).json({ message: "Error clearing tasks" });
	}
};