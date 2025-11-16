# HAMLET MVP UNIFIED - TECHNICAL INVENTORY

**Date Created:** 2025-11-16
**Purpose:** Consolidate HAMLET social + Iraq Compass code for MVP (excluding election features)
**Created By:** Repository Surgery - Phase 1

---

## 📋 EXECUTIVE SUMMARY

This document inventories the existing HAMLET codebase to guide the creation of a unified MVP platform focusing on:

1. **SOCIAL HOME** - Governorate-based social feed (posts, comments, likes)
2. **IRAQ COMPASS** - Event & place directory by category and governorate

**OUT OF SCOPE FOR MVP:**
- All election functionality (candidates, parties, results, dashboards)
- Student/University features
- Advanced media upload pipelines (reels/stories production)

---

## 🏗️ FRONTENDS INVENTORY

### 1. hamlet-platform-nextjs (PRIMARY SOCIAL FRONTEND)

**Location:** `/home/user/asset-completeredrive/hamlet-platform-nextjs/`

**Tech Stack:**
- Next.js 14.1.4
- React 18
- TypeScript
- Tailwind CSS
- i18next for internationalization

**Strengths:**
- ✅ Complete multilingual system (Arabic, Kurdish, English)
- ✅ RTL/LTR support built-in
- ✅ Governorate-based filtering
- ✅ Social feed components (PostCard, ComposeModal, Stories)
- ✅ Authentication system (LoginModal)
- ✅ Clean modern UI with Headless UI components
- ✅ Server-side rendering with Next.js App Router

**Key Components - SOCIAL (KEEP FOR MVP):**
```
components/
├── PostCard.tsx                    # Social post display
├── ComposeModal.tsx                # Create new post
├── PostDetailModal.tsx             # Post detail view
├── Stories.tsx                     # Stories feature
├── Header.tsx                      # Main header
├── Sidebar.tsx                     # Navigation sidebar
├── BottomBar.tsx                   # Mobile bottom nav
├── LanguageSwitcher.tsx            # AR/KU/EN switcher
├── LoginModal.tsx                  # Authentication
├── EditProfileModal.tsx            # Profile editing
├── SkeletonPostCard.tsx            # Loading states
├── ThemeProvider.tsx               # Dark/light theme
└── home/                           # Home feed components
    └── ...

app/[lang]/                         # i18n routing
├── page.tsx                        # Home feed page
├── layout.tsx                      # Root layout
├── governorates/                   # Governorate pages
└── about/                          # About page
```

**Key Components - ELECTION (ISOLATE/IGNORE FOR MVP):**
```
components/
├── election/                       # ENTIRE FOLDER - ELECTION CODE
│   ├── components/
│   ├── AdminDashboard.tsx
│   ├── CandidateDashboard.tsx
│   └── ... (all election UIs)
├── candidates/                     # ENTIRE FOLDER - ELECTION CODE
├── CandidatePill.tsx               # ELECTION - ignore
├── DiscoverCandidateCard.tsx       # ELECTION - ignore
├── PublicDiscoverCandidateCard.tsx # ELECTION - ignore
└── ElectionHero.tsx                # ELECTION - ignore

app/[lang]/
├── candidates/                     # ELECTION PAGES - ignore
└── stats/                          # ELECTION STATS - ignore
```

**Translation Files (KEEP):**
```
dictionaries/
├── ar.json       # Arabic translations
├── en.json       # English translations
└── ku.json       # Kurdish translations
```

**Services:**
```
services/
└── ... (API integration helpers)
```

---

### 2. test-new-frontend (IRAQ COMPASS / EVENT DIRECTORY)

**Location:** `/home/user/asset-completeredrive/test-new-frontend/`

**Tech Stack:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS

**Strengths:**
- ✅ Category grid system with subcategories
- ✅ Business directory cards
- ✅ Event listing & personalization
- ✅ Deals marketplace
- ✅ Modern glassmorphism UI design
- ✅ Governorate filtering
- ✅ Comprehensive category taxonomy (9 main categories + subcategories)

