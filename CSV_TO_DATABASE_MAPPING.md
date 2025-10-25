# CSV-to-Database Field Mapping Plan
**Generated:** 2025-10-21
**For:** Iraqi Election Platform - 7,769 Candidates
**Source Data:** ElectionCandidates_Original.csv

---

## Executive Summary

This document maps the 10 columns from the election CSV files to the unified Prisma `ElectionCandidate` model. It provides transformation rules, validation logic, and deduplication strategies.

**Source Files:**
- `ElectionCandidates_Original.csv` - 7,769 rows, 10 columns (ENGLISH headers)
- `ElectionCandidates_English.csv` - 7,769 rows, 8 columns (ARABIC headers - mislabeled)
- Various `agent*.csv` files - cleaned/processed versions

**Target:** PostgreSQL database via Prisma ORM

---

## CSV Column Structure

### Original CSV (10 Columns)

| Column # | CSV Header | Sample Value | Type | Notes |
|----------|------------|--------------|------|-------|
| 1 | `A` | "216" | String/Int | Party ballot code |
| 2 | `Name on ballot` | "Kurdistan Democratic Party" | String | Party name (English) |
| 3 | `Candidate\n\nSequence` | "1" | Integer | Candidate position on ballot |
| 4 | `H1` | "" | String | Empty/Header column (ignore) |
| 5 | `   Type\n      Nominat-\n            ion` | "Party" | String | Nomination type |
| 6 | `Electoral\ndistrict` | "Erbil" | String | Governorate name |
| 7 | `H2` | "" | String | Empty/Header column (ignore) |
| 8 | `Sex` | "Male" | String | Gender |
| 9 | `Candidate's full name` | "Abbas Mohammed Abdul Karim" | String | Full candidate name (English) |
| 10 | `Voter number` | "12345" | String | Registration/voter number |

---

## Database Field Mapping

### ElectionCandidate Model Mapping

| Prisma Field | CSV Column | Transformation | Validation | Default |
|--------------|-----------|----------------|------------|---------|
| **id** | - | UUID generated | - | `uuid()` |
| **fullName** | `Candidate's full name` | Trim whitespace, Title case | Required, 2-100 chars | - |
| **fullNameArabic** | From Arabic CSV | Direct mapping | Optional | `null` |
| **fullNameKurdish** | From Kurdish CSV | Direct mapping | Optional | `null` |
| **nameOnBallot** | `Name on ballot` | Trim whitespace | Optional | `null` |
| **candidateSequence** | `Candidate\nSequence` | Parse to integer | Required, 1-1000 | - |
| **voterNumber** | `Voter number` | Trim, alphanumeric | Optional, unique | `null` |
| **party** | Lookup via `Name on ballot` | Foreign key to Party table | Optional | `null` |
| **partyId** | Derived from party lookup | UUID reference | Optional | `null` |
| **partyName** | `Name on ballot` | Denormalized cache | Optional | `null` |
| **nominationType** | `Type Nomination` | Map to enum | Required | See mapping below |
| **governorate** | Lookup via `Electoral district` | Foreign key to Governorate | Optional | `null` |
| **governorateId** | Derived from lookup | UUID reference | Optional | `null` |
| **governorateName** | `Electoral district` | Denormalized cache | Optional | `null` |
| **electoralDistrict** | `Electoral district` | Direct copy | Optional | `null` |
| **gender** | `Sex` | Map to Gender enum | Required | See mapping below |
| **status** | - | - | - | `Active` |
| **sourceFile** | - | Filename | - | CSV filename |
| **sourceRowId** | - | Row number | - | CSV row # |
| **rawData** | - | Entire CSV row as JSON | - | JSON object |
| **verifiedUnique** | - | - | - | `false` |
| **createdAt** | - | Current timestamp | - | `now()` |
| **updatedAt** | - | Current timestamp | - | `now()` |

---

## Value Transformation Rules

