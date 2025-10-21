const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importCandidates() {
  console.log('Starting database import...');
  
  const dataPath = path.join(__dirname, '../data/candidates_production_ready.json');
  const candidates = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  console.log('Loaded ' + candidates.length + ' candidates from JSON');
  
  let imported = 0;
  let errors = 0;
  let skipped = 0;
  
  for (const candidate of candidates) {
    try {
      const existing = await prisma.candidate.findUnique({
        where: { uniqueCandidateId: candidate.uniqueCandidateId }
      });
      
      if (existing) {
        skipped++;
        continue;
      }
      
      await prisma.candidate.create({
        data: {
          uniqueCandidateId: candidate.uniqueCandidateId,
          voterNumber: candidate.voterNumber,
          ballotNumber: candidate.ballotNumber,
          partyNameArabic: candidate.partyNameArabic,
          partyNameEnglish: candidate.partyNameEnglish,
          candidateSequence: candidate.candidateSequence,
          nominationType: candidate.nominationType,
          governorate: candidate.governorate,
          sex: candidate.sex,
          fullNameArabic: candidate.fullNameArabic,
          fullNameEnglish: candidate.fullNameEnglish,
          email: candidate.email,
          phone: candidate.phone,
          bio: candidate.bio,
          photoUrl: candidate.photoUrl,
          coverPhotoUrl: candidate.coverPhotoUrl,
          verificationStatus: candidate.verificationStatus,
          profileCompletionPercent: candidate.profileCompletionPercent,
          viewsCount: candidate.viewsCount,
          supportersCount: candidate.supportersCount,
          postsCount: candidate.postsCount,
          eventsCount: candidate.eventsCount,
          referralCode: candidate.uniqueCandidateId,
          createdAt: new Date(candidate.createdAt),
          updatedAt: new Date(candidate.updatedAt)
        }
      });
      
      imported++;
      
      if (imported % 100 === 0) {
        console.log('Imported ' + imported + '/' + candidates.length + ' candidates...');
      }
    } catch (error) {
      console.error('Error: ' + candidate.uniqueCandidateId + ' - ' + error.message);
      errors++;
    }
  }
  
  console.log('Import Complete!');
  console.log('Successfully imported: ' + imported);
  console.log('Skipped duplicates: ' + skipped);
  console.log('Errors: ' + errors);
  
  await prisma.$disconnect();
}

importCandidates().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});