**Key Components - COMPASS/EVENTS (COPY TO MVP):**
```
components/
├── CategoryGrid.tsx               # Main category grid UI
├── BusinessDirectory.tsx          # Business/place listings
├── PersonalizedEvents.tsx         # Event cards & listings
├── DealsMarketplace.tsx           # Deals/promotions
├── FeaturedBusinesses.tsx         # Featured place cards
├── CityGuide.tsx                  # City guide feature
├── SubcategoryModal.tsx           # Subcategory navigation
├── GovernorateFilter.tsx          # Governorate selector
├── SearchPortal.tsx               # Search functionality
├── HeroSection.tsx                # Hero/banner
├── Header.tsx                     # Header component
├── GlassCard.tsx                  # Reusable card UI
└── icons.tsx                      # Icon library
```

**Data Structures (IMPORTANT):**
```javascript
constants.tsx contains:
- categories[]           # 9 main categories with full subcategory tree
  → food_drink (128 events)
  → shopping (94 events)
  → events_entertainment (72 events)
  → hospitality_accommodation
  → arts_culture
  → fitness_wellness
  → automotive_transport
  → health_medical
  → civic_public_services

- stories[]              # Community stories
- businesses[]           # Business/place data
- events[]               # Event data
- deals[]                # Deal/promotion data
```

**Categories Include:**
1. Food & Drink (restaurants, cafes, quick service)
2. Shopping (malls, souqs, markets, specialty)
3. Events & Entertainment (concerts, festivals, cinema)
4. Hospitality (hotels, guesthouses, camping)
5. Arts & Culture (museums, galleries, heritage sites)
6. Fitness & Wellness (gyms, sports, parks)
7. Automotive & Transport (rentals, repair, parking)
8. Health & Medical (hospitals, clinics, pharmacies)
9. Civic & Public Services (government, utilities, emergency)

---

### 3. HamletUnified (MISCELLANEOUS ATTEMPTS)

**Location:** `/home/user/asset-completeredrive/HamletUnified/`

**Contents:**
```
HamletUnified/
├── Copy-of-Hamlet-social/          # Duplicate of social code
├── hamlet-production/              # Production attempt
├── missinggold_fresh_structure/    # Event directory skeleton (mostly empty)
└── full_consolidation/             # Previous consolidation attempt
```

**Assessment:**
- ⚠️ Contains duplicated/incomplete work
- ⚠️ missinggold_fresh_structure has minimal code (mostly README)
- 💡 Can be ignored in favor of test-new-frontend for event/compass code

---

### 4. Other Frontend Fragments

**Location:** Root directory has loose component files:
```
/home/user/asset-completeredrive/
├── PostCard.tsx
├── Header.tsx
├── Sidebar.tsx
├── ComposeModal.tsx
└── ... (loose component files - duplicates from hamlet-platform-nextjs)
```

**Assessment:**
- These are duplicates/backups of components already in hamlet-platform-nextjs
- Can be ignored for consolidation

---

## 🖥️ BACKENDS INVENTORY

### 1. hamlet-unified-complete-2027/backend (PRIMARY BACKEND)

**Location:** `/home/user/asset-completeredrive/hamlet-unified-complete-2027/backend/`

**Tech Stack:**
- Node.js + Express
- TypeScript
- Prisma ORM (@prisma/client 5.18.0)
- CORS enabled
- Multer for file uploads

**Source Structure:**
```
src/
├── index.ts              # Express app entry point
├── config.ts             # Configuration
├── types.ts              # TypeScript types
├── mockData.ts           # Mock data for development
├── routes/
│   ├── auth.ts           # Authentication endpoints
│   ├── social.ts         # SOCIAL endpoints (posts, events, likes)
│   ├── candidatePortal.ts # ELECTION endpoints (ignore for MVP)
│   ├── civic.ts          # Civic engagement endpoints
│   └── facebook.ts       # Facebook integration
├── services/
│   └── ... (business logic)
└── lib/
    └── ... (utilities)

prisma/
└── schema.prisma         # Database schema
```

