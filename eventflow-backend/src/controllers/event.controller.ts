import { redisClient } from '../config/redis';
import { pool } from '../config/db';

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
  const userId = req.user.id;
  const result = await pool.query(
    `
        SELECT * FROM events WHERE created_by=$1`,
    [userId],
  );
  res.json({
    success: true,
    events: result.rows,
  });
};

export const registerEventHandler = async (req: any, res: any) => {
  const client = await pool.connect();
  try {
    const userId = req.query.id;
    const { eventId } = req.body;
    await client.query('BEGIN');

    const eventResult = await client.query(
      `
    SELECT max_attendees
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

    const max_Attendees = eventResult.rows[0].max_attendees;
    const countResult = await client.query(
      `SELECT COUNT(*) FROM event_registrations
       WHERE event_id = $1`,
      [eventId],
    );
    const registered = Number(countResult.rows[0].count);
    if (registered >= max_Attendees) {
      await client.query('ROLLBACK');

      return res.status(400).json({
        success: false,
        message: 'Event is full',
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
    await client.query('COMMIT');
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
      console.log("Serving events from Redis cache");
      return res.json({
        success: true,
        source: "cache",
        events: JSON.parse(cachedData)
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
    await redisClient.setEx(cacheKey,60,JSON.stringify(result.rows))

    res.json({
      success: true,
      source:"database",
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
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const result = await pool.query(
      `
      DELETE FROM event_registrations
      WHERE user_id = $1 AND event_id = $2 RETURNING *`,
      [userId, eventId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
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

export const getEventStatsHandler = async (req:any, res:any) => {
  try{
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
      [eventId]
    );
     if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
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
  }
  catch(error){}
}
