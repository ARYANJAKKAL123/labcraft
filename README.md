# 🧪 LabCraft - Practical Manual Manager

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-purple?style=for-the-badge&logo=appveyor" alt="Version">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>Create, organize, and export beautiful practical manuals with stunning 3D effects</strong>
</p>

<p align="center">
  <a href="#-live-demo">🌐 Live Demo</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-setup-guide">📖 Setup Guide</a> •
  <a href="#-deployment">🌐 Deployment</a>
</p>

---

## 🌐 Live Demo

**Try it now**: [https://labcraft-demo.vercel.app](https://labcraft-demo.vercel.app)

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `student1@college.edu` | `student123` | Admin (Full Access) |
| `student2@college.edu` | `student456` | Admin (Full Access) |
| `viewer@college.edu` | `viewer123` | Viewer (Read-Only) |

---

## ✨ Features

### 🎨 Stunning 3D UI
- **3D Card Tilt Effects** - Cards respond to mouse movement
- **Floating Animations** - Smooth, physics-based animations
- **Gradient Mesh Backgrounds** - Dynamic, colorful backgrounds
- **Glass Morphism** - Modern frosted glass effects
- **Neon Glows** - Eye-catching glow effects on hover

### 📚 Manual Management
- ✅ Create unlimited manuals
- ✅ Organize by subject/topic
- ✅ Search and filter manuals
- ✅ Beautiful statistics dashboard
- ✅ 3D card interactions

### 📝 Practical Entries
- ✅ Title, Aim, Theory, Algorithm
- ✅ Code editor with syntax highlighting (8 languages)
- ✅ Drag & drop image uploads
- ✅ Auto-image compression
- ✅ Conclusion section

### 🖨️ Export & Print
- ✅ Export individual practical to PDF
- ✅ Export entire manual to PDF
- ✅ Print-friendly layouts
- ✅ Academic formatting

### 🌓 Modern UX
- ✅ Dark/Light mode toggle
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Toast notifications
- ✅ Smooth transitions
- ✅ Loading skeletons

### 🔐 Authentication
- ✅ Role-based access control
- ✅ Admin & Viewer roles
- ✅ Secure login system

---

## 🚀 Quick Start

### Option 1: One-Click Deploy (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/labcraft)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/labcraft)

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/labcraft.git

# 2. Navigate to project
cd labcraft

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173
```

### Option 3: Use Pre-built Files

1. Download the `dist` folder
2. Upload to any static hosting
3. Done! 🎉

---

## 📖 Setup Guide

For detailed setup instructions, see [**SETUP_GUIDE.md**](SETUP_GUIDE.md)

### Topics Covered:
- 🔧 Local development setup
- 🎨 Customization (colors, branding)
- 🗄️ Supabase database setup
- 🌐 Domain & SSL configuration
- 📊 Backup & data export
- 🐛 Troubleshooting

---

## 🌐 Deployment

### Supported Platforms

| Platform | Difficulty | Free Tier | Custom Domain |
|----------|------------|-----------|---------------|
| **Netlify** | ⭐ Easy | ✅ Yes | ✅ Yes |
| **Vercel** | ⭐ Easy | ✅ Yes | ✅ Yes |
| **GitHub Pages** | ⭐⭐ Medium | ✅ Yes | ✅ Yes |
| **Cloudflare Pages** | ⭐⭐ Medium | ✅ Yes | ✅ Yes |
| **Self-Hosted** | ⭐⭐⭐ Hard | N/A | ✅ Yes |

### Quick Deploy Commands

```bash
# Build for production
npm run build

# Deploy to Netlify (with CLI)
npx netlify deploy --prod --dir=dist

# Deploy to Vercel (with CLI)
npx vercel --prod
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **Framer Motion** | 3D Animations |
| **PrismJS** | Syntax Highlighting |
| **html2canvas + jsPDF** | PDF Export |
| **Supabase** | Database (optional) |

---

## 🎨 Customization

### Change Colors

Edit `src/index.css`:

```css
:root {
  --primary: 262 83% 58%;  /* Change hue (262) for main color */
  --accent: 45 93% 55%;    /* Change hue (45) for accent color */
}
```

### Change App Name

Edit `src/components/Header.tsx`:
```tsx
<span className="gradient-text-animated">YourAppName</span>
```

### Add Users

Edit `src/hooks/useAuth.ts`:
```typescript
const AUTHORIZED_USERS = [
  { email: 'you@school.edu', password: 'yourpass', role: 'admin' },
];
```

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/dashboard.png" alt="Dashboard" width="45%">
  <img src="screenshots/practical.png" alt="Practical View" width="45%">
</p>

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [PrismJS](https://prismjs.com/) - Syntax highlighting

---

<p align="center">
  Made with 💜 for diploma students everywhere!
</p>

<p align="center">
  <a href="https://github.com/yourusername/labcraft">⭐ Star this repo</a> if you find it helpful!
</p>
