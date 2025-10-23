#!/usr/bin/env tsx

/**
 * CSV Import Script for 7,769 Iraqi Election Candidates
 *
 * This script imports candidate data from CSV files into the PostgreSQL database.
 * It handles:
 * - Data validation and cleaning
 * - Governorate and party normalization
 * - Gender and nomination type mapping
 * - Deduplication tracking
 *
 * Usage:
 *   npm run import:candidates              # Import all candidates
 *   npm run import:test                    # Import first 100 for testing
 *   tsx scripts/import-candidates.ts --limit 100
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { PrismaClient, Gender, NominationType } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/ElectionCandidates_Original.csv');
const BATCH_SIZE = 100;

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(arg => arg.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// Statistics
const stats = {
  processed: 0,
  imported: 0,
  skipped: 0,
  errors: [] as { row: number; error: string; data?: any }[],
};

// Governorate normalization map
const GOVERNORATE_ALIASES: Record<string, string> = {
  'baghdad': 'Baghdad',
  'bagdad': 'Baghdad',
  'basra': 'Basra',
  'basrah': 'Basra',
  'nineveh': 'Nineveh',
  'ninawa': 'Nineveh',
  'erbil': 'Erbil',
  'arbil': 'Erbil',
  'irbil': 'Erbil',
  'sulaymaniyah': 'Sulaymaniyah',
  'sulaimaniya': 'Sulaymaniyah',
  'dohuk': 'Dohuk',
  'duhok': 'Dohuk',
  'anbar': 'Al Anbar',
  'al anbar': 'Al Anbar',
  'al-anbar': 'Al Anbar',
  'diyala': 'Diyala',
  'kirkuk': 'Kirkuk',
  'salah al-din': 'Saladin',
  'saladin': 'Saladin',
  'wasit': 'Wasit',
  'maysan': 'Maysan',
  'babil': 'Babil',
  'babylon': 'Babil',
  'najaf': 'Najaf',
  'karbala': 'Karbala',
  'al-qadisiyyah': 'Al-Qādisiyyah',
  'qadisiyyah': 'Al-Qādisiyyah',
  'dhi qar': 'Dhi Qar',
  'dhi-qar': 'Dhi Qar',
  'muthanna': 'Muthanna',
  'al-muthanna': 'Muthanna',
};

/**
 * Normalize governorate name to canonical form
 */
function normalizeGovernorate(name: string | null | undefined): string | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return GOVERNORATE_ALIASES[normalized] || null;
}

/**
 * Parse gender from CSV value
 */
function parseGender(value: string): Gender {
  const normalized = value.trim().toLowerCase();

  const genderMap: Record<string, Gender> = {
    'male': Gender.Male,
    'm': Gender.Male,
    'ذكر': Gender.Male,
    'نێر': Gender.Male,
    'female': Gender.Female,
    'f': Gender.Female,
    'أنثى': Gender.Female,
    'مێ': Gender.Female,
  };

  const gender = genderMap[normalized];
  if (!gender) {
    throw new Error(`Invalid gender value: "${value}"`);
  }

  return gender;
}

/**
 * Parse nomination type from CSV value
 */
function parseNominationType(value: string): NominationType {
  const normalized = value.trim().toLowerCase();

  const typeMap: Record<string, NominationType> = {
    'party': NominationType.Party,
    'حزب': NominationType.Party,
    'independent': NominationType.Independent,
    'مستقل': NominationType.Independent,
    'coalition': NominationType.Coalition,
    'alliance': NominationType.Coalition,
    'تحالف': NominationType.Coalition,
    'individual': NominationType.Individual,
    'فردي': NominationType.Individual,
  };

  return typeMap[normalized] || NominationType.Independent;
}

/**
 * Find or create party by name
 */
