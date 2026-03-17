import { pool } from "../config/db";
import { sendEvent } from "../kafka/producer";

export const startOutboxWorker = async () => {
  setInterval(async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT * FROM outbox_events
         WHERE status = 'PENDING'
         LIMIT 10`
      );

      for (const event of result.rows) {
        try {
          await sendEvent(event.topic, event.payload);

          await client.query(
            `UPDATE outbox_events
             SET status = 'SENT'
             WHERE id = $1`,
            [event.id]
          );

        } catch (err) {
          console.error("Kafka send failed:", err);
        }
      }
    } catch (err) {
      console.error("Outbox error:", err);
    } finally {
      client.release();
    }
  }, 3000);
};