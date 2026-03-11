import { redisClient } from '../config/redis';
import { pool } from '../config/db';
import { getIO } from '../config/socket';
import { emailQueue } from '../queues/email.queue';
import { redlock } from '../config/redlock';

export const createEventHandler = async (req: any, res: any) => {
  try {
    const { title, description, location, event_date, max_attendees } =
      req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Title and event_date are required',
      });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO events
      (title, description, location, event_date, created_by,max_attendees)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [title, description, location, event_date, max_attendees, userId],
    );
    await redisClient.del("events:list");
    res.json({
      success: true,
      event: result.rows[0],
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getEventsHandler = async (req: any, res: any) => {
  try {
    const cacheKey = 'events:list';
    const cachedEvents = await redisClient.get(cacheKey);

    if (cachedEvents) {
      return res.json({
        success: true,
        source: 'cache',
        events: JSON.parse(cachedEvents),
      });
    }
    const result = await pool.query(
      `SELECT * FROM events ORDER BY created_at DESC`,
    );

    const events = result.rows;

    await redisClient.set(
      cacheKey,
      JSON.stringify(events),
      { EX: 60 }, 
    );
    res.json({
      success: true,
      source: 'database',
      events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const registerEventHandler = async (req: any, res: any) => {
  const client = await pool.connect();
  let lock: any;

  try {
    const userId = req.query.id;
    const { eventId } = req.body;

    lock = await redlock.acquire([`lock:event:${eventId}`], 2000);

    await client.query('BEGIN');

    const eventResult = await client.query(
      `SELECT max_attendees, title
       FROM events
       WHERE id = $1
       FOR UPDATE`,
      [eventId],
    );

    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const maxAttendees = eventResult.rows[0].max_attendees;

    const countResult = await client.query(
      `SELECT COUNT(*) FROM event_registrations
       WHERE event_id = $1`,
      [eventId],
    );

    const registered = Number(countResult.rows[0].count);

    if (registered >= maxAttendees) {
      await client.query(
        `INSERT INTO event_waitlist (user_id,event_id)
        VALUES ($1,$2)
        ON CONFLICT (user_id,event_id) DO NOTHING`,
        [userId, eventId],
      );
      await client.query('COMMIT');
      return res.json({
        success: true,
        message: 'Event full. Added to waitlist or already in waitlist',
      });
    }

    const insertResult = await client.query(
      `INSERT INTO event_registrations (user_id,event_id)
       VALUES ($1,$2)
       ON CONFLICT (user_id,event_id)
       DO NOTHING
       RETURNING *`,
      [userId, eventId],
    );

    if (insertResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'User already registered',
      });
    }

    const userResult = await client.query(
      `SELECT email FROM users WHERE id = $1`,
      [userId],
    );

    await client.query('COMMIT');

    await emailQueue.add('send-confirmation', {
      email: userResult.rows[0].email,
      eventTitle: eventResult.rows[0].title,
    });

    res.json({
      success: true,
      registration: insertResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  } finally {
    if (lock) {
      await lock.release().catch(() => {});
    }
    client.release();
  }
};

export const getAllEventsHandler = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `events:${page}:${limit}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving events from Redis cache');
      return res.json({
        success: true,
        source: 'cache',
        events: JSON.parse(cachedData),
      });
    }

    const result = await pool.query(
      `SELECT 
        e.*,
        COUNT(er.id) AS registration_count
       FROM events e
       LEFT JOIN event_registrations er
       ON e.id = er.event_id
       GROUP BY e.id
       ORDER BY e.event_date ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result.rows));

    res.json({
      success: true,
      source: 'database',
      events: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const cancelRegistrationHandler = async (req: any, res: any) => {
  const client = await pool.connect();

  let promotedUserId: number | null = null;

  try {
    const { eventId } = req.body;
    const userId = req.query.id;

    await client.query('BEGIN');

    await client.query(
      `DELETE FROM event_registrations
       WHERE user_id=$1 AND event_id=$2`,
      [userId, eventId],
    );

    const waitlistResult = await client.query(
      `SELECT * FROM event_waitlist
       WHERE event_id=$1
       ORDER BY created_at
       LIMIT 1`,
      [eventId],
    );

    if (waitlistResult.rows.length > 0) {
      const nextUser = waitlistResult.rows[0];

      await client.query(
        `INSERT INTO event_registrations(user_id,event_id)
         VALUES($1,$2)`,
        [nextUser.user_id, eventId],
      );

      await client.query(`DELETE FROM event_waitlist WHERE id=$1`, [
        nextUser.id,
      ]);

      promotedUserId = nextUser.user_id;
    }

    await client.query('COMMIT');
    if (promotedUserId) {
      await emailQueue.add('waitlist-promoted', {
        userId: promotedUserId,
        eventId,
      });
    }
    const io = getIO();

    io.to(`event-${eventId}`).emit('waitlist-updated', {
      eventId,
    });

    res.json({
      success: true,
      message: 'Registration cancelled',
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  } finally {
    client.release();
  }
};

export const getEventAttendeesHandler = async (req: any, res: any) => {
  try {
    const { eventId } = req.params.id;
    const result = await pool.query(
      `SELECT 
    u.id,
    u.email,
    er.created_at AS registered_at
    FROM event_registrations er
    JOIN users u 
    ON er.user_id = u.id
    WHERE er.event_id = $1
    ORDER BY er.created_at ASC`,
      [eventId],
    );
    res.json({
      success: true,
      attendees: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getEventStatsHandler = async (req: any, res: any) => {
  try {
    const eventId = req.params.id;
    const result = await pool.query(
      `SELECT 
        e.id,
        e.title,
        e.max_attendees,
        COUNT(er.id) AS total_registrations
       FROM events e
       LEFT JOIN event_registrations er
       ON e.id = er.event_id
       WHERE e.id = $1
       GROUP BY e.id`,
      [eventId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    const event = result.rows[0];
    const remainingSeats = event.max_attendees - event.total_registrations;
    const usagePercent =
      (event.total_registrations / event.max_attendees) * 100;

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
  } catch (error) {}
};

export const getWaitlistPositionHandler = async (req: any, res: any) => {
  try {
    const userId = req.query.id;
    const { eventId } = req.query;

    const result = await pool.query(
      `SELECT position
       FROM (
          SELECT user_id,
                 ROW_NUMBER() OVER (ORDER BY created_at) AS position
          FROM event_waitlist
          WHERE event_id = $1
       ) ranked
       WHERE user_id = $2`,
      [eventId, userId],
    );

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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