async function findOrCreateParty(partyName: string, ballotNumber: string) {
  if (!partyName || partyName.trim() === '') return null;

  const normalized = partyName.trim();

  // Try to find existing party
  let party = await prisma.party.findFirst({
    where: {
      name: {
        equals: normalized,
        mode: 'insensitive',
      },
    },
  });

  // Create if doesn't exist
  if (!party) {
    try {
      party = await prisma.party.create({
        data: {
          name: normalized,
          ballotNumber: ballotNumber ? parseInt(ballotNumber) : null,
          code: normalized.substring(0, 10).toUpperCase().replace(/\s+/g, '_'),
        },
      });
      console.log(`  ✓ Created party: ${normalized}`);
    } catch (error: any) {
      // Ignore unique constraint errors (race condition)
      if (error.code === 'P2002') {
        party = await prisma.party.findFirst({
          where: { name: { equals: normalized, mode: 'insensitive' } },
        });
      } else {
        throw error;
      }
    }
  }

  return party;
}

/**
 * Find or create governorate by name
 */
async function findOrCreateGovernorate(governorateName: string) {
  if (!governorateName) return null;

  const normalized = normalizeGovernorate(governorateName);
  if (!normalized) return null;

  // Try to find existing
  let governorate = await prisma.governorate.findFirst({
    where: {
      name: {
        equals: normalized,
        mode: 'insensitive',
      },
    },
  });

  // Create if doesn't exist
  if (!governorate) {
    try {
      governorate = await prisma.governorate.create({
        data: {
          name: normalized,
          code: normalized.substring(0, 3).toUpperCase(),
          slug: normalized.toLowerCase().replace(/\s+/g, '-'),
          nameArabic: governorateName, // Store original for now
        },
      });
      console.log(`  ✓ Created governorate: ${normalized}`);
    } catch (error: any) {
      // Ignore unique constraint errors
      if (error.code === 'P2002') {
        governorate = await prisma.governorate.findFirst({
          where: { name: { equals: normalized, mode: 'insensitive' } },
        });
      } else {
        throw error;
      }
    }
  }

  return governorate;
}

/**
 * Import candidates from CSV
 */