**Key Endpoints - SOCIAL (KEEP FOR MVP):**

From `routes/social.ts`:
```typescript
GET  /users                      # List users by role/governorate
GET  /posts                      # Get posts (by type, governorate, author)
POST /posts                      # Create new post
POST /reels                      # Create new reel
GET  /events                     # Get events by governorate
POST /events                     # Create new event
GET  /debates                    # Get debates
GET  /articles                   # Get articles
POST /follow                     # Follow a user
POST /like                       # Like a post
```

**Supported Entities:**
- User (with governorate, role)
- Post (with governorates[], likes, comments, shares)
- Reel (video posts)
- Event (with governorate, organizer, date, location)
- Debate
- Article

**Key Endpoints - ELECTION (IGNORE FOR MVP):**

From `routes/candidatePortal.ts`:
```typescript
POST /candidate-portal/register  # Candidate registration
GET  /candidate-portal/profile   # Candidate profile
POST /candidate-portal/update    # Update candidate info
... (all candidate/election endpoints)
```

**Database:**
- Uses Prisma ORM
- Has migration scripts
- Seed script available

**Mock Data Available:**
- `mockData.ts` contains sample users, posts, events, debates, articles
- Good for MVP development without full database

---

### 2. unified-hamlet-backend

**Location:** `/home/user/asset-completeredrive/unified-hamlet-backend/`

**Assessment:**
- Appears to be another backend attempt
- Likely duplicate/alternative to hamlet-unified-complete-2027/backend
- **Recommendation:** Use hamlet-unified-complete-2027/backend as primary

---

## 📦 SHARED ASSETS INVENTORY

### 1. Translation Files

**Primary Location:** `hamlet-platform-nextjs/dictionaries/`

```
ar.json (Arabic)    - 5,153 bytes - Complete translations
en.json (English)   - 4,121 bytes - Complete translations
ku.json (Kurdish)   - 5,949 bytes - Complete translations
```

**Translation Keys Include:**
- `common.*` - Common UI strings
- `categories.*` - Category names
- `subcategories.*` - Subcategory names
- `nav.*` - Navigation labels
- `auth.*` - Authentication strings
- `post.*` - Post-related strings
- `profile.*` - Profile strings
- `governorates.*` - Governorate names

**Also Found:**
- `hamlet-platform-nextjs/translations.ts` - Large translation file (59KB)
- Appears to be inline translations (might duplicate dictionary files)

### 2. UI Component Systems

**Location:** Various

```
hamlet-platform-nextjs/components/UI/
└── ... (shared UI components)

test-new-frontend/components/
├── GlassCard.tsx           # Reusable card component
└── icons.tsx               # Icon library (19KB)
```

### 3. Icons

**Locations:**
- `test-new-frontend/components/icons.tsx` - Comprehensive icon set
- `hamlet-platform-nextjs/components/icons/` - Icon components
- Root `/icons/` - Additional icons

### 4. Constants & Configuration

**Category Taxonomy:**
- `test-new-frontend/constants.tsx` - Complete category/subcategory tree

**App Constants:**
- `hamlet-platform-nextjs/constants.ts` - App-level constants (20KB)

### 5. Color System & Theming

**Locations:**
- `hamlet-platform-nextjs/tailwind.config.ts` - Tailwind theme
- `hamlet-platform-nextjs/app/globals.css` - Global styles with CSS variables
- Theme provider in `components/ThemeProvider.tsx`

---

## 🗳️ ELECTION CODE ISOLATION

### Frontend Election Code (TO IGNORE FOR MVP)

**Primary Location:** `hamlet-platform-nextjs/`

