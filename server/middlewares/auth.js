import { clerkClient } from "@clerk/express";

// Simple in-memory cache with 5-minute TTL to prevent 429 rate limit errors
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cleanup stale cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of userCache.entries()) {
    if (now - data.timestamp > CACHE_TTL) {
      userCache.delete(userId);
    }
  }
}, 10 * 60 * 1000);

// Middleware to check userId and hasPremiumPlan
export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    // Store userId on request object to avoid duplicate auth() calls in controllers
    req.userId = userId;

    // Check cache first to avoid unnecessary Clerk API calls
    const cached = userCache.get(userId);
    const now = Date.now();

    let user;
    let hasPremiumPlan;

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      // Use cached data - no API call needed!
      user = cached.user;
      hasPremiumPlan = cached.hasPremiumPlan;
    } else {
      // Cache miss or expired - make API calls
      hasPremiumPlan = await has({ plan: 'premium' });
      user = await clerkClient.users.getUser(userId);

      // Store in cache for future requests
      userCache.set(userId, {
        user,
        hasPremiumPlan,
        timestamp: now
      });
    }

    // Set free_usage from metadata, defaulting to 0 if not set
    req.free_usage = user.privateMetadata?.free_usage || 0;
    req.plan = hasPremiumPlan ? 'premium' : 'free';

    next();

  } catch (error) {
    res.json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

// Export function to invalidate cache when user metadata is updated
export const invalidateUserCache = (userId) => {
  userCache.delete(userId);
};