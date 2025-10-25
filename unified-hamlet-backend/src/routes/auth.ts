import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

/**
 * POST /api/auth/login
 * Simple login endpoint (stub for future implementation)
 */
router.post('/login', async (req, res) => {
  // TODO: Implement proper authentication
  res.json({
    message: 'Authentication coming soon',
    user: {
      id: '1',
      name: 'Guest User',
      role: 'Voter',
    },
    token: 'stub-token',
  });
});

/**
 * POST /api/auth/register
 * Simple registration endpoint (stub for future implementation)
 */
router.post('/register', async (req, res) => {
  // TODO: Implement proper registration
  res.json({
    message: 'Registration coming soon',
  });
});

export default router;