**Directories:**
```
components/election/                    # ENTIRE FOLDER - ELECTION
├── components/
│   ├── AdminDashboard.tsx
│   ├── CandidateDashboard.tsx
│   ├── ElectionResults.tsx
│   ├── VoterDashboard.tsx
│   ├── ManagementPageHeader.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Button.tsx
│       └── ...
└── ... (all election-specific components)

components/candidates/                  # CANDIDATE DISCOVERY - ELECTION
└── ...

app/[lang]/candidates/                  # CANDIDATE PAGES - ELECTION
└── ...

app/[lang]/stats/                       # ELECTION STATS - ELECTION
└── ...
```

**Individual Components:**
```
components/
├── CandidatePill.tsx                  # ELECTION
├── DiscoverCandidateCard.tsx          # ELECTION
├── PublicDiscoverCandidateCard.tsx    # ELECTION
├── ElectionHero.tsx                   # ELECTION
└── ContactMPForm.tsx                  # ELECTION (maybe civic?)
```

**Election Folder:**
```
/election/                              # Standalone election module
├── components/
├── hooks/
├── icons/
├── pages/
├── services/
└── types.ts
```

### Backend Election Code (TO IGNORE FOR MVP)

**Primary Location:** `hamlet-unified-complete-2027/backend/`

**Routes:**
```
src/routes/
└── candidatePortal.ts                 # ALL ELECTION ENDPOINTS
```

**Data:**
```
/candidate_list.csv                     # Election candidate data (1.1MB)
/clean_election_data/                   # Processed election data
```

### How Election Features Are Disabled for MVP

**Strategy:**
1. **Frontend:**
   - Do NOT copy `components/election/` folder
   - Do NOT copy `components/candidates/` folder
   - Do NOT copy `app/[lang]/candidates/` pages
   - Do NOT copy `app/[lang]/stats/` pages
   - Remove navigation links to candidate/election pages
   - Feature-flag or comment out election tabs in navigation

2. **Backend:**
   - Do NOT include `routes/candidatePortal.ts` in server
   - Remove candidate endpoints from API documentation
   - Keep election tables in DB schema but unpopulated

3. **Navigation:**
   - Remove "Candidates" tab from main navigation
   - Remove "Election Results" from sidebar
   - Remove "Discover Candidates" sections

**Preserved for Future:**
- All election code remains in original repos
- Can be re-integrated after MVP by copying folders back
- Database schema supports election data (just unused in MVP)

---

## 🎯 CONSOLIDATION DECISIONS

### Chosen Frontend Base for SOCIAL

**Choice: hamlet-platform-nextjs**

**Reasons:**
1. ✅ Complete Next.js 14 app with App Router
2. ✅ Full i18n system (AR/KU/EN) already working
3. ✅ RTL/LTR support built-in
4. ✅ Governorate filtering already implemented
5. ✅ Social feed, posts, comments, likes already built
6. ✅ Modern, production-ready code structure
7. ✅ TypeScript throughout
8. ✅ Authentication system included

**Will Copy:**
- Core app structure (`app/`, `components/`, `lib/`)
- Social components (excluding election ones)
- Translation dictionaries
- Services & API integration
- Layouts & navigation
- Theme system

**Will Exclude:**
- `components/election/` folder
- `components/candidates/` folder
- Election-specific pages
- Candidate-related components

---

### Chosen Frontend Base for IRAQ COMPASS / EVENTS

**Choice: test-new-frontend**

**Reasons:**
1. ✅ Complete category grid system with 9 main categories
2. ✅ Rich subcategory taxonomy
3. ✅ Business/place card components
4. ✅ Event listing components
5. ✅ Modern glassmorphism UI
6. ✅ Governorate filtering
7. ✅ Deals/marketplace features
8. ✅ Well-structured constants for categories

**Will Copy:**
- CategoryGrid component → `frontend/src/features/compass/`
- BusinessDirectory component
- PersonalizedEvents component
- Place/business card components
- Category constants and data structures
- Icon library (merge with social icons)

