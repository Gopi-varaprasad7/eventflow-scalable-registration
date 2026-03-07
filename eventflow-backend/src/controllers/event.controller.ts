import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const createEventHandler = async (req: any, res: any) => {
  try {

    const { title, description, location, event_date } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Title and event_date are required',
      });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO events
      (title, description, location, event_date, created_by)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [title, description, location, event_date, userId],
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
  const userId = req.user.id;
  const { eventId } = req.body;

  const result = await pool.query(
    `INSERT INTO event_registrations (user_id,event_id)
    VALUES ($1,$2)
    ON CONFLICT (user_id, event_id)
    DO NOTHING
    RETURNING *`,
    [userId, eventId],
  );
  if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User already registered for this event"
      });
    }

  res.json({
    success: true,
    registration: result.rows[0],
  });
};
