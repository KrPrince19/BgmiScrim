const { createClerkClient, verifyToken } = require('@clerk/backend');
const User = require('../models/User');

// Clerk client for fetching user profiles
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * protect — Auth middleware
 * Verifies the Clerk session token from the Authorization header,
 * finds or creates a matching MongoDB User, and sets req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // verifyToken is a top-level export — verifies the Clerk JWT using JWKS
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkUserId = payload.sub; // Clerk user ID e.g. "user_abc123"

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized. Invalid token payload.' });
    }

    // Fetch full user profile from Clerk (email, name, phone)
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const username =
      clerkUser.username ||
      clerkUser.firstName ||
      email.split('@')[0] ||
      clerkUserId;
    const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || '0000000000';

    // Find or create a MongoDB User record keyed by clerkId
    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      // Try to find a legacy record by email
      user = await User.findOne({ email });

      if (user) {
        // Backfill clerkId on the existing record
        user.clerkId = clerkUserId;
        await user.save();
      } else {
        // Ensure username uniqueness
        let finalUsername = username;
        const existingWithUsername = await User.findOne({ username });
        if (existingWithUsername) {
          finalUsername = `${username}_${clerkUserId.slice(-6)}`;
        }

        user = await User.create({
          clerkId: clerkUserId,
          username: finalUsername,
          email,
          phone,
          role: 'user',
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error.message);
    return res.status(401).json({ message: 'Not authorized. Token verification failed.', detail: error.message });
  }
};

module.exports = { protect };
