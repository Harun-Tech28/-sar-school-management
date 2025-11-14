# Render Deployment Guide for SAR Educational Complex

## ✅ Build Status: READY FOR DEPLOYMENT

Your app builds successfully with no errors!

---

## Step 1: Create PostgreSQL Database on Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `sar-school-db`
   - **Database**: `sar_school`
   - **Region**: Choose closest to Ghana (Frankfurt or Singapore recommended)
   - **Plan**: 
     - **Free** (for testing - spins down after 90 days inactivity)
     - **$7/month** (recommended for production - no spin down, backups)
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning

### Get Connection String

1. Once created, go to database dashboard
2. Scroll to **"Connections"** section
3. Copy the **"External Database URL"**
   ```
   postgresql://user:password@dpg-xxxxx.render.com/sar_school
   ```
4. Save this - you'll need it for the web service

---

## Step 2: Push Code to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Ready for Render deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## Step 3: Deploy Web Service on Render

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository
4. Configure:

### Basic Settings
- **Name**: `sar-school-app` (or your preferred name)
- **Region**: Same as database (Frankfurt or Singapore)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Environment**: **Node**
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

### Plan
- **Free** (for testing - spins down after 15 min inactivity, cold start ~30s)
- **$7/month** (recommended for production - always on, faster)

---

## Step 4: Add Environment Variables

In your Render web service, go to **Environment** tab and add:

```bash
DATABASE_URL=<paste-your-render-postgres-url-here>
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://your-app-name.onrender.com
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

Run this locally to generate a secure random string:

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use this online:** https://generate-secret.vercel.app/32

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repo
   - Install dependencies
   - Generate Prisma client
   - Build your Next.js app
   - Start the server
3. Wait 5-10 minutes for first deployment

---

## Step 6: Initialize Database

After successful deployment:

1. Go to your web service dashboard
2. Click **"Shell"** tab (top right)
3. Run these commands:

```bash
# Push database schema
npx prisma db push

# Seed initial data (admin user, etc.)
npx prisma db seed
```

4. Wait for completion

---

## Step 7: Access Your App

1. Your app will be available at: `https://your-app-name.onrender.com`
2. Login with the admin credentials from your seed file
3. Test all features

---

## 🎯 Quick Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database URL copied
- [ ] Code pushed to GitHub
- [ ] Web service created and connected to GitHub
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Database schema pushed
- [ ] Database seeded
- [ ] App accessible and working

---

## 💡 Tips

### Free Tier Limitations
- Database spins down after 90 days of inactivity
- Web service spins down after 15 minutes of inactivity
- Cold starts take ~30 seconds
- 750 hours/month free (enough for one service)

### Production Recommendations
- Use paid plans ($7/month each for database and web service)
- Set up custom domain
- Enable automatic deploys on git push
- Monitor logs regularly
- Set up health checks

### Troubleshooting

**Build fails:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

**Database connection fails:**
- Verify DATABASE_URL format
- Check database is running (not spun down)
- Ensure database and web service are in same region

**App crashes on startup:**
- Check logs in Render dashboard
- Verify Prisma schema is pushed
- Ensure all dependencies are installed

---

## 🔄 Updating Your App

After making changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically rebuild and redeploy (if auto-deploy is enabled).

---

## 📞 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Good luck with your deployment! 🚀**
