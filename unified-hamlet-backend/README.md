# Unified Hamlet Backend

**Production-Ready Iraqi Election Platform API**

Unified backend combining election candidate data (7,769+ candidates) with social platform features.

---

## 🎯 **What This Is**

A complete, production-ready Express.js + TypeScript + Prisma backend that serves:
- **7,769+ Iraqi election candidates** from CSV data
- **Social platform features** (posts, reels, events, debates)
- **Civic data** (18 governorates, parties, statistics)
- **RESTful API** with pagination, filtering, and search

---

## 🚀 **Quick Start**

### **Option 1: Docker Compose (Recommended)**

```bash
# Start PostgreSQL database
docker-compose up -d postgres

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and set DATABASE_URL

# Run Prisma migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### **Option 2: Local Setup**

```bash
# Prerequisites: PostgreSQL 15+, Node.js 18+

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development
npm run dev
```

Server will be available at: **http://localhost:4001**

---

## 📊 **Importing Candidate Data**

### **Step 1: Prepare CSV File**

Copy your candidate CSV to `data/`:

```bash
mkdir -p data
cp /path/to/ElectionCandidates_Original.csv data/
```

### **Step 2: Run Import**

```bash
# Test import (first 100 candidates)
npm run import:test

# Full import (all candidates)
npm run import:candidates
```

### **Step 3: Verify**

```bash
# Open Prisma Studio
npm run prisma:studio

# Or check via API
curl http://localhost:4001/api/candidates/stats/overview
```

---

## 📡 **API Endpoints**

### **Health Check**
```http
GET /health
```
Returns server health status and database connectivity.

### **Candidates**

```http
GET /api/candidates
  ?page=1
  &limit=20
  &governorate=Baghdad
  &gender=Female
  &party=KDP
  &search=Ahmed
  &sort=name
  &order=asc
```

```http
GET /api/candidates/:id
```

```http
GET /api/candidates/stats/overview
```

```http
GET /api/candidates/trending?limit=6
```

### **Civic Data**

```http
GET /api/civic/governorates
```

```http
GET /api/civic/governorates/:slug
```

```http
GET /api/civic/parties
```

### **Social Features (Stubs)**

```http
GET /api/social/posts
GET /api/social/events
GET /api/social/debates
```

### **Authentication (Stubs)**

```http
POST /api/auth/login
POST /api/auth/register
```

---

## 🗄️ **Database Schema**

### **Core Models**

- **ElectionCandidate** - 7,769+ Iraqi candidates with full details
- **Party** - Political parties with ballot numbers
- **Governorate** - 18 Iraqi governorates
- **User** - Social platform users
- **Post**, **Event**, **Debate**, **Article** - Social features

### **Schema Features**

✅ Deduplication tracking (`duplicateOfId`, `mergedFrom`)
✅ Multi-language support (Arabic, Kurdish, English)
✅ Audit trails (`sourceFile`, `rawData`, `AuditLog`)
✅ Data quality tracking (`verifiedUnique`, `DataImport`)

---

## 🛠️ **Development**

### **Available Scripts**

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server

npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)

npm run import:candidates # Import all candidates from CSV
npm run import:test      # Import first 100 (for testing)

npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### **Project Structure**

```
unified-hamlet-backend/
├── src/
│   ├── index.ts                 # Express server
│   ├── routes/
│   │   ├── candidates.ts        # Candidate endpoints
│   │   ├── civic.ts             # Governorate/party endpoints
│   │   ├── social.ts            # Social features (stubs)
│   │   ├── auth.ts              # Authentication (stubs)
│   │   └── health.ts            # Health check
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── requestLogger.ts     # Request logging
│   └── utils/
│       └── logger.ts            # Winston logger
├── prisma/
│   └── schema.prisma            # Database schema
├── scripts/
│   └── import-candidates.ts     # CSV import script
├── data/
│   └── ElectionCandidates_Original.csv
├── docker-compose.yml           # PostgreSQL setup
├── Dockerfile                   # Production container
└── package.json
```

---

## 🐳 **Docker Production Deployment**

### **Build & Run**

```bash
# Build production image
docker build -t hamlet-backend .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

### **Environment Variables**

Required in production:

```bash
DATABASE_URL=postgresql://...
NODE_ENV=production
CORS_ORIGINS=https://yourdomain.com
JWT_SECRET=your-secret
```

---

## 🔧 **Configuration**

### **Environment Variables**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `PORT` | ❌ | `4001` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment |
| `CORS_ORIGINS` | ❌ | `localhost:3000,localhost:3001` | Allowed CORS origins (comma-separated) |
| `JWT_SECRET` | ❌ | - | JWT secret for auth (if implementing) |
| `LOG_LEVEL` | ❌ | `info` | Logging level |
| `RATE_LIMIT_WINDOW_MS` | ❌ | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | `100` | Max requests per window |

### **Database Connection Examples**

**Local PostgreSQL:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/hamlet_db?schema=public"
```

**Supabase:**
```
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?pgbouncer=true"
```

**Render:**
```
DATABASE_URL="postgresql://user:pass@dpg-xxxxx.render.com/dbname"
```

---

## 📈 **Monitoring & Logging**

### **Health Checks**

```bash
curl http://localhost:4001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T12:00:00.000Z",
  "uptime": 1234.56,
  "database": "connected"
}
```

### **Logs**

Logs are written to:
- Console (colorized in development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

---

## 🧪 **Testing**

### **Manual Testing**

```bash
# Health check
curl http://localhost:4001/health

# Get candidates
curl "http://localhost:4001/api/candidates?limit=5"

# Get statistics
curl http://localhost:4001/api/candidates/stats/overview

# Get single candidate
curl http://localhost:4001/api/candidates/{id}
```

### **Import Test**

```bash
# Import first 100 candidates
npm run import:test

# Check logs
cat logs/import_errors.json  # If any errors
```

---

## 🚨 **Production Checklist**

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (if auth enabled)
- [ ] Configure production `DATABASE_URL` with connection pooling
- [ ] Set restrictive `CORS_ORIGINS` (remove localhost)
- [ ] Enable SSL/TLS on database connection
- [ ] Set up monitoring (e.g., Sentry, DataDog)
- [ ] Configure log aggregation
- [ ] Run database backups
- [ ] Set up rate limiting for public endpoints
- [ ] Add authentication middleware to admin routes
- [ ] Review and lock down firewall rules
- [ ] Run security audit (`npm audit`)

---

## 📚 **Additional Documentation**

- **CSV Mapping Guide:** `../CSV_TO_DATABASE_MAPPING.md`
- **Prisma Schema:** `../UNIFIED_PRISMA_SCHEMA.prisma`
- **Technical Assessment:** `../TECHNICAL_ASSESSMENT_REPORT.md`

---

## 🤝 **Contributing**

1. Create a feature branch
2. Make changes
3. Run `npm run lint` and `npm run format`
4. Test with `npm run import:test`
5. Submit PR

---

## 📝 **License**

MIT

---

## 🆘 **Support**

For issues or questions:
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for the Iraqi Election Platform**
