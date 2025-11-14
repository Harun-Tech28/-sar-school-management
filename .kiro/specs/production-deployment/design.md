# Design Document

## Overview

This design outlines the technical approach to transform the SAR Educational Complex into a production-ready system. The focus is on fixing immediate issues (login/database), migrating to a production database, removing demo data, and providing a smooth deployment and setup experience for real schools.

## Architecture

### Current State Issues

1. **Database Problem**: Using Prisma Postgres (local development only) which requires a running process
2. **Login Hanging**: Database connection timeout causing login to hang indefinitely
3. **Demo Data**: Hardcoded demo credentials and test data throughout the system
4. **Environment**: Not configured for production deployment

### Target Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloud Platform                        │
│              (Vercel / Railway / Render)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Application                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │   Auth     │  │    API     │  │   Pages    │ │  │
│  │  │ Middleware │  │  Routes    │  │ Components │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Prisma ORM (Connection Pool)             │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   Production PostgreSQL Database    │
         │  (Vercel Postgres / Railway /       │
         │   Supabase / Neon)                  │
         └────────────────────────────────────┘
```

## Components and Interfaces

### 1. Database Migration Strategy

**Component**: Database Configuration
**File**: `lib/prisma.ts`

**Changes**:
- Remove Prisma Postgres specific configuration
- Add connection pooling for production
- Add retry logic for database connections
- Add connection timeout handling

```typescript
// New Prisma configuration
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
})

