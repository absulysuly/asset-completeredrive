import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

/**
 * GET /api/social/posts
 * Get posts (stub for future implementation)
 */
router.get('/posts', async (req, res) => {
  // TODO: Implement post listing
  res.json({
    message: 'Social features coming soon',
    data: [],
  });
});

/**
 * GET /api/social/events
 * Get events (stub for future implementation)
 */
router.get('/events', async (req, res) => {
  // TODO: Implement event listing
  res.json({
    message: 'Social features coming soon',
    data: [],
  });
});

/**
 * GET /api/social/debates
 * Get debates (stub for future implementation)
 */
router.get('/debates', async (req, res) => {
  // TODO: Implement debate listing
  res.json({
    message: 'Social features coming soon',
    data: [],
  });
});

export default router;