**Integration Plan:**
- Add as new route `/compass` in Next.js app
- Create `app/[lang]/compass/page.tsx`
- Merge category translations into dictionaries
- Share governorate filter with social feed

---

### Chosen Backend for MVP

**Choice: hamlet-unified-complete-2027/backend**

**Reasons:**
1. ✅ Already has Express + TypeScript setup
2. ✅ Prisma ORM configured
3. ✅ Social endpoints already implemented (GET/POST posts, events, etc.)
4. ✅ Mock data for development
5. ✅ Governorate support in data models
6. ✅ CORS configured for frontend integration

**Will Use:**
- Core Express app (`src/index.ts`, `src/config.ts`)
- Social routes (`routes/social.ts`)
- Civic routes (`routes/civic.ts`)
- Auth routes (`routes/auth.ts`)
- Prisma schema (minus election tables)
- Mock data (filtered to non-election content)

**Will Exclude:**
- `routes/candidatePortal.ts` (election endpoints)
- Election-related services
- Candidate data processing scripts

**Will Add:**
- New routes for Iraq Compass:
  - `GET /places` - Get places by governorate & category
  - `GET /places/:id` - Get place details
  - `GET /events` - Get events (enhance existing endpoint)
  - `GET /events/:id` - Get event details
  - `GET /categories` - Get category taxonomy

---

## 📁 PROPOSED UNIFIED STRUCTURE

```
hamlet-mvp-unified/
│
├── frontend/                           # Unified Next.js app
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── page.tsx               # Social home feed
│   │   │   ├── compass/
│   │   │   │   ├── page.tsx           # Compass category grid
│   │   │   │   ├── [category]/
│   │   │   │   │   └── page.tsx       # Category listings
│   │   │   │   └── events/
│   │   │   │       └── page.tsx       # Events listing
│   │   │   ├── profile/
│   │   │   │   └── page.tsx           # User profile
│   │   │   ├── about/
│   │   │   │   └── page.tsx           # About page
│   │   │   └── layout.tsx             # Root layout
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── social/                    # From hamlet-platform-nextjs
│   │   │   ├── PostCard.tsx
│   │   │   ├── ComposeModal.tsx
│   │   │   ├── PostDetailModal.tsx
│   │   │   └── Stories.tsx
│   │   ├── compass/                   # From test-new-frontend
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── PlaceCard.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── BusinessDirectory.tsx
│   │   │   └── SubcategoryModal.tsx
│   │   ├── layout/                    # Shared layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomBar.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── ui/                        # Shared UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── GlassCard.tsx
│   │   └── auth/
│   │       └── LoginModal.tsx
│   │
│   ├── lib/
│   │   ├── i18n.ts                    # i18n configuration
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── api.ts                     # API client
│   │   ├── socialService.ts           # Social feed API calls
│   │   └── compassService.ts          # Compass/events API calls
│   │
│   ├── dictionaries/
│   │   ├── ar.json
│   │   ├── en.json
│   │   └── ku.json
│   │
│   ├── constants/
│   │   ├── categories.ts              # Iraq Compass categories
│   │   ├── governorates.ts            # Iraqi governorates
│   │   └── config.ts
│   │
│   ├── types/
│   │   ├── social.ts
│   │   ├── compass.ts
│   │   └── common.ts
│   │
│   ├── public/
│   │   └── ... (static assets)
│   │
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                            # Node/Express API
│   ├── src/
│   │   ├── index.ts                   # Express app entry
│   │   ├── config.ts
│   │   ├── types.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── social.ts              # Posts, likes, comments
│   │   │   ├── compass.ts             # Places, events, categories (NEW)
│   │   │   └── civic.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── socialService.ts
│   │   │   └── compassService.ts      # NEW
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   └── mockData/
│   │       ├── users.ts
│   │       ├── posts.ts
│   │       ├── events.ts
│   │       └── places.ts              # NEW
│   │
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema (MVP subset)
│   │   └── seed.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── assets/                             # Shared assets
│   ├── icons/
│   │   └── ... (merged icon set)
│   ├── images/
│   │   └── ...
│   └── translations/
│       └── ... (backup of dictionaries)
│
├── docs/
│   └── API.md                         # API documentation
│
├── INVENTORY.md                        # This file
├── README.md                           # Project README
└── .gitignore
```

