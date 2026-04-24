"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_1 = require("../middlewares/validate");
const event_validation_1 = require("../validations/event.validation");
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /events:
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
router.post('/create-event', auth_middleware_1.authenticate, event_controller_1.createEventHandler);
router.get('/my-events', auth_middleware_1.authenticate, event_controller_1.getEventsHandler);
router.post('/register-event', auth_middleware_1.authenticate, (0, validate_1.validate)(event_validation_1.registerEventSchema), event_controller_1.registerEventHandler);
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
router.get('/', event_controller_1.getAllEventsHandler);
router.delete('/cancel-registration', auth_middleware_1.authenticate, event_controller_1.cancelRegistrationHandler);
router.get('/:id/attendees', event_controller_1.getEventAttendeesHandler);
router.get('/:id/stats', event_controller_1.getEventStatsHandler);
router.get("/waitlist-position", event_controller_1.getWaitlistPositionHandler);
exports.default = router;
