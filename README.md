# MathBoost 7 — Vercel + Claude

## Setup

### Step 1 — Get Anthropic API key
1. Go to https://console.anthropic.com
2. Sign in → API Keys → Create Key → Copy it (sk-ant-...)
3. Add $5 credit at console.anthropic.com/settings/billing
   (lasts months for family use — each generation costs ~$0.003)

### Step 2 — Deploy to Vercel via GitHub
1. Create GitHub repo → upload all files from this folder
2. Go to vercel.com → Add New → Project → Import from GitHub
3. Select the repo → Deploy

### Step 3 — Add API key in Vercel
Settings → Environment Variables → Add:
  Name:  ANTHROPIC_API_KEY
  Value: sk-ant-...your key...
  Check all 3 environments (Production, Preview, Development)
→ Save → Deployments → Redeploy

### Step 4 — Test
Visit: https://your-site.vercel.app/api/test
Should show: {"status":"ok"}

## Folder structure
mathboost-vercel/
├── index.html        ← the app
├── vercel.json       ← routing config
└── api/
    ├── claude.js     ← Anthropic API proxy
    └── test.js       ← quick health check