---

## 🚧 WHAT'S WORKING NOW (STRUCTURALLY)

### ✅ Completed
1. Created `hamlet-mvp-unified/` folder structure
2. Documented all existing codebases
3. Identified election code to isolate
4. Chosen primary frontend/backend bases
5. Planned unified structure

### 🔄 Ready for Next Phase
The following are structurally ready but need implementation:

**Frontend:**
- Copy hamlet-platform-nextjs as base → `frontend/`
- Copy test-new-frontend compass components → `frontend/components/compass/`
- Remove election components/pages
- Update navigation to show only Home + Compass tabs
- Merge translation files
- Create compass routes in Next.js

**Backend:**
- Copy hamlet-unified-complete-2027/backend → `backend/`
- Remove candidatePortal routes
- Add new compass routes (places, categories)
- Update mock data for places/categories
- Test existing social endpoints

**Integration:**
- Wire frontend to backend API
- Test social feed with real/mock data
- Test compass with category data
- Verify i18n working across both features

---

## 📝 STILL TODO

### High Priority
1. **Copy & Clean Frontend Code**
   - Copy hamlet-platform-nextjs to frontend/
   - Remove all election components/pages/routes
   - Update navigation (remove election tabs)
   - Verify i18n still works

2. **Integrate Compass Components**
   - Copy test-new-frontend components to frontend/components/compass/
   - Create /compass routes in Next.js
   - Merge category constants
   - Add compass translations to dictionaries

3. **Setup Backend**
   - Copy backend code
   - Remove election routes
   - Add compass routes
   - Create mock data for places/events

4. **Wire API Integration**
   - Connect frontend to backend
   - Test social endpoints
   - Test compass endpoints
   - Add loading/error states

### Medium Priority
5. **Create Shared Navigation**
   - Bottom bar with: Home | Compass | Profile
   - Ensure governorate filter works across both

6. **Testing & Validation**
   - Test all 18 governorates
   - Test AR/KU/EN languages
   - Test RTL/LTR switching
   - Test on mobile/desktop

### Low Priority
7. **Documentation**
   - Write API.md
   - Write README.md
   - Add code comments
   - Document deployment

---

## ⚠️ CAVEATS & "DON'T TOUCH" NOTES

### Don't Touch (Keep Original)
1. **Original Repos:**
   - DO NOT delete hamlet-platform-nextjs
   - DO NOT delete test-new-frontend
   - DO NOT delete hamlet-unified-complete-2027
   - These are source repos for reference

2. **Election Code:**
   - DO NOT delete election code from source repos
   - Only exclude from MVP copy, not from originals
   - Preserve for post-MVP integration

3. **Database Schema:**
   - Keep full Prisma schema (including election tables)
   - Just don't populate election tables in MVP
   - Easier to add later than to migrate

### Known Issues
1. **test-new-frontend** uses Vite, MVP uses Next.js
   - Need to adapt components (should be straightforward)
   - Icons might need conversion

2. **Duplicate Translation Systems**
   - hamlet-platform-nextjs has both dictionaries/ and translations.ts
   - Need to consolidate into single system

3. **Icon Libraries**
   - Multiple icon sources need merging
   - Use react-icons as primary, supplement with custom

4. **Category Data**
   - Currently in constants.tsx (test-new-frontend)
   - Should move to backend API for production
   - Keep in frontend constants for MVP

