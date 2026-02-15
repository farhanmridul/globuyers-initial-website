# GloBuyers Website - Deployment Guide

## 1. Project Overview
- **Project Name:** GloBuyers
- **Stack:** Next.js 14, Tailwind CSS, Framer Motion
- **Repository:** `https://github.com/farhanmridul/globuyers-initial-website.git`
- **Hosting:** Railway (Connected via GitHub)

## 2. Pre-Deployment Checklist
- [x] **Environment Variables**: No critical secrets for this static site, but `NEXT_PUBLIC_` vars if added later.
- [x] **Build Command:** `npm run build` (Next.js default)
- [x] **Start Command:** `npm start` (Next.js default)
- [x] **Root Directory:** `/` (Project is in the root)

## 3. Deployment Steps on Railway
1. **Login to Railway**: Go to [railway.app](https://railway.app)
2. **New Project**: Click "New Project" > "Deploy from GitHub repo"
3. **Select Repo**: Choose `globuyers-initial-website`
4. **Configure Settings**:
   - **Root Directory**: Leave as default (`/`)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. **Deploy**: Click "Deploy Now"

## 4. Updates & Maintenance
- Push changes to the `main` branch of the GitHub repository.
- Railway will automatically trigger a new deployment.
- Monitor deployment logs in Railway dashboard for any build errors.

## 5. Domain Setup (Optional)
- In Railway project settings, go to "Networking".
- Generate a default domain (e.g., `globuyers.up.railway.app`) or connect a custom domain (`globuyers.com`).
