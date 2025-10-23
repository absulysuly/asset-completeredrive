import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

/**
 * GET /api/civic/governorates
 * Get all governorates
 */
router.get('/governorates', async (req, res, next) => {
  try {
    const governorates = await prisma.governorate.findMany({
      select: {
        id: true,
        name: true,
        nameArabic: true,
        nameKurdish: true,
        code: true,
        slug: true,
        registeredVoters: true,
        pollingStations: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(governorates);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/civic/governorates/:slug
 * Get single governorate by slug
 */
router.get('/governorates/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const governorate = await prisma.governorate.findUnique({
      where: { slug },
      include: {
        statistics: true,
        _count: {
          select: {
            candidates: true,
          },
        },
      },
    });

    if (!governorate) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Governorate not found',
      });
    }

    res.json(governorate);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/civic/parties
 * Get all parties
 */
router.get('/parties', async (req, res, next) => {
  try {
    const parties = await prisma.party.findMany({
      select: {
        id: true,
        name: true,
        nameArabic: true,
        nameKurdish: true,
        code: true,
        ballotNumber: true,
        logoUrl: true,
        _count: {
          select: {
            candidates: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(parties);
  } catch (error) {
    next(error);
  }
});

export default router;