### 1. Nomination Type Mapping

Map CSV values to `NominationType` enum:

| CSV Value | Enum Value | Arabic | Notes |
|-----------|------------|---------|-------|
| "Party" | `Party` | حزب | Party nomination |
| "Independent" | `Independent` | مستقل | Independent candidate |
| "Coalition" | `Coalition` | تحالف | Coalition/Alliance |
| "Individual" | `Individual` | فردي | Individual nomination |
| "" (empty) | `Independent` | - | Default to Independent |
| Other | `Individual` | - | Fallback |

**Implementation:**
```typescript
function parseNominationType(csvValue: string): NominationType {
  const normalized = csvValue.trim().toLowerCase();

  const mapping: Record<string, NominationType> = {
    'party': 'Party',
    'حزب': 'Party',
    'independent': 'Independent',
    'مستقل': 'Independent',
    'coalition': 'Coalition',
    'alliance': 'Coalition',
    'تحالف': 'Coalition',
    'individual': 'Individual',
    'فردي': 'Individual',
  };

  return mapping[normalized] || 'Independent';
}
```

### 2. Gender Mapping

Map CSV values to `Gender` enum:

| CSV Value | Enum Value | Arabic | Kurdish |
|-----------|------------|---------|----------|
| "Male" | `Male` | ذكر | نێر |
| "Female" | `Female` | أنثى | مێ |
| "M" | `Male` | - | - |
| "F" | `Female` | - | - |
| "" (empty) | ⚠️ ERROR | - | Missing data |

**Implementation:**
```typescript
function parseGender(csvValue: string): Gender {
  const normalized = csvValue.trim().toLowerCase();

  const mapping: Record<string, Gender> = {
    'male': 'Male',
    'm': 'Male',
    'ذكر': 'Male',
    'نێر': 'Male',
    'female': 'Female',
    'f': 'Female',
    'أنثى': 'Female',
    'مێ': 'Female',
  };

  const gender = mapping[normalized];
  if (!gender) {
    throw new Error(`Invalid gender value: "${csvValue}"`);
  }

  return gender;
}
```

### 3. Governorate Normalization

Normalize governorate names to match canonical list:

**Canonical Governorates (18):**
```
Al Anbar, Al-Qādisiyyah, Babil, Baghdad, Basra,
Dhi Qar, Diyala, Dohuk, Erbil, Karbala, Kirkuk,
Maysan, Muthanna, Najaf, Nineveh, Saladin,
Sulaymaniyah, Wasit
```

**CSV Variations → Canonical:**
| CSV Value | Canonical | Code |
|-----------|-----------|------|
| "Baghdad" | "Baghdad" | BGD |
| "Bagdad" | "Baghdad" | BGD |
| "Basra" | "Basra" | BAS |
| "Basrah" | "Basra" | BAS |
| "Erbil" | "Erbil" | ERB |
| "Arbil" | "Erbil" | ERB |
| "Irbil" | "Erbil" | ERB |
| "Sulaymaniyah" | "Sulaymaniyah" | SUL |
| "Sulaimaniya" | "Sulaymaniyah" | SUL |
| "Nineveh" | "Nineveh" | NIN |
| "Ninawa" | "Nineveh" | NIN |
| "Al Anbar" | "Al Anbar" | ANB |
| "Anbar" | "Al Anbar" | ANB |

**Implementation:**
```typescript
const GOVERNORATE_ALIASES: Record<string, string> = {
  'bagdad': 'Baghdad',
  'baghdad': 'Baghdad',
  'basrah': 'Basra',
  'basra': 'Basra',
  'arbil': 'Erbil',
  'irbil': 'Erbil',
  'erbil': 'Erbil',
  'sulaimaniya': 'Sulaymaniyah',
  'sulaymaniyah': 'Sulaymaniyah',
  'ninawa': 'Nineveh',
  'nineveh': 'Nineveh',
  'anbar': 'Al Anbar',
  'al anbar': 'Al Anbar',
  // ... add more
};

function normalizeGovernorate(csvValue: string): string | null {
  const normalized = csvValue.trim().toLowerCase();
  return GOVERNORATE_ALIASES[normalized] || null;
}
```

