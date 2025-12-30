/**
 * Redis Cache Utility (Optional)
 * 
 * This module provides caching functionality using Redis.
 * If Redis is not available, the app continues to work without caching.
 */

let redisClient = null;
let isConnected = false;

// Only initialize Redis if REDIS_URL is provided
const initRedis = async () => {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.log('ℹ Redis URL not configured, caching disabled');
        return null;
    }

    try {
        // Dynamic import to avoid errors if redis package not installed
        const { createClient } = await import('redis');

        redisClient = createClient({ url: redisUrl });

        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err.message);
            isConnected = false;
        });

        redisClient.on('connect', () => {
            console.log('✓ Redis connected');
            isConnected = true;
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.log('ℹ Redis not available, continuing without cache');
        return null;
    }
};

// Get cached data
const get = async (key) => {
    if (!isConnected || !redisClient) return null;

    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Cache get error:', error.message);
        return null;
    }
};

// Set cached data with optional TTL (default: 5 minutes)
const set = async (key, value, ttlSeconds = 300) => {
    if (!isConnected || !redisClient) return false;

    try {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Cache set error:', error.message);
        return false;
    }
};

// Delete cached data
const del = async (key) => {
    if (!isConnected || !redisClient) return false;

    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error('Cache delete error:', error.message);
        return false;
    }
};

// Delete all keys matching a pattern
const delPattern = async (pattern) => {
    if (!isConnected || !redisClient) return false;

    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return true;
    } catch (error) {
        console.error('Cache pattern delete error:', error.message);
        return false;
    }
};

// Check if Redis is available
const isAvailable = () => isConnected;

// Close connection
const close = async () => {
    if (redisClient) {
        await redisClient.quit();
        isConnected = false;
    }
};

module.exports = {
    initRedis,
    get,
    set,
    del,
    delPattern,
    isAvailable,
    close
};
