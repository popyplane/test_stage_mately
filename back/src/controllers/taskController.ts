import type { Request, Response } from 'express';
import Task, { TaskStatus } from '../models/task.js';

export const getTasks = async (req: Request, res: Response) => {
	try {
		const {after} = req.query;

		const filter = after ? { createdAt: { $gt: new Date(after as string) } } : {};
    	const tasks = await Task.find(filter)
    		.sort({ createdAt: 1 }) // ---------------------- task sort asc ----------------------------------
    		.limit(20);

		res.json(tasks);
	} catch (e) {
		res.status(500).json({message: "Server error"})
	}
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const simulateTasks = async (req: Request, res: Response) => {
	res.status(202).json({message: "Simulation started..."});

	for (let i = 0; i < 10; i++) {
		await delay(500);
		await Task.create({
			title: `Automated task ${i + 1}`,
			status: `todo`
		})
		console.log(`Simulated task ${i + 1} created`)
	}
}