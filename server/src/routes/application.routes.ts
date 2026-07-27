import { Router } from 'express';
import { 
  createApplication, 
  getApplications, 
  getApplicationById, 
  updateApplication, 
  deleteApplication,
  generateAiFeedback
} from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/ai-feedback', generateAiFeedback);

export default router;
