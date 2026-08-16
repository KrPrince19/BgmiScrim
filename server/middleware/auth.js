const { createClerkClient } = require('@clerk/backend');
const User = require('../models/User');

// Initialize Clerk client using server secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * protect — Auth middleware
 * Verifies the Clerk session token sent in the Authorization header,
 * then finds or creates a matching MongoDB User and sets req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the Clerk session token
    const payload = await clerkClient.verifyToken(token);
    const clerkUserId = payload.sub; // Clerk user ID, e.g. "user_abc123"

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized. Invalid token.' });
    }

    // Fetch full user profile from Clerk to get email/username
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
      // Try to find by email in case a legacy record exists
      user = await User.findOne({ email });

      if (user) {
        // Backfill clerkId on existing record
        user.clerkId = clerkUserId;
        await user.save();
      } else {
        // Create a new User document for this Clerk user
        // Ensure username uniqueness by appending a suffix if needed
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
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Not authorized. Token verification failed.' });
  }
};

module.exports = { protect };