### 4. Party Lookup & Creation

**Strategy:** Create/Update Party records on-the-fly during candidate import.

1. **Extract party name** from `Name on ballot` column
2. **Normalize** (trim, title case)
3. **Check if exists** in Party table by exact name match
4. **If not exists:**
   - Create new Party record
   - Generate UUID
   - Set `ballotNumber` from column "A"
   - Set `name` from column "Name on ballot"
   - Leave other fields (`nameArabic`, `logoUrl`, etc.) as `null` for later enrichment
5. **Return party ID**

**Deduplication:** Use exact name matching (case-insensitive) to prevent duplicate parties.

---

## Data Quality Rules

### Validation Checks

| Check | Rule | Action on Failure |
|-------|------|-------------------|
| **Required Fields** | `fullName`, `candidateSequence`, `gender` must not be null/empty | Skip row, log error |
| **Name Length** | `fullName` between 2-100 characters | Skip row, log error |
| **Sequence Range** | `candidateSequence` between 1-10000 | Skip row, log error |
| **Unique Voter Number** | `voterNumber` (if present) must be unique | Mark as duplicate candidate |
| **Gender Valid** | `gender` must map to Male/Female | Skip row, log error |
| **Governorate Valid** | `governorate` must match canonical list (if present) | Set to null, log warning |

### Data Cleaning

**Before Import:**
1. **Trim all string values** - Remove leading/trailing whitespace
2. **Normalize line breaks** - Replace `\r\n` with `\n`
3. **Remove null bytes** - Strip `\0` characters
4. **Fix encoding** - Ensure UTF-8 encoding
5. **Normalize Arabic** - Remove diacritics if causing matching issues

**During Import:**
1. **Title case names** - Convert to proper capitalization
2. **Standardize governorates** - Use canonical names
3. **Parse enums** - Map to defined enum values
4. **Generate IDs** - Create UUIDs for all records

---

## Deduplication Strategy

### Matching Levels

#### Level 1: Strict Match (Exact Duplicate)
**Rule:** Same `voterNumber` (if present)
**Action:** Skip duplicate, increment duplicate counter

#### Level 2: Strong Match (Very Likely Same Person)
**Rules:**
- Normalized `fullName` matches exactly (after lowercase + trim)
- AND `gender` matches
- AND `governorate` matches
- AND `candidateSequence` within ±2

**Action:** Flag for manual review, store in `duplicates` relationship

#### Level 3: Fuzzy Match (Possible Duplicate)
**Rules:**
- Levenshtein distance of `fullName` < 3
- AND `gender` matches
- AND `governorate` matches

**Action:** Flag for manual review, store in `duplicates` relationship

### Merge Process

When duplicates are confirmed:
1. **Select Primary** - The record with most complete data
2. **Merge Data** - Copy missing fields from secondary to primary
3. **Update References** - Point secondary's `duplicateOfId` to primary
4. **Store Merge History** - Add secondary's ID to primary's `mergedFrom` array
5. **Mark as Verified** - Set `verifiedUnique = true` on primary

**Implementation:**
```typescript
async function mergeCandidates(primaryId: string, secondaryId: string) {
  const primary = await prisma.electionCandidate.findUnique({ where: { id: primaryId } });
  const secondary = await prisma.electionCandidate.findUnique({ where: { id: secondaryId } });

  // Merge missing fields
  const merged = {
    fullNameArabic: primary.fullNameArabic || secondary.fullNameArabic,
    fullNameKurdish: primary.fullNameKurdish || secondary.fullNameKurdish,
    phone: primary.phone || secondary.phone,
    email: primary.email || secondary.email,
    // ... merge other fields
    mergedFrom: [...(primary.mergedFrom || []), secondaryId],
    verifiedUnique: true,
  };

  // Update primary
  await prisma.electionCandidate.update({
    where: { id: primaryId },
    data: merged,
  });

  // Mark secondary as duplicate
  await prisma.electionCandidate.update({
    where: { id: secondaryId },
    data: {
      duplicateOfId: primaryId,
    },
  });
}
```

