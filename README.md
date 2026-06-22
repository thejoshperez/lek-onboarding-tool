# LEK Technology — Employee Onboarding Tool

A streamlined web app for clients to submit new employee setup requests to LEK Technology.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Onboarding Form | `/` | Clients fill out new employee details |
| Admin Dashboard | `/admin?key=lektech2024` | LEK staff view and manage all submissions |

---

## Setup

### 1. Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account + project
2. In your project, go to **SQL Editor → New Query**
3. Paste and run the contents of `lib/supabase-schema.sql`
4. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Resend (Email Notifications)

1. Go to [resend.com](https://resend.com) and create a free account
2. Create an API key → `RESEND_API_KEY`
3. Set `NOTIFICATION_EMAIL` to where you want submission alerts sent

### 3. Environment Variables

Edit `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_ADMIN_KEY=lektech2024
NOTIFICATION_EMAIL=admin@lektechnology.com
```

> **Change `NEXT_PUBLIC_ADMIN_KEY`** to something only you know before deploying!

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the form.
Open [http://localhost:3000/admin?key=lektech2024](http://localhost:3000/admin?key=lektech2024) for the dashboard.

---

## Deploying to Vercel (Free)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. In Vercel's project settings, add all the environment variables from `.env.local`
4. Deploy — done! You'll get a URL like `lek-onboarding.vercel.app`

---

## Changing the Admin Password

Update `NEXT_PUBLIC_ADMIN_KEY` in `.env.local` (and in Vercel environment variables after deploying).
The admin dashboard URL becomes `/admin?key=YOURNEWKEY`.
