"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaitlistPositionHandler = exports.getEventStatsHandler = exports.getEventAttendeesHandler = exports.cancelRegistrationHandler = exports.getAllEventsHandler = exports.registerEventHandler = exports.getEventsHandler = exports.createEventHandler = void 0;
const redis_1 = require("../config/redis");
const db_1 = require("../config/db");
const socket_1 = require("../config/socket");
const email_queue_1 = require("../queues/email.queue");
const redlock_1 = require("../config/redlock");
const logger_1 = require("../config/logger");
const producer_1 = require("../kafka/producer");
const topics_1 = require("../events/topics");
const uuid_1 = require("uuid");
const createEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, location, event_date, max_attendees } = req.body;
        if (!title || !event_date) {
            return res.status(400).json({
                success: false,
                message: 'Title and event_date are required',
            });
        }
        const userId = req.user.id;
        const result = yield db_1.pool.query(`INSERT INTO events
      (title, description, location, event_date, created_by,max_attendees)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`, [title, description, location, event_date, max_attendees, userId]);
        yield redis_1.redisClient.del('events:list');
        res.json({
            success: true,
            event: result.rows[0],
        });
    }
    catch (err) {
        console.error('ERROR:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.createEventHandler = createEventHandler;
const getEventsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = 'events:list';
        const cachedEvents = yield redis_1.redisClient.get(cacheKey);
        if (cachedEvents) {
            return res.json({
                success: true,
                source: 'cache',
                events: JSON.parse(cachedEvents),
            });
        }
        const result = yield db_1.pool.query(`SELECT * FROM events ORDER BY created_at DESC`);
        const events = result.rows;
        yield redis_1.redisClient.set(cacheKey, JSON.stringify(events), { EX: 60 });
        res.json({
            success: true,
            source: 'database',
            events,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getEventsHandler = getEventsHandler;
const registerEventHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    let lock;
    try {
        const userId = req.query.id;
        const { eventId } = req.body;
        const event = {
            registrationId: (0, uuid_1.v4)(),
            userId,
            eventId,
            registeredAt: new Date().toISOString(),
        };
        lock = yield redlock_1.redlock.acquire([`lock:event:${eventId}`], 2000);
        yield client.query('BEGIN');
        const eventResult = yield client.query(`SELECT max_attendees, title
       FROM events
       WHERE id = $1
       FOR UPDATE`, [eventId]);
        if (eventResult.rows.length === 0) {
            yield client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        const maxAttendees = eventResult.rows[0].max_attendees;
        const countResult = yield client.query(`SELECT COUNT(*) FROM event_registrations
       WHERE event_id = $1`, [eventId]);
        const registered = Number(countResult.rows[0].count);
        if (registered >= maxAttendees) {
            yield client.query(`INSERT INTO event_waitlist (user_id,event_id)
        VALUES ($1,$2)
        ON CONFLICT (user_id,event_id) DO NOTHING`, [userId, eventId]);
            yield client.query('COMMIT');
            return res.json({
                success: true,
                message: 'Event full. Added to waitlist or already in waitlist',
            });
        }
        const insertResult = yield client.query(`INSERT INTO event_registrations (user_id,event_id)
       VALUES ($1,$2)
       ON CONFLICT (user_id,event_id)
       DO NOTHING
       RETURNING *`, [userId, eventId]);
        if (insertResult.rows.length === 0) {
            yield client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'User already registered',
            });
        }
        const userResult = yield client.query(`SELECT email FROM users WHERE id = $1`, [userId]);
        yield client.query(`INSERT INTO outbox_events (id, topic, payload)
       VALUES ($1, $2, $3)`, [(0, uuid_1.v4)(), topics_1.TOPICS.EVENT_REGISTRATION, JSON.stringify(event)]);
        yield client.query('COMMIT');
        yield email_queue_1.emailQueue.add('send-confirmation', {
            email: userResult.rows[0].email,
            eventTitle: eventResult.rows[0].title,
        });
        yield (0, producer_1.sendEvent)('event-registration', event);
        logger_1.logger.info('User registered for event', {
            userId,
            eventId,
        });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
    finally {
        if (lock) {
            yield lock.release().catch(() => { });
        }
        client.release();
    }
});
exports.registerEventHandler = registerEventHandler;
const getAllEventsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const cacheKey = `events:${page}:${limit}`;
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Serving events from Redis cache');
            return res.json({
                success: true,
                source: 'cache',
                events: JSON.parse(cachedData),
            });
        }
        const result = yield db_1.pool.query(`SELECT 
        e.*,
        COUNT(er.id) AS registration_count
       FROM events e
       LEFT JOIN event_registrations er
       ON e.id = er.event_id
       GROUP BY e.id
       ORDER BY e.event_date ASC
       LIMIT $1 OFFSET $2`, [limit, offset]);
        yield redis_1.redisClient.setEx(cacheKey, 60, JSON.stringify(result.rows));
        res.json({
            success: true,
            source: 'database',
            events: result.rows,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getAllEventsHandler = getAllEventsHandler;
const cancelRegistrationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    let promotedUserId = null;
    try {
        const { eventId } = req.body;
        const userId = req.query.id;
        yield client.query('BEGIN');
        yield client.query(`DELETE FROM event_registrations
       WHERE user_id=$1 AND event_id=$2`, [userId, eventId]);
        const waitlistResult = yield client.query(`SELECT * FROM event_waitlist
       WHERE event_id=$1
       ORDER BY created_at
       LIMIT 1`, [eventId]);
        if (waitlistResult.rows.length > 0) {
            const nextUser = waitlistResult.rows[0];
            yield client.query(`INSERT INTO event_registrations(user_id,event_id)
         VALUES($1,$2)`, [nextUser.user_id, eventId]);
            yield client.query(`DELETE FROM event_waitlist WHERE id=$1`, [
                nextUser.id,
            ]);
            promotedUserId = nextUser.user_id;
        }
        yield client.query('COMMIT');
        if (promotedUserId) {
            yield email_queue_1.emailQueue.add('waitlist-promoted', {
                userId: promotedUserId,
                eventId,
            });
        }
        const io = (0, socket_1.getIO)();
        io.to(`event-${eventId}`).emit('waitlist-updated', {
            eventId,
        });
        res.json({
            success: true,
            message: 'Registration cancelled',
        });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
    finally {
        client.release();
    }
});
exports.cancelRegistrationHandler = cancelRegistrationHandler;
const getEventAttendeesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params.id;
        const result = yield db_1.pool.query(`SELECT 
    u.id,
    u.email,
    er.created_at AS registered_at
    FROM event_registrations er
    JOIN users u 
    ON er.user_id = u.id
    WHERE er.event_id = $1
    ORDER BY er.created_at ASC`, [eventId]);
        res.json({
            success: true,
            attendees: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getEventAttendeesHandler = getEventAttendeesHandler;
const getEventStatsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id;
        const result = yield db_1.pool.query(`SELECT 
        e.id,
        e.title,
        e.max_attendees,
        COUNT(er.id) AS total_registrations
       FROM events e
       LEFT JOIN event_registrations er
       ON e.id = er.event_id
       WHERE e.id = $1
       GROUP BY e.id`, [eventId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }
        const event = result.rows[0];
        const remainingSeats = event.max_attendees - event.total_registrations;
        const usagePercent = (event.total_registrations / event.max_attendees) * 100;
        res.json({
            success: true,
            stats: {
                event_id: event.id,
                title: event.title,
                max_attendees: event.max_attendees,
                total_registrations: Number(event.total_registrations),
                remaining_seats: remainingSeats,
                capacity_used_percent: usagePercent.toFixed(2),
            },
        });
    }
    catch (error) { }
});
exports.getEventStatsHandler = getEventStatsHandler;
const getWaitlistPositionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.id;
        const { eventId } = req.query;
        const result = yield db_1.pool.query(`SELECT position
       FROM (
          SELECT user_id,
                 ROW_NUMBER() OVER (ORDER BY created_at) AS position
          FROM event_waitlist
          WHERE event_id = $1
       ) ranked
       WHERE user_id = $2`, [eventId, userId]);
        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: 'User not in waitlist',
            });
        }
        res.json({
            success: true,
            position: result.rows[0].position,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.getWaitlistPositionHandler = getWaitlistPositionHandler;
