import { pool } from '../config/db';

export const processWithIdempotency = async (
  eventId: string,
  handler: () => Promise<void>,
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🔍 check if already processed
    const existing = await client.query(
      'SELECT 1 FROM processed_events WHERE event_id = $1',
      [eventId],
    );

    if ((existing.rowCount ?? 0) > 0) {
      console.log('Duplicate event skipped:', eventId);
      await client.query('ROLLBACK');
      return;
    }
    await handler();
    await client.query('INSERT INTO processed_events(event_id) VALUES($1)', [
      eventId,
    ]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
