import {Router} from 'express';
import {getTasks, simulateTasks} from '../controllers/taskController.js';

const router = Router();

router.get('/tasks', getTasks);

router.post('/simulate', simulateTasks);

export default router;