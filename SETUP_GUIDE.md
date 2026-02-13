# 🚀 LabCraft - Complete Setup & Hosting Guide

A comprehensive guide to set up, customize, and deploy LabCraft for real-world use.

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start-5-minutes)
2. [Local Development Setup](#local-development-setup)
3. [Customization Guide](#customization-guide)
4. [Database Setup (Supabase)](#database-setup-supabase)
5. [Deployment Options](#deployment-options)
6. [Domain & SSL Setup](#domain--ssl-setup)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start (5 minutes)

### Option 1: Direct Download & Use (Easiest)

1. **Download the built files** from the `dist` folder
2. **Upload to any static hosting** (Netlify, Vercel, GitHub Pages)
3. **Done!** The app works immediately with LocalStorage

### Option 2: One-Click Deploy

#### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/labcraft)

#### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/labcraft)

---

## Local Development Setup

### Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org))
- **npm** or **yarn** or **pnpm**
- **Git** (optional, for version control)

### Step 1: Clone/Download the Project

```bash
# Clone from GitHub (if you have a repo)
git clone https://github.com/yourusername/labcraft.git

# OR download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
# Navigate to project folder
cd labcraft

# Install dependencies
npm install

# OR using yarn
yarn install

# OR using pnpm
pnpm install
```

### Step 3: Start Development Server

```bash
# Start the dev server
npm run dev

# The app will open at http://localhost:5173
```

### Step 4: Build for Production

```bash
# Create production build
npm run build

# Output will be in the `dist` folder
```

---

## Customization Guide

### 1. Change App Name/Branding

Edit `index.html`:
```html
<title>Your App Name - Tagline</title>
```

Edit `src/components/Header.tsx`:
```tsx
<span className="gradient-text-animated">YourAppName</span>
```

### 2. Change Color Theme

Edit `src/index.css` - modify the CSS variables:

```css
:root {
  /* Change these colors */
  --primary: 262 83% 58%;        /* Violet - change hue (262) */
  --accent: 45 93% 55%;          /* Amber - change hue (45) */
}
```

**Popular color combinations:**
- **Blue/Orange**: `--primary: 217 91% 60%; --accent: 25 95% 53%;`
- **Green/Pink**: `--primary: 142 76% 36%; --accent: 330 81% 60%;`
- **Red/Cyan**: `--primary: 0 84% 60%; --accent: 187 94% 43%;`

### 3. Change Demo Accounts

Edit `src/hooks/useAuth.ts`:

```typescript
const AUTHORIZED_USERS = [
  { email: 'your-email@school.edu', password: 'your-password', role: 'admin' as const },
  // Add more users...
];
```

### 4. Add More Programming Languages

Edit `src/types/index.ts`:

```typescript
export const SUPPORTED_LANGUAGES = [
  // Add new languages
  { value: 'rust', label: 'Rust', prismClass: 'language-rust' },
  { value: 'go', label: 'Go', prismClass: 'language-go' },
  // ...existing languages
];
```

Add PrismJS language support in `index.html`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-go.min.js"></script>
```

---

## Database Setup (Supabase)

### Why Supabase?
- **Free tier** includes 500MB database + 1GB storage
- **Real-time sync** across devices
- **Authentication** built-in
- **Row Level Security** for data protection

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new project
4. Wait for the database to be provisioned

### Step 2: Create Database Tables

Go to **SQL Editor** → **New query** and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Manuals table
create table manuals (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subject text not null,
  description text,
  user_id uuid references auth.users,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Practicals table
create table practicals (
  id uuid default uuid_generate_v4() primary key,
  manual_id uuid references manuals on delete cascade,
  number integer not null,
  title text not null,
  aim text not null,
  theory text,
  algorithm text,
  code text,
  language text default 'python',
  output_images text[] default '{}',
  conclusion text,
  user_id uuid references auth.users,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manuals_updated_at BEFORE UPDATE ON manuals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practicals_updated_at BEFORE UPDATE ON practicals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
alter table manuals enable row level security;
alter table practicals enable row level security;

-- Create policies (customize as needed)
CREATE POLICY "Enable all access" ON manuals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access" ON practicals FOR ALL USING (true) WITH CHECK (true);
```

### Step 3: Create Storage Bucket

1. Go to **Storage** → **New bucket**
2. Name: `practical-images`
3. Check **Public bucket**
4. Click **Create bucket**

### Step 4: Get API Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon/public** API key

### Step 5: Configure App

Open your deployed app and run in browser console:

```javascript
localStorage.setItem('supabase_url', 'https://your-project.supabase.co');
localStorage.setItem('supabase_anon_key', 'your-anon-key');
location.reload();
```

Or create a `.env` file for local development:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deployment Options

### Option 1: Netlify (Recommended for Beginners)

#### Method A: Drag & Drop
1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Done! Your site is live

#### Method B: Git Integration
1. Push code to GitHub
2. Go to Netlify → **Add new site** → **Import from Git**
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy**

**Custom Domain:**
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `labcraft.yourschool.edu`)
4. Follow DNS configuration instructions

---

### Option 2: Vercel (Best Performance)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Import your repository
5. Framework preset: **Vite**
6. Build command: `npm run build`
7. Output directory: `dist`
8. Click **Deploy**

**Custom Domain:**
1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed

---

### Option 3: GitHub Pages (Free)

1. Push code to GitHub
2. Go to **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Push this file and the action will deploy automatically

---

### Option 4: Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Connect to GitHub
4. Select repository
5. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
6. Click **Save and Deploy**

---

### Option 5: Self-Hosted (VPS/Dedicated Server)

#### Using Nginx

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Build your app
npm run build

# Copy files to web root
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/labcraft
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/labcraft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Domain & SSL Setup

### Free SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Custom Domain Setup (General)

1. **Buy a domain** from:
   - Namecheap
   - Cloudflare
   - Google Domains
   - GoDaddy

2. **Add DNS records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your server IP | Auto |
| A | www | Your server IP | Auto |
| CNAME | * | your-domain.com | Auto |

3. **Wait for DNS propagation** (5 minutes to 48 hours)

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: App Configuration
VITE_APP_NAME=LabCraft
VITE_APP_URL=https://your-domain.com
```

**Note:** Variables must start with `VITE_` to be accessible in the app.

---

## Backup & Data Export

### Export from LocalStorage

Open browser console and run:

```javascript
// Export all data
const data = {
  manuals: JSON.parse(localStorage.getItem('practical_manual_manuals') || '[]'),
  practicals: JSON.parse(localStorage.getItem('practical_manual_practicals') || '[]'),
  images: JSON.parse(localStorage.getItem('practical_manual_images') || '[]')
};

// Download as JSON
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'labcraft-backup.json';
a.click();
```

### Import to LocalStorage

```javascript
// Paste your backup data
const data = {/* your backup data */};

localStorage.setItem('practical_manual_manuals', JSON.stringify(data.manuals));
localStorage.setItem('practical_manual_practicals', JSON.stringify(data.practicals));
localStorage.setItem('practical_manual_images', JSON.stringify(data.images));

location.reload();
```

---

## Troubleshooting

### Build Errors

**Error: `Cannot find module`**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: `TypeScript errors`**
```bash
# Check TypeScript version
npx tsc --version

# Run type check
npx tsc --noEmit
```

### Deployment Issues

**404 on refresh (Netlify/Vercel)**
- Create `_redirects` file in `public` folder:
```
/* /index.html 200
```

**Assets not loading**
- Check `vite.config.ts` base URL:
```typescript
export default defineConfig({
  base: './', // or your subpath
  // ...
})
```

### Supabase Issues

**CORS errors**
- Go to Supabase → **API** → **URL Configuration**
- Add your domain to **Site URL**

**RLS policy errors**
- Temporarily disable RLS for testing:
```sql
alter table manuals disable row level security;
alter table practicals disable row level security;
```

---

## Performance Optimization

### 1. Enable Compression

**Nginx:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Add Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Use CDN for Assets

Upload images to:
- Cloudinary (free tier: 25GB)
- ImageKit (free tier: 20GB)
- AWS S3 + CloudFront

---

## Security Checklist

- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up proper CORS headers
- [ ] Configure RLS policies in Supabase
- [ ] Use strong passwords for demo accounts
- [ ] Enable 2FA on hosting platform
- [ ] Regular backups
- [ ] Keep dependencies updated

---

## Support & Community

- **Issues**: Open a GitHub issue
- **Discussions**: Join GitHub Discussions
- **Email**: your-email@example.com

---

## License

MIT License - Feel free to use for personal or educational purposes!

---

Made with 💜 by [Your Name]