// Connection with retry logic
export async function connectDB(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      console.log('✅ Database connected')
      return prisma
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 2. Authentication Fix

**Component**: Login API Route
**File**: `app/api/auth/simple-login/route.ts`

**Changes**:
- Add connection timeout (5 seconds)
- Add better error handling
- Remove explicit $connect() call (Prisma handles this)
- Add request timeout

```typescript
export async function POST(request: NextRequest) {
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 10000)
  )
  
  try {
    const result = await Promise.race([
      handleLogin(request),
      timeoutPromise
    ])
    return result
  } catch (error) {
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Login timeout. Please check database connection.' },
        { status: 504 }
      )
    }
    // Handle other errors
  }
}
```

### 3. Production Seed Script

**Component**: Production Data Seeder
**File**: `prisma/seed-production.ts`

**Purpose**: Create only essential data for a new school

**Data to Create**:
1. Ghana holidays for current academic year
2. Default academic year structure
3. Default grading system (A1-F9)
4. No user accounts (admin created separately)

```typescript
async function main() {
  console.log('🌱 Seeding production data...')
  
  // 1. Create Ghana holidays
  await createGhanaHolidays()
  
  // 2. Create default academic year
  await createAcademicYear()
  
  // 3. Create grading system
  await createGradingSystem()
  
  console.log('✅ Production seed complete')
  console.log('⚠️  No user accounts created')
  console.log('📝 Run: npx ts-node scripts/create-admin.ts')
}
```

### 4. Admin Creation Script

**Component**: Secure Admin Creator
**File**: `scripts/create-admin.ts`

**Features**:
- Interactive CLI prompts
- Password validation
- Email validation
- Duplicate check
- Success confirmation

```typescript
import prompts from 'prompts'
import { hash } from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function createAdmin() {
  console.log('🔐 SAR Educational Complex - Admin Account Setup\n')
  
  const response = await prompts([
    {
      type: 'text',
      name: 'fullName',
      message: 'Admin Full Name:',
      validate: value => value.length >= 3 || 'Name must be at least 3 characters'
    },
    {
      type: 'text',
      name: 'email',
      message: 'Admin Email:',
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Admin Password:',
      validate: value => {
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter'
        if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter'
        if (!/[0-9]/.test(value)) return 'Password must contain number'
        if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain special character'
        return true
      }
    },
    {
      type: 'text',
      name: 'department',
      message: 'Department:',
      initial: 'Administration'
    }
  ])
  
  // Create admin user
  const hashedPassword = await hash(response.password, 10)
  
  const user = await prisma.user.create({
    data: {
      email: response.email,
      password: hashedPassword,
      fullName: response.fullName,
      role: 'ADMIN',
      admin: {
        create: {
          department: response.department
        }
      }
    }
  })
  
  console.log('\n✅ Admin account created successfully!')
  console.log(`📧 Email: ${user.email}`)
  console.log(`🔗 Login at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login`)
}
```

### 5. Environment Configuration

**Component**: Environment Setup
**Files**: `.env.example`, `.env.production`

**Required Variables**:
```env
# Database (Production)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Authentication
NEXTAUTH_SECRET="[GENERATE_WITH: openssl rand -base64 32]"
NEXTAUTH_URL="https://your-school-domain.com"

# Application
NODE_ENV="production"

# Optional: Monitoring
SENTRY_DSN="your-sentry-dsn"

# Optional: Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### 6. Deployment Configuration

**Component**: Platform-Specific Configs

#### Vercel (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  }
}
```

#### Railway (`railway.json`)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Render (`render.yaml`)
```yaml
services:
  - type: web
    name: sar-educational-complex
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 18.17.0
      - key: DATABASE_URL
        sync: false
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: NEXTAUTH_URL
        value: https://sar-educational-complex.onrender.com
```

## Data Models

### No Changes to Existing Schema

The current Prisma schema is production-ready. Only connection configuration changes needed.

### Migration Strategy

1. **Development to Production**:
   ```bash
   # Generate migration
   npx prisma migrate dev --name init
   
   # Apply to production
   npx prisma migrate deploy
   ```

2. **Alternative (for existing databases)**:
   ```bash
   # Push schema without migrations
   npx prisma db push
   ```

## Error Handling

### 1. Database Connection Errors

```typescript
// Centralized error handler
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export function handleDatabaseError(error: any) {
  if (error.code === 'P1001') {
    return new DatabaseError('Cannot reach database server. Please check connection.')
  }
  if (error.code === 'P1017') {
    return new DatabaseError('Database server closed connection. Please try again.')
  }
  if (error.code === 'P2002') {
    return new DatabaseError('A record with this information already exists.')
  }
  return new DatabaseError('Database operation failed. Please try again.')
}
```

### 2. Authentication Errors

```typescript
export function handleAuthError(error: any) {
  if (error.message === 'Request timeout') {
    return {
      error: 'Login timeout. Please check your connection and try again.',
      code: 'TIMEOUT'
    }
  }
  if (error.code === 'INVALID_CREDENTIALS') {
    return {
      error: 'Invalid email or password.',
      code: 'INVALID_CREDENTIALS'
    }
  }
  return {
    error: 'Authentication failed. Please try again.',
    code: 'AUTH_ERROR'
  }
}
```

### 3. API Error Responses

```typescript
// Standardized error response
export function errorResponse(error: any, status: number = 500) {
  return NextResponse.json(
    {
      error: error.message || 'An error occurred',
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    },
    { status }
  )
}
```

## Testing Strategy

### 1. Database Connection Testing

```typescript
// scripts/test-db-connection.ts
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}
```

### 2. Authentication Testing

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/simple-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password123"}'
```

### 3. Deployment Testing Checklist

- [ ] Database connection works
- [ ] Admin can log in
- [ ] All dashboards load
- [ ] API endpoints respond
- [ ] Static assets load
- [ ] HTTPS works
- [ ] Environment variables set
- [ ] Error logging works

## Performance Considerations

### 1. Database Connection Pooling

```typescript
// Prisma connection pool configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Connection pool settings
  log: ['error'],
  errorFormat: 'minimal',
})

// Set connection pool size via DATABASE_URL
// postgresql://user:pass@host:port/db?connection_limit=10&pool_timeout=20
```

### 2. API Response Caching

```typescript
// Cache frequently accessed data
import { unstable_cache } from 'next/cache'

