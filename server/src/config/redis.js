const Redis = require('ioredis');
const crypto = require('crypto');

const redis = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));

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
module.exports.blacklistToken = blacklistToken;
module.exports.isTokenBlacklisted = isTokenBlacklisted;