---

## ETL Pipeline Steps

### Step 1: Pre-Processing (Python/Node.js)

```bash
Input: ElectionCandidates_Original.csv (7,769 rows)
Output: cleaned_candidates.json
```

**Tasks:**
1. Read CSV with proper encoding (UTF-8)
2. Clean data (trim, normalize, validate)
3. Map columns to database fields
4. Validate all required fields
5. Normalize governorates & parties
6. Output to JSON for database import

**Error Handling:**
- Log all skipped rows with reason
- Generate validation report
- Track statistics (processed, imported, failed)

### Step 2: Party & Governorate Pre-load

```bash
Input: Unique parties and governorates from CSV
Output: Database records for Party and Governorate
```

**Tasks:**
1. Extract unique party names from CSV
2. Create Party records (with ballot numbers)
3. Extract unique governorate names
4. Match to canonical governorate list
5. Create/update Governorate records

### Step 3: Candidate Import (Prisma)

```bash
Input: cleaned_candidates.json
Output: Database records for ElectionCandidate
```

**Tasks:**
1. Begin database transaction
2. For each candidate:
   a. Lookup Party by name → get `partyId`
   b. Lookup Governorate by name → get `governorateId`
   c. Create ElectionCandidate record with all mapped fields
   d. Store raw CSV data in `rawData` JSON field
3. Commit transaction
4. Generate import report

**Batch Size:** 100 candidates per transaction (for performance)

### Step 4: Deduplication Pass

```bash
Input: All ElectionCandidate records
Output: Flagged duplicates and merged records
```

**Tasks:**
1. Run Level 1 matching (voterNumber)
2. Run Level 2 matching (name + gender + governorate)
3. Run Level 3 matching (fuzzy name)
4. Generate duplicate report for manual review
5. Auto-merge confirmed duplicates

### Step 5: Validation & Reporting

```bash
Output: Final import report
```