export const getSchoolInfo = unstable_cache(
  async () => {
    return await prisma.schoolInfo.findFirst()
  },
  ['school-info'],
  { revalidate: 3600 } // Cache for 1 hour
)
```

### 3. Database Indexes

```prisma
// Add indexes for frequently queried fields
model User {
  id       String @id @default(cuid())
  email    String @unique
  role     Role
  
  @@index([email])
  @@index([role])
}

model Student {
  id        String @id @default(cuid())
  studentId String @unique
  classId   String?
  
  @@index([studentId])
  @@index([classId])
}
```

## Security Considerations

### 1. Environment Variable Validation

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test'])
})

export const env = envSchema.parse(process.env)
```

### 2. Rate Limiting

```typescript
// middleware.ts - Add rate limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: NextRequest) {
  // Rate limit login attempts
  if (request.nextUrl.pathname === '/api/auth/simple-login') {
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return new Response('Too many requests', { status: 429 })
    }
  }
  
  // ... rest of middleware
}
```

### 3. SQL Injection Prevention

Already handled by Prisma ORM - all queries are parameterized.

### 4. XSS Prevention

Already handled by React - all user input is escaped by default.

## Deployment Workflow

### Step 1: Prepare for Production

```bash
# 1. Clean demo data
npm run clean:demo

# 2. Test build
npm run build

# 3. Test production locally
npm start

# 4. Run tests
npm test
```

### Step 2: Set Up Database

```bash
# Option A: Vercel Postgres
vercel postgres create

# Option B: Railway
railway add postgresql

# Option C: Supabase
# Create project at supabase.com
```

### Step 3: Deploy Application

```bash
# Vercel
vercel --prod

# Railway
railway up

# Render
# Push to GitHub, connect in Render dashboard
```

### Step 4: Initialize Production

```bash
# 1. Push database schema
DATABASE_URL="your-prod-url" npx prisma db push

# 2. Seed production data
DATABASE_URL="your-prod-url" npx ts-node prisma/seed-production.ts

# 3. Create admin account
DATABASE_URL="your-prod-url" npx ts-node scripts/create-admin.ts
```

### Step 5: Verify Deployment

- [ ] Visit production URL
- [ ] Log in with admin account
- [ ] Create a test teacher
- [ ] Create a test class
- [ ] Create a test student
- [ ] Test all major features
- [ ] Check error logging
- [ ] Verify HTTPS

## Monitoring and Maintenance

### 1. Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    }, { status: 503 })
  }
}
```

### 2. Error Monitoring Setup

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  })
}

export function captureError(error: Error, context?: any) {
  console.error(error)
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context })
  }
}
```

### 3. Database Backup Strategy

```bash
# Automated daily backups
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE

# Upload to cloud storage
aws s3 cp $BACKUP_FILE s3://your-bucket/backups/

# Keep only last 30 days
find . -name "backup_*.sql" -mtime +30 -delete
```

## Documentation Updates

### 1. Quick Start Guide

Create `docs/QUICK_START.md` with:
- Installation steps
- Database setup
- Admin account creation
- First login
- Adding first teacher/student

### 2. Deployment Guide

Update `docs/DEPLOYMENT.md` with:
- Platform-specific instructions
- Environment variable setup
- Database migration steps
- Troubleshooting common issues

### 3. Admin Manual

Create `docs/ADMIN_MANUAL.md` with:
- Dashboard overview
- User management
- Class management
- System configuration
- Backup and maintenance

## Success Criteria

The production deployment is successful when:

1. ✅ Login works within 3 seconds
2. ✅ Database connection is stable
3. ✅ No demo data in production
4. ✅ Admin can create teachers, classes, students
5. ✅ All dashboards load correctly
6. ✅ HTTPS is enabled
7. ✅ Error monitoring is active
8. ✅ Database backups are configured
9. ✅ Documentation is complete
10. ✅ School can start using the system immediately
