import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createEventHandler,
  getEventsHandler,
  registerEventHandler,
  getAllEventsHandler,
} from '../controllers/event.controller';

const router = express.Router();

router.post('/create-event', authenticate, createEventHandler);
router.get('/my-events', authenticate, getEventsHandler);
router.post('/register-event', authenticate, registerEventHandler);
router.get('/', getAllEventsHandler);

export default router;
