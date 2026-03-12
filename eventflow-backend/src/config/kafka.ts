import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "eventflow-service",
  brokers: ["localhost:9092"],
});