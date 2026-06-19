# HOS Coffee Lounge — Full-Stack Web Application

Elegant restaurant web app with online ordering, table booking, admin panel, SMS confirmations and real-time push notifications.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (admin panel only)
- **SMS**: Twilio (primary) / Eskiz.uz (CIS fallback)
- **Real-time**: Pusher (or polling fallback every 5–10 s)
- **Icons**: Lucide React

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio sender number |
| `SMS_PROVIDER` | `twilio` or `eskiz` |
| `ESKIZ_EMAIL` | Eskiz.uz account email (if using Eskiz) |
| `ESKIZ_PASSWORD` | Eskiz.uz password |
| `PUSHER_APP_ID` | Pusher App ID |
| `PUSHER_KEY` | Pusher Key |
| `PUSHER_SECRET` | Pusher Secret |
| `PUSHER_CLUSTER` | Pusher cluster (e.g. `eu`) |
| `NEXT_PUBLIC_PUSHER_KEY` | Same as `PUSHER_KEY` |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Same as `PUSHER_CLUSTER` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

### 3. Set up the database

```bash
npx prisma db push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Features

### Public Website

| Page | Description |
|---|---|
| `/` | Hero, features, CTA |
| `/menu` | Category tabs, item cards, cart drawer, order placement |
| `/booking` | Zone selector, date/time picker, guest count, SMS confirmation |
| `/promotions` | Active promotions grid |
| `/orders/[id]` | Live order status (polls every 5 s) |

### Admin Panel `/admin`

| Page | Description |
|---|---|
| `/admin/dashboard` | Stats cards + recent activity live feed |
| `/admin/orders` | Real-time list · Confirm/Preparing/Ready/Cancel · SMS on confirm |
| `/admin/bookings` | Confirm/Cancel with SMS sent on each action |
| `/admin/menu` | Drag-to-reorder categories (dnd-kit) · Full CRUD for items |
| `/admin/promotions` | CRUD · Active/inactive toggle |

### Notification Flow

**Order:**
1. Client places order → status `pending`, Pusher event fired
2. Admin sees red badge + browser notification + ping sound
3. Admin clicks **Confirm** → status `confirmed`, SMS sent to client
4. Admin progresses: Confirmed → Preparing → Ready
5. Client status page updates automatically every 5 s

**Booking:**
1. Client submits booking → status `pending`, Pusher event fired
2. Admin sees red badge + notification
3. **Confirm** → status `confirmed`, confirmation SMS sent
4. **Cancel** → status `cancelled`, cancellation SMS sent

---

## SMS Templates

Templates live in `lib/sms.ts` and are bilingual (RU / TK). Language is stored with each order/booking from the client's UI language switcher.

### Fallback without Pusher

If `PUSHER_*` env vars are not set, the admin panel falls back to polling `/api/admin/stats` every 10 s.

---

## Production Build

```bash
npm run build
npm start
```

Or deploy to Vercel — just add all env vars in the Vercel dashboard and connect your PostgreSQL database (e.g. Neon, Supabase, Railway).
