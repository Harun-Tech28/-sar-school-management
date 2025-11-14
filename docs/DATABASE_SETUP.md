# Database Setup Guide

## 🎯 Quick Start

Your SAR Educational Complex needs a PostgreSQL database to work. You have two options:

### Option 1: Local PostgreSQL (Recommended for Development)
### Option 2: Cloud Database (Recommended for Production)

---

## 📦 Option 1: Local PostgreSQL Setup

### Windows

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (version 14 or higher)
   - Run the installer

2. **During Installation**
   - Set password for `postgres` user (remember this!)
   - Default port: `5432` (keep this)
   - Install pgAdmin (optional, but helpful)

3. **Create Database**
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   
   # Enter your password, then:
   CREATE DATABASE sar_edu;
   \q
   ```

4. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sar_edu?schema=public"
   ```

### macOS

1. **Install with Homebrew**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database**
   ```bash
   createdb sar_edu
   ```

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sar_edu?schema=public"
   ```

### Linux (Ubuntu/Debian)

1. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE sar_edu;
   \q
   ```

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sar_edu?schema=public"
   ```

---

## ☁️ Option 2: Cloud Database (Free Tier Available)

### Vercel Postgres (Recommended for Vercel Deployment)

1. **Create Database**
   - Go to: https://vercel.com/dashboard
   - Click "Storage" → "Create Database"
   - Select "Postgres"
   - Choose your region
   - Click "Create"

2. **Get Connection String**
   - Click on your database
   - Go to ".env.local" tab
   - Copy the `POSTGRES_URL` value

3. **Update .env File**
   ```env
   DATABASE_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   ```

### Supabase (Free Tier: 500MB)

1. **Create Project**
   - Go to: https://supabase.com
   - Sign up / Log in
   - Click "New Project"
   - Choose organization and region
   - Set database password
   - Wait for setup (2-3 minutes)

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```

### Railway (Free Tier: $5 credit/month)

1. **Create Database**
   - Go to: https://railway.app
   - Sign up / Log in
   - Click "New Project" → "Provision PostgreSQL"

2. **Get Connection String**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:xxx@xxx.railway.app:5432/railway"
   ```

### Neon (Free Tier: 10GB)

1. **Create Project**
   - Go to: https://neon.tech
   - Sign up / Log in
   - Click "Create Project"
   - Choose region

2. **Get Connection String**
   - Copy the connection string shown
   - It includes `?sslmode=require` at the end

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://xxx:xxx@xxx.neon.tech/xxx?sslmode=require"
   ```

---

## 🚀 After Database Setup

### 1. Push Database Schema

```bash
# This creates all tables in your database
npx prisma db push
```

### 2. Seed Production Data (Optional)

```bash
# This adds Ghana holidays and default settings
npx ts-node prisma/seed-production.ts
```

### 3. Create Admin Account

```bash
# This creates your first admin user
npx ts-node scripts/create-admin.ts
```

### 4. Test Connection

```bash
# This verifies your database is working
npx ts-node scripts/test-db-connection.ts
```

---

## 🔍 Troubleshooting

### "Connection refused" or "ECONNREFUSED"

**Problem**: Can't connect to local PostgreSQL

**Solutions**:
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   services.msc  # Look for "postgresql" service
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL if stopped:
   ```bash
   # Windows: Use Services app
   
   # macOS
   brew services start postgresql@14
   
   # Linux
   sudo systemctl start postgresql
   ```

3. Check port 5432 is not in use:
   ```bash
   # Windows
   netstat -ano | findstr :5432
   
   # macOS/Linux
   lsof -i :5432
   ```

### "Password authentication failed"

**Problem**: Wrong password in DATABASE_URL

**Solution**: Update your .env file with correct password:
```env
DATABASE_URL="postgresql://postgres:CORRECT_PASSWORD@localhost:5432/sar_edu?schema=public"
```

### "Database does not exist"

**Problem**: Database not created

**Solution**: Create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sar_edu;

# Exit
\q
```

### "Prisma Client initialization error"

**Problem**: Prisma Client not generated

**Solution**: Generate Prisma Client:
```bash
npx prisma generate
```

### "Connection timeout"

**Problem**: Database server not responding

**Solutions**:
1. Check internet connection (for cloud databases)
2. Verify DATABASE_URL is correct
3. Check firewall settings
4. For cloud databases: Check if IP is whitelisted

---

## 📊 Database Management Tools

### pgAdmin (GUI for PostgreSQL)
- Download: https://www.pgadmin.org/download/
- Great for viewing and managing local databases

### Prisma Studio (Built-in)
```bash
npx prisma studio
```
- Opens at http://localhost:5555
- View and edit data in browser

### TablePlus (Paid, but nice)
- Download: https://tableplus.com
- Modern GUI for multiple databases

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Use .env.example for documentation

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols

3. **Restrict database access**
   - Only allow necessary IPs
   - Use SSL/TLS for connections

4. **Regular backups**
   - Daily automated backups
   - Store off-site (S3, Google Cloud)

5. **Monitor connections**
   - Set up alerts for unusual activity
   - Review logs regularly

---

## 📞 Need Help?

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed (local) or cloud database created
- [ ] Database created (sar_edu or cloud equivalent)
- [ ] .env file updated with correct DATABASE_URL
- [ ] `npx prisma db push` completed successfully
- [ ] Admin account created
- [ ] Can log in to the application

**Once all checked, you're ready to use the system!** 🎉
