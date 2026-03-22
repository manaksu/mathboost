# MathBoost 7 — Vercel + Gemini (FREE)

## Free setup — no credit card needed anywhere

### Step 1 — Get your free Gemini API key (2 minutes)
1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API key" → "Create API key in new project"
4. Copy the key (starts with AIza...)

### Step 2 — Deploy to Vercel
Option A — Drag and drop (easiest):
1. Go to vercel.com → Log in with Google
2. Click "Add New" → "Project"
3. Choose "Deploy from your computer" or drag the folder

Option B — Vercel CLI:
  npm install -g vercel
  cd mathboost-vercel
  vercel --prod

### Step 3 — Add the API key
In Vercel dashboard:
  Project → Settings → Environment Variables → Add
  Name:  GEMINI_API_KEY
  Value: AIza...your key...
  Environment: Production + Preview + Development

Then: Deployments → Redeploy

### Done!
Free limits: 1,500 Gemini requests/day — plenty for family use.
Vercel free tier: unlimited static requests, 100GB bandwidth/month.

## Folder structure
mathboost-vercel/
├── index.html        ← the app
├── vercel.json       ← routing config
└── api/
    └── claude.js     ← Gemini API proxy (Vercel serverless function)

## How it works
Browser → /api/claude → Vercel function → Google Gemini 1.5 Flash → back to app