### Future Considerations
1. **Backend Database:**
   - Currently using mock data
   - Need to connect Prisma to real DB (PostgreSQL recommended)
   - Run migrations before production

2. **Authentication:**
   - Mock auth in place
   - Need real auth system (JWT, OAuth, etc.)
   - Consider Iraqi phone number auth

3. **Media Uploads:**
   - Multer configured but not fully implemented
   - Need cloud storage (S3, Cloudinary, etc.)
   - Image optimization needed

4. **Performance:**
   - Add pagination to posts/events
   - Implement infinite scroll
   - Cache category data
   - Optimize images

---

## 📊 DATA MODELS SUMMARY

### From Backend Prisma Schema

**Core Models (MVP):**
```prisma
model User {
  id          String
  name        String
  email       String
  governorate Governorate
  role        String      // citizen, candidate, official, etc.
  avatar      String?
  posts       Post[]
  events      Event[]
}

model Post {
  id           String
  content      String
  author       User
  governorates Governorate[]
  likes        Int
  comments     Int
  shares       Int
  type         String       // Post | Reel
  mediaUrl     String?
  timestamp    DateTime
}

model Event {
  id          String
  title       String
  date        String
  location    String
  governorate Governorate
  organizer   User
  category    String?      // NEW - for Compass integration
}
```

**New Models Needed (Iraq Compass):**
```prisma
model Place {
  id          String
  name        String
  description String
  governorate Governorate
  category    String
  subcategory String?
  address     String?
  coordinates Json?
  images      String[]
  rating      Float?
  reviews     Int?
  verified    Boolean
}

model Category {
  id             String
  nameKey        String      // Translation key
  icon           String      // Icon identifier
  eventCount     Int
  recommended    Boolean
  subcategories  Subcategory[]
}

model Subcategory {
  id       String
  nameKey  String
  icon     String?
  count    Int
  parent   Category
}
```

**Governorate Enum:**
```typescript
enum Governorate {
  Baghdad, Basra, Ninawa, Erbil, Sulaymaniyah, Dohuk,
  Anbar, Diyala, Karbala, Najaf, Wasit, Salah_ad_Din,
  Babil, Maysan, Dhi_Qar, Muthanna, Qadisiyyah, Kirkuk
}
```

---

## 🎨 DESIGN SYSTEM NOTES

### Color Palette (from Tailwind configs)

