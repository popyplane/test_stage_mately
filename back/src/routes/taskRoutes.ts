import {Router} from 'express';
import {getTasks, simulateTasks, clearTasks, createTask, updateTask, deleteTask} from '../controllers/taskController.js';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.post('/simulate', simulateTasks);
router.delete('/tasks', clearTasks);

export default router;