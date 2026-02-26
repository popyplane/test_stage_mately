import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
	.then(() => console.log('Connected to MongoDB'))
	.catch((e) => console.error('DB connection error: ', e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});