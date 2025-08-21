import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "";
const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;