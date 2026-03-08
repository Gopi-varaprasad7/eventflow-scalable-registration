import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createEventHandler,
  getEventsHandler,
  registerEventHandler,
  getAllEventsHandler,
  cancelRegistrationHandler,
  getEventAttendeesHandler,
  getEventStatsHandler,
} from '../controllers/event.controller';

const router = express.Router();

router.post('/create-event', authenticate, createEventHandler);
router.get('/my-events', authenticate, getEventsHandler);
router.post('/register-event', authenticate, registerEventHandler);
router.get('/', getAllEventsHandler);
router.delete('/cancel-registration', authenticate, cancelRegistrationHandler);
router.get('/:id/attendees', getEventAttendeesHandler);
router.get('/:id/stats', getEventStatsHandler);

export default router;
