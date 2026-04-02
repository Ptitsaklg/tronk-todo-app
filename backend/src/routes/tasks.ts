import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { validateCreateTaskDto, validateUpdateTaskDto } from '../dto/task.dto';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', validate(validateCreateTaskDto), createTask);
router.put('/:id', validate(validateUpdateTaskDto), updateTask);
router.delete('/:id', deleteTask);

export default router;
