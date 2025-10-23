import { Router } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const candidateQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
  governorate: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  party: z.string().optional(),
  nominationType: z.enum(['Party', 'Independent', 'Coalition', 'Individual']).optional(),
  search: z.string().optional(),
  sort: z.enum(['name', 'ballotNumber', 'votes', 'createdAt']).optional().default('candidateSequence'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * GET /api/candidates
 * List all candidates with pagination and filters
 */
router.get('/', async (req, res, next) => {
  try {
    const query = candidateQuerySchema.parse(req.query);
    const { page, limit, governorate, gender, party, nominationType, search, sort, order } = query;

    // Build where clause
    const where: any = {
      // Only show unique candidates (not duplicates)
      duplicateOfId: null,
    };

    if (governorate) {
      where.governorateName = governorate;
    }

    if (gender) {
      where.gender = gender;
    }

    if (party) {
      where.partyName = {
        contains: party,
        mode: 'insensitive',
      };
    }

    if (nominationType) {
      where.nominationType = nominationType;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { fullNameArabic: { contains: search, mode: 'insensitive' } },
        { fullNameKurdish: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.electionCandidate.count({ where });

    // Get paginated results
    const candidates = await prisma.electionCandidate.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      select: {
        id: true,
        fullName: true,
        fullNameArabic: true,
        fullNameKurdish: true,
        candidateSequence: true,
        gender: true,
        governorateName: true,
        partyName: true,
        nominationType: true,
        votes: true,
        photoUrl: true,
        status: true,
      },
    });

    res.json({
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: error.errors,
      });
    }
    next(error);
  }
});

/**
 * GET /api/candidates/:id
 * Get single candidate by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.electionCandidate.findUnique({
      where: { id },
      include: {
        party: true,
        governorate: true,
        socialUser: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            verified: true,
          },
        },
      },
    });

    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/candidates/stats/overview
 * Get platform statistics
 */
router.get('/stats/overview', async (req, res, next) => {
  try {
    const [
      total,
      male,
      female,
      byGovernorate,
      byParty,
    ] = await Promise.all([
      prisma.electionCandidate.count({ where: { duplicateOfId: null } }),
      prisma.electionCandidate.count({ where: { gender: 'Male', duplicateOfId: null } }),
      prisma.electionCandidate.count({ where: { gender: 'Female', duplicateOfId: null } }),
      prisma.electionCandidate.groupBy({
        by: ['governorateName'],
        where: { duplicateOfId: null },
        _count: true,
        orderBy: {
          _count: {
            governorateName: 'desc',
          },
        },
      }),
      prisma.electionCandidate.groupBy({
        by: ['partyName'],
        where: { duplicateOfId: null, partyName: { not: null } },
        _count: true,
        orderBy: {
          _count: {
            partyName: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    res.json({
      total_candidates: total,
      gender_distribution: {
        Male: male,
        Female: female,
      },
      candidates_per_governorate: byGovernorate.map(g => ({
        governorate: g.governorateName,
        count: g._count,
      })),
      top_parties: byParty.map(p => ({
        party: p.partyName,
        count: p._count,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/candidates/trending
 * Get trending candidates (for future implementation)
 */
router.get('/trending', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string || '6'), 20);

    // For now, return random sample
    // TODO: Implement proper trending algorithm based on views, votes, social engagement
    const candidates = await prisma.electionCandidate.findMany({
      where: {
        duplicateOfId: null,
        status: 'Active',
      },
      take: limit,
      orderBy: {
        votes: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        fullNameArabic: true,
        candidateSequence: true,
        gender: true,
        governorateName: true,
        partyName: true,
        photoUrl: true,
        votes: true,
      },
    });

    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

export default router;
