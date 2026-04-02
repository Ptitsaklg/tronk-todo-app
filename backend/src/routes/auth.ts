import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { validateLoginDto } from '../dto/auth.dto';

const router = Router();

router.post('/login', validate(validateLoginDto), login);

export default router;