**Primary Colors:**
- Primary: Blue/Purple gradient
- Accent: Orange/Red
- Background: Dark (#0a0a0a to #1a1a1a)

**Glassmorphism:**
- backdrop-blur-xl
- bg-white/10 borders
- Gradient overlays

### Typography
- Font: System fonts (optimized for Arabic/Kurdish)
- RTL support via Tailwind dir utilities

### Components Style
- Rounded corners (rounded-2xl)
- Shadows with glow effects
- Smooth transitions
- Mobile-first responsive

---

## 🌍 INTERNATIONALIZATION (i18n)

### Languages Supported
1. **Arabic (AR)** - RTL, primary language
2. **Kurdish (KU)** - RTL, regional
3. **English (EN)** - LTR, secondary

### Implementation
- Next.js middleware for locale detection
- Dictionary files for static translations
- Dynamic routing: `/[lang]/...`
- RTL/LTR switching in layout

### Governorate Names (need all 3 languages)
```
Baghdad    → بغداد      → بەغدا
Basra      → البصرة    → بەسرە
Ninawa     → نينوى     → نەینەوا
Erbil      → أربيل     → هەولێر
...
```

---

## 🔐 AUTHENTICATION SYSTEM

### Current Implementation
- LoginModal component (hamlet-platform-nextjs)
- Mock auth (no real backend integration yet)
- User roles: citizen, candidate, official, admin

### MVP Requirements
- Email/password login (basic)
- Guest browsing (read-only)
- Profile creation with governorate selection

### Future
- Phone number auth (Iraqi numbers)
- Social login (Google, Facebook)
- Two-factor authentication
- Verified badges

---

## 📱 RESPONSIVE DESIGN

### Breakpoints (Tailwind)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

### Mobile Navigation
- Bottom bar (Home, Compass, Profile)
- Hamburger menu for additional options

### Desktop Navigation
- Sidebar (always visible)
- Top header with search
- 3-column layout (sidebar, feed, widgets)

---

## 🚀 DEPLOYMENT NOTES

### Frontend
- Platform: Vercel (Next.js optimized)
- Build: `npm run build`
- Environment variables needed:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_ENV

### Backend
- Platform: Railway / Render / DigitalOcean
- Database: PostgreSQL
- Environment variables needed:
  - DATABASE_URL
  - PORT
  - NODE_ENV
  - CORS_ORIGIN

---

## 📚 NEXT STEPS FOR IMPLEMENTATION TEAM

1. **Read this entire INVENTORY.md** to understand the codebase landscape

2. **Review Proposed Structure** in section above

3. **Begin Frontend Consolidation:**
   ```bash
   # Copy hamlet-platform-nextjs to frontend/
   cp -r hamlet-platform-nextjs/* hamlet-mvp-unified/frontend/

   # Remove election code
   rm -rf hamlet-mvp-unified/frontend/components/election
   rm -rf hamlet-mvp-unified/frontend/components/candidates
   rm -rf hamlet-mvp-unified/frontend/app/[lang]/candidates
   rm -rf hamlet-mvp-unified/frontend/app/[lang]/stats

   # Copy compass components
   mkdir -p hamlet-mvp-unified/frontend/components/compass
   cp test-new-frontend/components/{CategoryGrid,BusinessDirectory,PersonalizedEvents,DealsMarketplace,FeaturedBusinesses,CityGuide,SubcategoryModal}.tsx \
      hamlet-mvp-unified/frontend/components/compass/
   ```

4. **Begin Backend Consolidation:**
   ```bash
   # Copy backend
   cp -r hamlet-unified-complete-2027/backend/* hamlet-mvp-unified/backend/

   # Remove election routes
   rm hamlet-mvp-unified/backend/src/routes/candidatePortal.ts

   # Update index.ts to not import candidatePortal
   ```

5. **Update Navigation** (remove election links)

6. **Test & Iterate**

---

## 📞 QUESTIONS FOR PRODUCT TEAM

(To be answered before finalizing implementation)

1. **Governorate Filtering:**
   - Should users see "All Iraq" by default or pre-select their governorate?
   - Can users follow multiple governorates?

2. **Content Moderation:**
   - Who can post? (all users vs. verified only)
   - Moderation strategy for MVP?

3. **Iraq Compass Data:**
   - Will places/events be admin-curated or user-generated?
   - Verification system for businesses?

4. **Language Preference:**
   - Auto-detect from browser or force selection?
   - Remember language choice per user?

5. **Mobile App:**
   - Is React Native app planned?
   - Should we use Next.js API routes or separate REST API?

---

## ✅ CONSOLIDATION CHECKLIST

- [x] Inventory all existing repos
- [x] Document tech stacks
- [x] Identify election code locations
- [x] Choose primary frontend (hamlet-platform-nextjs)
- [x] Choose primary backend (hamlet-unified-complete-2027/backend)
- [x] Choose compass frontend (test-new-frontend)
- [x] Map out data models
- [x] Plan unified folder structure
- [ ] Copy frontend code to unified folder
- [ ] Remove election components
- [ ] Copy compass components
- [ ] Update navigation
- [ ] Copy backend code
- [ ] Remove election routes
- [ ] Add compass routes
- [ ] Test social endpoints
- [ ] Test compass endpoints
- [ ] Wire frontend to backend
- [ ] Test end-to-end flows
- [ ] Update README
- [ ] Document API

---

**END OF INVENTORY**

*This document will be updated as consolidation progresses.*
