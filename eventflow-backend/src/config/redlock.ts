import Redlock from "redlock";
import { redisClient } from "./redis";

export const redlock = new Redlock(
  [redisClient as any],
  {
    retryCount: 3,
    retryDelay: 200,
  }
);