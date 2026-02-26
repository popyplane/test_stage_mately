import mongoose, { Schema, Model, Document } from 'mongoose';

export enum TaskStatus {
	TODO = 'todo',
	IN_PROGRESS = 'in_progress',
	DONE = 'done'
}

export interface ITask extends Document{
	title: string;
	status: TaskStatus;
	createdAt: Date;
}

const TaskSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: Object.values(TaskStatus),
		default: TaskStatus.TODO
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

TaskSchema.index({createdAt: 1});

export default mongoose.model<ITask>('task', TaskSchema);