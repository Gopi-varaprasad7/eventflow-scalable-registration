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
exports.startConsumer = void 0;
const kafka_1 = require("../config/kafka");
const topics_1 = require("../events/topics");
const producer_1 = require("./producer");
const idempotency_1 = require("../utils/idempotency");
const consumer = kafka_1.kafka.consumer({
    groupId: 'eventflow-group',
    allowAutoTopicCreation: true,
});
const startConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    yield consumer.subscribe({ topic: topics_1.TOPICS.EVENT_REGISTRATION });
    yield consumer.subscribe({ topic: topics_1.TOPICS.EVENT_REGISTRATION_RETRY });
    yield consumer.run({
        autoCommit: false,
        eachBatch: (_a) => __awaiter(void 0, [_a], void 0, function* ({ batch, resolveOffset, commitOffsetsIfNecessary, heartbeat, isRunning, isStale, }) {
            for (const message of batch.messages) {
                if (!isRunning() || isStale())
                    break;
                const data = JSON.parse(message.value.toString());
                try {
                    yield (0, idempotency_1.processWithIdempotency)(data.eventId, () => __awaiter(void 0, void 0, void 0, function* () {
                        console.log('Processing registration:', data);
                        if (Math.random() < 0.3) {
                            throw new Error('Random failure');
                        }
                        console.log('Processing success');
                    }));
                    // ✅ mark success
                    resolveOffset(message.offset);
                }
                catch (error) {
                    const retryCount = data.retryCount || 0;
                    if (retryCount < 3) {
                        console.log('Retrying event...');
                        yield (0, producer_1.sendEvent)(topics_1.TOPICS.EVENT_REGISTRATION_RETRY, Object.assign(Object.assign({}, data), { retryCount: retryCount + 1 }));
                    }
                    else {
                        console.log('Sending to DLQ');
                        yield (0, producer_1.sendEvent)(topics_1.TOPICS.EVENT_REGISTRATION_DLQ, data);
                    }
                    continue;
                }
                yield heartbeat();
            }
            yield commitOffsetsIfNecessary();
        }),
    });
});
exports.startConsumer = startConsumer;
