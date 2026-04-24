import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { registerEventSchema } from '../validations/event.validation';
import {
  createEventHandler,
  getEventsHandler,
  registerEventHandler,
  getAllEventsHandler,
  cancelRegistrationHandler,
  getEventAttendeesHandler,
  getEventStatsHandler,
  getWaitlistPositionHandler,
} from '../controllers/event.controller';

const router = express.Router();

/**
 * @swagger
 * /events/create-event:
 *   post:
 *     summary: Create new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               event_date:
 *                 type: string
 *               max_attendees:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Event created successfully
 */
router.post('/create-event', authenticate, createEventHandler);
router.get('/my-events', authenticate, getEventsHandler);
router.post(
  '/register-event',
  authenticate,
  validate(registerEventSchema),
  registerEventHandler,
);
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Returns paginated list of events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', getAllEventsHandler);
router.delete('/cancel-registration', authenticate, cancelRegistrationHandler);
router.get('/waitlist-position', getWaitlistPositionHandler);
router.get('/:id/attendees', getEventAttendeesHandler);
router.get('/:id/stats', getEventStatsHandler);

export default router;
