import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';

console.log('--- Starting server... ---');
dotenv.config();

if (!process.env.MONGO_URI) {
	console.error('CRITICAL ERROR: MONGO_URI is not defined in .env');
	process.exit(1);
}

const app = express();
app.use(express.json());
app.use('/api', taskRoutes);

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI as string)
	.then(() => console.log('Connected to MongoDB'))
	.catch((e) => console.error('DB connection error: ', e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});