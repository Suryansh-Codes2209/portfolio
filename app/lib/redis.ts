import Redis from "ioredis";

/**
 * Single shared ioredis connection, reused across serverless invocations via a
 * global to avoid exhausting the connection pool. Returns null when REDIS_URL is
 * unset so every caller can degrade gracefully (likes simply disable).
 */
const globalForRedis = globalThis as unknown as { redis?: Redis | null };

export function getRedis(): Redis | null {
  if (globalForRedis.redis !== undefined) return globalForRedis.redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    globalForRedis.redis = null;
    return null;
  }

  const client = new Redis(url, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: true,
  });
  // Prevent unhandled 'error' events from crashing the process on transient drops.
  client.on("error", () => {});

  globalForRedis.redis = client;
  return client;
}
