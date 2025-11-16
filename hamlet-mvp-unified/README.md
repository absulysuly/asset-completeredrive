# HAMLET MVP - Unified Platform

**Version:** 0.1.0 - MVP Consolidation
**Date:** 2025-11-16
**Status:** 🏗️ Initial Consolidation Complete

---

## 📖 Overview

This is the **unified MVP codebase** for HAMLET, Iraq's civic super-app. This consolidation combines the best building blocks from multiple existing repositories into a clean, focused MVP structure.

### MVP Scope

**INCLUDED:**
1. ✅ **Social Home** - Governorate-based social feed with posts, likes, comments
2. ✅ **Iraq Compass** - Event & place directory by category and governorate

**EXCLUDED (For Later):**
- ❌ Election features (candidates, parties, results)
- ❌ Student/University features
- ❌ Advanced media pipelines

---

## 🏗️ Project Structure

```
hamlet-mvp-unified/
│
├── frontend/              # Next.js 14 app (from hamlet-platform-nextjs)
│   ├── app/
│   │   └── [lang]/       # Multilingual routing (AR/KU/EN)
│   │       ├── page.tsx          # Social home feed
│   │       ├── compass/          # Iraq Compass
│   │       └── ...
│   ├── components/
│   │   ├── social/       # Social feed components
│   │   ├── compass/      # Iraq Compass components (from test-new-frontend)
│   │   ├── layout/       # Shared layout
│   │   └── ui/           # UI primitives
│   ├── dictionaries/     # Translations (AR, EN, KU)
│   └── constants/        # Categories, governorates
│
├── backend/              # Node/Express API (from hamlet-unified-complete-2027)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── social.ts        # Posts, likes, events
│   │   │   ├── compass.ts       # Places, categories (NEW)
│   │   │   └── auth.ts
│   │   └── index.ts
│   └── prisma/
│       └── schema.prisma
│
├── assets/               # Shared assets
│   ├── translations/     # Backup of dictionaries
│   └── icons/
│
├── docs/
│   └── API.md           # API documentation (TODO)
│
├── INVENTORY.md         # **READ THIS FIRST** - Technical inventory
└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for production) or use mock data for development

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

**Available routes:**
- `/en` - English home (social feed)
- `/ar` - Arabic home (RTL)
- `/ku` - Kurdish home (RTL)
- `/en/compass` - Iraq Compass (category grid)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

**Available endpoints:**
- `GET /health` - Health check
- `GET /social/posts` - Get posts
- `POST /social/posts` - Create post
- `GET /social/events` - Get events
- `GET /compass/places` - Get places (TODO)
- `GET /compass/categories` - Get categories (TODO)

---

## 🌍 Languages & i18n

### Supported Languages

1. **Arabic (AR)** - Default, RTL
2. **Kurdish (KU)** - RTL
3. **English (EN)** - LTR

### Translation Files

Located in: `frontend/dictionaries/`

- `ar.json` - Arabic translations
- `en.json` - English translations
- `ku.json` - Kurdish translations

### How to Add Translations

1. Add key to all three dictionary files
2. Use in components:
   ```typescript
   import { getDictionary } from '@/lib/i18n';
   const dict = await getDictionary(lang);
   console.log(dict.yourKey);
   ```

---

## 🗺️ Iraqi Governorates

All 18 Iraqi governorates are supported:

**Federal Iraq (15):**
Baghdad, Basra, Ninawa, Anbar, Diyala, Karbala, Najaf, Wasit, Salah ad Din, Babil, Maysan, Dhi Qar, Muthanna, Qadisiyyah, Kirkuk

**Kurdistan Region (3):**
Erbil, Sulaymaniyah, Dohuk

Governorate filtering works across both Social and Compass features.

---

## 📦 Key Features

### Social Home (Tab 1)

**Components:**
- `PostCard` - Display individual posts
- `ComposeModal` - Create new posts
- `PostDetailModal` - View post details & comments
- `Stories` - Instagram-style stories
- Governorate filter

**API Endpoints:**
- `GET /social/posts?governorate=Baghdad`
- `POST /social/posts`
- `POST /social/like`
- `GET /social/users?governorate=Basra`

### Iraq Compass (Tab 2)

**Components (from test-new-frontend):**
- `CategoryGrid` - 9 main categories
- `BusinessDirectory` - Place listings
- `PersonalizedEvents` - Event cards
- `SubcategoryModal` - Subcategory browser
- `DealsMarketplace` - Deals & promotions

**Categories:**
1. Food & Drink (restaurants, cafes)
2. Shopping (malls, souqs, markets)
3. Events & Entertainment (concerts, festivals)
4. Hospitality (hotels, guesthouses)
5. Arts & Culture (museums, galleries)
6. Fitness & Wellness (gyms, parks)
7. Automotive & Transport
8. Health & Medical
9. Civic & Public Services

**API Endpoints (TODO):**
- `GET /compass/places?governorate=Erbil&category=food_drink`
- `GET /compass/places/:id`
- `GET /compass/events?governorate=Baghdad`
- `GET /compass/categories`

---

## 🚫 What Was Removed (Election Code)

### Frontend (Removed)
- `components/election/` - All election UI components
- `components/candidates/` - Candidate discovery
- `app/[lang]/candidates/` - Candidate pages
- `app/[lang]/stats/` - Election statistics
- Individual components: `CandidatePill`, `DiscoverCandidateCard`, `ElectionHero`

### Backend (Removed)
- `routes/candidatePortal.ts` - All election API endpoints

**These remain in original repos for future integration.**

---

## 🔧 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **i18n:** next-i18next, i18next
- **UI Components:** Headless UI, custom components
- **State:** React hooks (no global state manager yet)

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (production) / Mock data (development)
- **Auth:** TODO - currently mock

---

## 📋 Current Status & Next Steps

### ✅ Completed (Phase 1 - Consolidation)

1. ✅ Created unified folder structure
2. ✅ Copied hamlet-platform-nextjs as frontend base
3. ✅ Removed all election code from frontend
4. ✅ Copied compass components from test-new-frontend
5. ✅ Copied backend from hamlet-unified-complete-2027
6. ✅ Removed election routes from backend
7. ✅ Created placeholder compass API routes
8. ✅ Created compass page route in Next.js
9. ✅ Copied translation dictionaries
10. ✅ Written comprehensive INVENTORY.md

### 🔄 TODO (Phase 2 - Integration)

#### High Priority
1. **Fix Compass Component Imports**
   - Adapt Vite components to Next.js
   - Fix import paths in compass components
   - Test CategoryGrid rendering

2. **Update Navigation**
   - Remove election tabs from sidebar
   - Add Compass tab to bottom bar
   - Ensure mobile navigation works

3. **Wire Backend API**
   - Connect frontend to backend endpoints
   - Test social feed with mock data
   - Implement compass endpoints with mock data

4. **Test Multilingual**
   - Verify AR/KU/EN switching works
   - Test RTL/LTR layouts
   - Ensure all governorate names translated

#### Medium Priority
5. **Create Mock Data for Compass**
   - Add sample places/events to mockData.ts
   - Populate categories in backend
   - Test filtering by governorate & category

6. **Implement Basic Auth**
   - User registration/login
   - JWT tokens
   - Protected routes

7. **Add Loading States**
   - Skeleton screens
   - Loading spinners
   - Error boundaries

#### Low Priority
8. **Documentation**
   - Write API.md
   - Add code comments
   - Create deployment guide

9. **Testing**
   - Unit tests for components
   - API endpoint tests
   - E2E tests for critical flows

---

## 🐛 Known Issues

### Frontend
1. **Compass components use Vite-specific imports**
   - Need to adapt icons.tsx for Next.js
   - Some components may need refactoring

2. **Duplicate translation systems**
   - Both dictionaries/ and translations.ts exist
   - Need to consolidate into one system

3. **Navigation still references election routes**
   - Need to update Sidebar.tsx
   - Remove candidate links

### Backend
1. **Using mock data**
   - No real database connection yet
   - Need to configure Prisma with PostgreSQL

2. **No authentication**
   - All endpoints currently public
   - Need JWT implementation

3. **Compass endpoints not implemented**
   - Only placeholders exist in routes/compass.ts
   - Need to add business logic

---

## 📚 Documentation

### Essential Reads

1. **INVENTORY.md** - Comprehensive technical inventory of all source code
2. **API.md** (TODO) - API endpoint documentation
3. **DEPLOYMENT.md** (TODO) - Deployment instructions

### Codebase References

**Original Source Repositories:**
- `hamlet-platform-nextjs/` - Social frontend source
- `test-new-frontend/` - Compass frontend source
- `hamlet-unified-complete-2027/backend/` - Backend source

**DO NOT delete original repos.** They serve as reference and contain election code for future integration.

---

## 🤝 Contributing

### For Next Developer/AI

When you receive this codebase:

1. **Read INVENTORY.md first** - Understand what was consolidated and why
2. **Review this README** - Understand current status
3. **Check TODO list above** - See what needs to be done next
4. **Test the basics** - Run frontend and backend, verify they start
5. **Fix imports** - Start with compass component integration
6. **Wire APIs** - Connect frontend to backend

### Code Style

- **TypeScript:** Strict mode enabled
- **Components:** Functional components with hooks
- **Naming:** PascalCase for components, camelCase for functions
- **Files:** One component per file
- **Imports:** Absolute imports using `@/` prefix

---

## 🔒 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hamlet
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## 📞 Support & Feedback

### Issues with This Consolidation

If you encounter issues:

1. Check INVENTORY.md for context
2. Review original source repos for reference
3. Check git history for consolidation steps

### Production Deployment

**NOT READY FOR PRODUCTION** - This is an MVP consolidation.

Before deploying:
- [ ] Implement real authentication
- [ ] Connect to real database
- [ ] Set up proper CORS
- [ ] Configure cloud storage for media
- [ ] Add monitoring & logging
- [ ] Perform security audit
- [ ] Load testing
- [ ] Backup strategy

---

## 📄 License

(To be determined by HAMLET project)

---

## 🎯 Project Vision

HAMLET aims to be Iraq's premier civic engagement platform, connecting citizens with their governorates, local businesses, events, and eventually elected representatives.

This MVP focuses on building a strong foundation for:
- Community building (social features)
- Local discovery (Iraq Compass)
- Governorate-based organization
- Multilingual accessibility (AR/KU/EN)

Future phases will add:
- Election monitoring & transparency
- Student/university networks
- Advanced media features
- Direct democracy tools

---

**Built with care for Iraq 🇮🇶**
