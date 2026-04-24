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
exports.sendEvent = exports.connectProducer = void 0;
const kafka_1 = require("../config/kafka");
const uuid_1 = require("uuid");
const producer = kafka_1.kafka.producer({
    allowAutoTopicCreation: true,
});
const connectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.connect();
    console.log('Kafka Producer Connected');
});
exports.connectProducer = connectProducer;
const sendEvent = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = (0, uuid_1.v4)();
    const enrichedMessage = Object.assign(Object.assign({}, message), { eventId, createdAt: new Date().toISOString() });
    yield producer.send({
        topic,
        messages: [
            {
                key: message.eventId || eventId,
                value: JSON.stringify(enrichedMessage),
            },
        ],
    });
    console.log(`Event sent: ${eventId}`);
});
exports.sendEvent = sendEvent;