async function importCandidates() {
  console.log('🚀 Starting candidate import...');
  console.log(`📁 CSV File: ${CSV_FILE_PATH}`);
  if (LIMIT) {
    console.log(`⚠️  LIMIT: Importing first ${LIMIT} candidates only`);
  }
  console.log('');

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`❌ Error: CSV file not found at ${CSV_FILE_PATH}`);
    console.error('Please copy the CSV file to data/ElectionCandidates_Original.csv');
    process.exit(1);
  }

  const candidates: any[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        if (!LIMIT || candidates.length < LIMIT) {
          candidates.push(row);
        }
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  console.log(`📊 Read ${candidates.length} candidates from CSV`);
  console.log('');

  let batch: any[] = [];
  let batchNumber = 1;

  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i];
    const rowNumber = i + 2; // +2 for header row and 0-index

    try {
      stats.processed++;

      // Parse CSV row (adjust column names based on actual CSV headers)
      const csvData = {
        ballotNumber: row['A'] || row['رقم الاقتراع الحزب'],
        nameOnBallot: row['Name on ballot'] || row['الحزب'],
        candidateSequence: row['Candidate\n\nSequence'] || row['رقم الاقتراع للمرشح'],
        nominationType: row['   Type\n      Nominat-\n            ion'] || row['ا نوع الترشيح'],
        electoralDistrict: row['Electoral\ndistrict'] || row['الدائرة الانتخابية'],
        gender: row['Sex'] || row['الجنس'],
        fullName: row["Candidate's full name"] || row['إسم المرشح الكامل'],
        voterNumber: row['Voter number'] || row['الرقم'],
      };

      // Validate required fields
      if (!csvData.fullName || csvData.fullName.trim() === '') {
        stats.skipped++;
        stats.errors.push({
          row: rowNumber,
          error: 'Missing full name',
          data: csvData,
        });
        continue;
      }

      if (!csvData.candidateSequence || csvData.candidateSequence.trim() === '') {
        stats.skipped++;
        stats.errors.push({
          row: rowNumber,
          error: 'Missing candidate sequence',
          data: csvData,
        });
        continue;
      }

      if (!csvData.gender || csvData.gender.trim() === '') {
        stats.skipped++;
        stats.errors.push({
          row: rowNumber,
          error: 'Missing gender',
          data: csvData,
        });
        continue;
      }

      // Parse values
      const gender = parseGender(csvData.gender);
      const nominationType = parseNominationType(csvData.nominationType || '');
      const candidateSequence = parseInt(csvData.candidateSequence);

      if (isNaN(candidateSequence)) {
        stats.skipped++;
        stats.errors.push({
          row: rowNumber,
          error: 'Invalid candidate sequence',
          data: csvData,
        });
        continue;
      }

      // Find/create related entities
      const party = await findOrCreateParty(csvData.nameOnBallot, csvData.ballotNumber);
      const governorate = await findOrCreateGovernorate(csvData.electoralDistrict);

      // Prepare candidate data
      const candidateData = {
        fullName: csvData.fullName.trim(),
        nameOnBallot: csvData.nameOnBallot?.trim() || null,
        candidateSequence,
        voterNumber: csvData.voterNumber?.trim() || null,
        nominationType,
        gender,
        partyId: party?.id || null,
        partyName: csvData.nameOnBallot?.trim() || null,
        governorateId: governorate?.id || null,
        governorateName: csvData.electoralDistrict?.trim() || null,
        electoralDistrict: csvData.electoralDistrict?.trim() || null,
        sourceFile: CSV_FILE_PATH,
        sourceRowId: rowNumber,
        rawData: csvData,
      };

      batch.push(candidateData);

      // Process batch when full
      if (batch.length >= BATCH_SIZE) {
        await prisma.electionCandidate.createMany({
          data: batch,
          skipDuplicates: true,
        });
        stats.imported += batch.length;
        console.log(`  ✓ Batch ${batchNumber}: Imported ${batch.length} candidates (Total: ${stats.imported}/${stats.processed})`);
        batch = [];
        batchNumber++;
      }
    } catch (error: any) {
      stats.skipped++;
      stats.errors.push({
        row: rowNumber,
        error: error.message,
        data: row,
      });
      console.error(`  ❌ Error on row ${rowNumber}: ${error.message}`);
    }
  }

  // Process remaining batch
  if (batch.length > 0) {
    await prisma.electionCandidate.createMany({
      data: batch,
      skipDuplicates: true,
    });
    stats.imported += batch.length;
    console.log(`  ✓ Batch ${batchNumber}: Imported ${batch.length} candidates (Total: ${stats.imported}/${stats.processed})`);
  }

  console.log('');
  console.log('✅ Import Complete!');
  console.log('');
  console.log('📊 Statistics:');
  console.log(`  Total processed: ${stats.processed}`);
  console.log(`  Successfully imported: ${stats.imported}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0 && stats.errors.length <= 10) {
    console.log('');
    console.log('⚠️  Errors:');
    stats.errors.forEach(err => {
      console.log(`  Row ${err.row}: ${err.error}`);
    });
  } else if (stats.errors.length > 10) {
    console.log('');
    console.log(`⚠️  ${stats.errors.length} errors occurred. Showing first 10:`);
    stats.errors.slice(0, 10).forEach(err => {
      console.log(`  Row ${err.row}: ${err.error}`);
    });
  }

  // Write error log if there are errors
  if (stats.errors.length > 0) {
    const errorLogPath = path.join(__dirname, '../logs/import_errors.json');
    fs.mkdirSync(path.dirname(errorLogPath), { recursive: true });
    fs.writeFileSync(errorLogPath, JSON.stringify(stats.errors, null, 2));
    console.log('');
    console.log(`📝 Error log written to: ${errorLogPath}`);
  }
}

// Main execution
importCandidates()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
