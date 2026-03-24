# Urban Jobs

**Connecting Talent with Opportunity** — A local recruitment platform for Dhangadhi, Nepal.

Built with Next.js 14, TypeScript, TailwindCSS, Framer Motion, Firebase, and Cloudinary.

## Features

- **Job seekers**: Browse jobs, submit resume, apply in one click
- **Employers**: Post jobs (teaching, hotel, reception, accounting, IT)
- **Admin dashboard**: Manage candidates, employers, jobs, and applications
- **Document uploads**: Document ID, passport photo, and certificates stored in Cloudinary
- **Search & filters**: By category, location, keyword
- **Mobile responsive**, fast loading, smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, React Icons
- **Backend**: Firebase (Firestore, Auth)
- **File uploads**: Cloudinary
- **Deploy**: Vercel / Cloudflare compatible

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable **Authentication** (Email/Password)
   - Create **Firestore** database
   - In Project settings, copy your config and create admin user(s) in Authentication

3. **Cloudinary (documents)**
   - Create account at [Cloudinary](https://cloudinary.com)
   - Go to **Settings > Upload**
   - Create an **Unsigned upload preset**
   - Copy:
     - Cloud name
     - Upload preset name

4. **Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in:
     - Firebase keys
     - Cloudinary keys (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`)
     - `NEXT_PUBLIC_ADMIN_EMAILS` (comma-separated emails for admin login)

5. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin

- **URL**: `/admin` (redirects to `/admin/login` if not signed in)
- **Access**: Only emails listed in `NEXT_PUBLIC_ADMIN_EMAILS` can sign in. Create these users in Firebase Authentication (Email/Password).

## Project structure

```
/app          — Routes (home, jobs, candidate, employer, admin)
/components   — Navbar, Footer, JobCard, CandidateCard, forms, etc.
/lib          — firebase.ts, auth.ts, firestore.ts
/types        — job, candidate, employer, application
```

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Add environment variables (same as `.env.local`)
3. Deploy

---

**Built by Inara Tech**
