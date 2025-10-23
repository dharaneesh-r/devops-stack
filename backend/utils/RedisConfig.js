const redis = require("redis");
const logger = require("./WinstonLogger"); // Your Winston logger

// Create Redis client using environment variables from Docker Compose
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// Log errors using Winston
redisClient.on("error", (err) => {
  logger.error(`Redis Client Error: ${err.message}`);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    logger.info("✅ Connected to Redis successfully");
  } catch (err) {
    logger.error(`❌ Redis connection failed: ${err.message}`);
  }
})();

module.exports = redisClient;
