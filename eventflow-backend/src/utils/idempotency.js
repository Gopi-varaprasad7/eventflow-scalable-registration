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
exports.processWithIdempotency = void 0;
const db_1 = require("../config/db");
const processWithIdempotency = (eventId, handler) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = yield db_1.pool.connect();
    try {
        yield client.query('BEGIN');
        // 🔍 check if already processed
        const existing = yield client.query('SELECT 1 FROM processed_events WHERE event_id = $1', [eventId]);
        if (((_a = existing.rowCount) !== null && _a !== void 0 ? _a : 0) > 0) {
            console.log('Duplicate event skipped:', eventId);
            yield client.query('ROLLBACK');
            return;
        }
        yield handler();
        yield client.query('INSERT INTO processed_events(event_id) VALUES($1)', [
            eventId,
        ]);
        yield client.query('COMMIT');
    }
    catch (err) {
        yield client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
});
exports.processWithIdempotency = processWithIdempotency;