**Report Includes:**
- Total records processed
- Records successfully imported
- Records skipped (with reasons)
- Duplicates found
- Data quality warnings
- Party statistics (# candidates per party)
- Governorate statistics (# candidates per governorate)
- Gender distribution

---

## Sample ETL Code (TypeScript)

```typescript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

interface CSVRow {
  'A': string;
  'Name on ballot': string;
  'Candidate\n\nSequence': string;
  'H1': string;
  '   Type\n      Nominat-\n            ion': string;
  'Electoral\ndistrict': string;
  'H2': string;
  'Sex': string;
  "Candidate's full name": string;
  'Voter number': string;
}

async function importCandidates(csvPath: string) {
  const results: CSVRow[] = [];

  // Read CSV
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      console.log(`Read ${results.length} rows from CSV`);

      let imported = 0;
      let skipped = 0;

      for (const row of results) {
        try {
          // Map CSV row to database fields
          const candidateData = {
            fullName: row["Candidate's full name"].trim(),
            nameOnBallot: row["Name on ballot"].trim(),
            candidateSequence: parseInt(row["Candidate\n\nSequence"]),
            voterNumber: row["Voter number"]?.trim() || null,
            nominationType: parseNominationType(row["   Type\n      Nominat-\n            ion"]),
            gender: parseGender(row["Sex"]),
            governorateName: row["Electoral\ndistrict"]?.trim() || null,
            partyName: row["Name on ballot"].trim(),
            sourceFile: csvPath,
            sourceRowId: results.indexOf(row) + 2, // +2 for header + 0-index
            rawData: row,
          };

          // Lookup/Create Party
          let party = await prisma.party.findFirst({
            where: { name: candidateData.partyName },
          });

          if (!party) {
            party = await prisma.party.create({
              data: {
                name: candidateData.partyName,
                ballotNumber: parseInt(row["A"]),
              },
            });
          }

          // Lookup Governorate
          const governorateId = await lookupGovernorate(candidateData.governorateName);

          // Create Candidate
          await prisma.electionCandidate.create({
            data: {
              ...candidateData,
              partyId: party.id,
              governorateId,
            },
          });

          imported++;
        } catch (error) {
          console.error(`Error importing row ${results.indexOf(row) + 2}:`, error);
          skipped++;
        }
      }

      console.log(`✅ Import complete: ${imported} imported, ${skipped} skipped`);
    });
}
```

---

## Performance Considerations

### Batch Processing

- **Batch size:** 100-500 records per transaction
- **Total time estimate:** ~5-10 minutes for 7,769 candidates
- **Database indexes:** Ensure indexes on `fullName`, `gender`, `governorateId`, `partyId`

### Optimization

1. **Pre-load lookup tables** - Load all Parties and Governorates into memory before candidate import
2. **Use prepared statements** - Prisma's `createMany` for bulk inserts
3. **Disable triggers** during import (if any exist)
4. **Run deduplication after import** - Don't check duplicates during insert (too slow)

---

## Error Handling & Logging

### Log Levels

- **INFO** - Normal progress (e.g., "Processing row 1000/7769")
- **WARN** - Non-critical issues (e.g., "Missing governorate, set to null")
- **ERROR** - Critical failures (e.g., "Required field missing, skipping row")

### Log Format

```typescript
interface ImportLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  rowNumber: number;
  message: string;
  data?: any;
}
```

### Output Files

- `import_YYYYMMDD_HHMMSS.log` - Full log
- `import_YYYYMMDD_HHMMSS_errors.csv` - Skipped rows with reasons
- `import_YYYYMMDD_HHMMSS_report.json` - Summary statistics

---

## Post-Import Verification

### Verification Queries

```sql
-- Total candidates imported
SELECT COUNT(*) FROM "ElectionCandidate";
-- Expected: 7769 (or less if duplicates removed)

-- Gender distribution
SELECT gender, COUNT(*) FROM "ElectionCandidate" GROUP BY gender;

-- Candidates per governorate
SELECT g.name, COUNT(c.id)
FROM "ElectionCandidate" c
LEFT JOIN "Governorate" g ON c."governorateId" = g.id
GROUP BY g.name
ORDER BY COUNT(c.id) DESC;

-- Candidates per party
SELECT p.name, COUNT(c.id)
FROM "ElectionCandidate" c
LEFT JOIN "Party" p ON c."partyId" = p.id
GROUP BY p.name
ORDER BY COUNT(c.id) DESC;

-- Check for missing required fields
SELECT COUNT(*) FROM "ElectionCandidate" WHERE "fullName" IS NULL;
SELECT COUNT(*) FROM "ElectionCandidate" WHERE "gender" IS NULL;

-- Check for duplicates flagged
SELECT COUNT(*) FROM "ElectionCandidate" WHERE "duplicateOfId" IS NOT NULL;
```

---

## Next Steps

1. ✅ **Review this mapping** - Confirm all transformations are correct
2. 🔨 **Write ETL script** - Implement in TypeScript/Node.js or Python
3. 🧪 **Test on sample data** - Run on first 100 rows
4. 📊 **Generate validation report** - Verify data quality
5. ✅ **Import full dataset** - Load all 7,769 candidates
6. 🔍 **Run deduplication** - Find and merge duplicates
7. ✅ **Verify results** - Run verification queries
8. 📝 **Document issues** - Note any data quality problems for manual review

---

**Last Updated:** 2025-10-21
**Version:** 1.0
