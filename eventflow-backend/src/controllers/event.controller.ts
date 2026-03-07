import { Request,Response,NextFunction } from "express";
import { pool } from "../config/db";

export const createEventHandler = async(req:any,res:any)=>{
  const {title,description,location,event_date} = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `INSERT INTO events
    (title,description,location,event_date,created_by)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [title,description,location,event_date,userId]
  );

  res.json({
    success:true,
    event:result.rows[0]
  });
}

export const getEventsHandler = async (req:any, res:any) => {
    const userId = req.user.id;
    const result = await pool.query(`
        SELECT * FROM events WHERE created_by=$1`,[userId]
    );
    res.json({
        success:true,
        events:result.rows
    })
}

export const registerEventHandler = async(req:any,res:any)=>{
  const userId = req.user.id;
  const {eventId} = req.body;

  const result = await pool.query(
    `INSERT INTO event_registrations (user_id,event_id)
    VALUES ($1,$2)
    RETURNING *`,
    [userId,eventId]
  );

  res.json({
    success:true,
    registration:result.rows[0]
  });
}