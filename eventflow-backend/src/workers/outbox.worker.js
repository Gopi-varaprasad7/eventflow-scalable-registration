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
exports.startOutboxWorker = void 0;
const db_1 = require("../config/db");
const producer_1 = require("../kafka/producer");
const startOutboxWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield db_1.pool.connect();
        try {
            const result = yield client.query(`SELECT * FROM outbox_events
         WHERE status = 'PENDING'
         LIMIT 10`);
            for (const event of result.rows) {
                try {
                    yield (0, producer_1.sendEvent)(event.topic, event.payload);
                    yield client.query(`UPDATE outbox_events
             SET status = 'SENT'
             WHERE id = $1`, [event.id]);
                }
                catch (err) {
                    console.error("Kafka send failed:", err);
                }
            }
        }
        catch (err) {
            console.error("Outbox error:", err);
        }
        finally {
            client.release();
        }
    }), 3000);
});
exports.startOutboxWorker = startOutboxWorker;
