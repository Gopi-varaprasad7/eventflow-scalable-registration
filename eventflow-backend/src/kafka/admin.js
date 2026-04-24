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
exports.createTopics = void 0;
const kafka_1 = require("../config/kafka");
const topics_1 = require("../events/topics");
const admin = kafka_1.kafka.admin();
const createTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    yield admin.connect();
    yield admin.createTopics({
        topics: [
            {
                topic: topics_1.TOPICS.EVENT_REGISTRATION,
                numPartitions: 3,
                replicationFactor: 1
            },
            {
                topic: topics_1.TOPICS.EVENT_REGISTRATION_RETRY,
                numPartitions: 3,
                replicationFactor: 1
            },
            {
                topic: topics_1.TOPICS.EVENT_REGISTRATION_DLQ,
                numPartitions: 1,
                replicationFactor: 1
            }
        ]
    });
    console.log("Kafka topics created");
    yield admin.disconnect();
});
exports.createTopics = createTopics;
