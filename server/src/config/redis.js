const Redis = require('ioredis');
const crypto = require('crypto');

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 200, 5000),
  maxRetriesPerRequest: 2,
  enableOfflineQueue: false,
  connectTimeout: 5000,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));

const verifyRedis = async () => {
  try {
    await redis.ping();
    console.log('Redis PING ok - token blacklist active');
    return true;
  }catch (err) {
    console.error('WARNING: Redis unreachable: ', err.message);
    console.error('WARNING: Token blacklist DISABLED - logout will not revoke tokens');
    return false;
  }
};

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

/**
 * Blacklist a JWT by storing its hash in Redis until it expires.
 * Fails silently — never blocks logout if Redis is unavailable.
 */
const blacklistToken = async (token, ttlSeconds) => {
  if (!token || ttlSeconds <= 0) return;
  try {
    await redis.setex(`bl:${hashToken(token)}`, ttlSeconds, '1');
  } catch (err) {
    console.error('Redis blacklistToken error:', err.message);
  }
};

/**
 * Returns true if the token has been blacklisted.
 * Fails open (returns false) if Redis is unavailable — prevents
 * blocking legitimate requests due to infra issues.
 */
const isTokenBlacklisted = async (token) => {
  if (!token) return false;
  try {
    const result = await redis.get(`bl:${hashToken(token)}`);
    return result !== null;
  } catch (err) {
    console.error('Redis isTokenBlacklisted error:', err.message);
    return false;
  }
};

module.exports = redis;
module.exports.verifyRedis = verifyRedis;
module.exports.blacklistToken = blacklistToken;
module.exports.isTokenBlacklisted = isTokenBlacklisted;
