import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createEventHandler,
  getEventsHandler,
  registerEventHandler,
} from '../controllers/event.controller';

const router = express.Router();

router.post('/create-event', authenticate, createEventHandler);
router.get('/my-events', authenticate, getEventsHandler);
router.post('/register-event', authenticate, registerEventHandler);

export default router;
