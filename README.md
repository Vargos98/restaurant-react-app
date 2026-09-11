# Fiesta La Blanc

Luxury restaurant landing page (React + GSAP + Lenis) with a small Express API and SQLite database.

Live frontend: [restaurant-react-app-rust.vercel.app](https://restaurant-react-app-rust.vercel.app/)

That Vercel link is the **static React site only**. The booking, newsletter, menu API, and `/admin` desk need the Express server running. See [Will this work on Vercel?](#will-this-work-on-vercel) before you redeploy.

---

## What this project is

Two apps in one repo:

| App | Folder | Port | Job |
| --- | --- | --- | --- |
| Public site + admin UI | `src/` | 3000 (or 3001) | Looks, motion, forms |
| API | `server/` | 4000 | Validation, auth, database |

The landing page is still a fine-dining marketing site. What changed for the portfolio is that three things are **real**:

- **Book Table** writes a reservation row
- **Newsletter** writes a subscriber row
- **Today’s Special** reads wines and cocktails from the database

Staff can change that data at `/admin`. Refresh `/` and the public menu updates. That loop is the feature: **guest writes → staff updates → site reads**.

---

## How to run it locally

You need **two terminals**. The React app talks to `/api/...`; in development a proxy forwards those calls to port 4000.

**First time only** (already done in this workspace):

```bash
cd server
npm install
npx prisma migrate dev
npm run seed
```

**Every time you work:**

```bash
# terminal 1 — API
npm run server

# terminal 2 — React
npm start
```

Open `http://localhost:3000` (or `3001` if 3000 is busy).

Admin login after seed:

```
email:    admin@fiestalablanc.com
password: admin1234
```

Production admin is the same URL and password:

`https://restaurant-react-app-rust.vercel.app/admin`

Those values live in `server/.env` locally and in Render env vars in production. The password is **hashed** before it is stored. Never store the plain password in the database.

---

## How a request actually travels

Every feature uses the same shape. Learn this once and you can read the whole backend.

```
React form / page
  → src/lib/api/*.js          (fetch wrapper)
  → /api/...                  (same origin in the browser)
  → src/setupProxy.js         (dev only: forwards to :4000)
  → server route
  → controller                (reads req, sends res)
  → service                   (business rules + Prisma)
  → SQLite file               (server/prisma/dev.db)
  → JSON back to the UI
```

**Route** only attaches a URL.  
**Controller** only talks HTTP (`req` / `res`).  
**Service** only talks to Prisma.  
**Prisma** is the typed layer over SQL. You do not write raw `INSERT` statements.

Example — booking a table:

1. [`ReservationForm.jsx`](src/sections/FindUs/ReservationForm.jsx) collects name, email, phone, date, time, guests, notes.
2. It calls `createReservation()` in [`src/lib/api/reservations.js`](src/lib/api/reservations.js).
3. That uses [`src/lib/api/client.js`](src/lib/api/client.js): `POST /api/reservations` with `credentials: 'include'` (needed later for admin cookies).
4. [`reservations.routes.js`](server/src/modules/reservations/reservations.routes.js) validates the body with Zod. Bad data never reaches the database.
5. [`reservations.controller.js`](server/src/modules/reservations/reservations.controller.js) calls the service.
6. [`reservations.service.js`](server/src/modules/reservations/reservations.service.js) runs `prisma.reservation.create`. Status starts as `pending`.
7. SQLite stores a new row. The API returns `201` and the React form shows success.

Admin confirm is the same chain plus `requireAdmin`:

1. Login `POST /api/admin/login` checks email/password, then sets an **httpOnly JWT cookie** named `admin_token`.
2. The browser stores that cookie. JavaScript cannot read it (safer than `localStorage`).
3. Later calls like `GET /api/admin/reservations` send the cookie automatically.
4. [`requireAdmin.js`](server/src/middleware/requireAdmin.js) verifies the JWT. No cookie → `401`.
5. `PATCH /api/admin/reservations/:id` with `{ "status": "confirmed" }` updates that row.

---

## How data is stored

The database is **SQLite**, a single file: `server/prisma/dev.db`.

Prisma schema: [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

| Model | What it stores | Who writes | Who reads |
| --- | --- | --- | --- |
| `MenuItem` | category (`wine` / `cocktail`), title, price, tags, sort order | seed + admin | public `GET /api/menu` |
| `Reservation` | guest details + `pending` / `confirmed` / `cancelled` | public form | admin desk |
| `Subscriber` | unique email | newsletter form | admin desk |
| `Admin` | email + bcrypt password hash | seed only | login |

**Fetch (read)**  
`GET /api/menu` loads every `MenuItem`, then the service **groups** them into `{ wines, cocktails }` so the landing page can map two columns. If the API is down, [`useMenu.js`](src/hooks/useMenu.js) falls back to [`src/constants/data.js`](src/constants/data.js) so the site still looks complete.

**Store (write)**  
`POST` endpoints insert a row. Duplicate newsletter emails return `409`. Admin `PATCH` / `DELETE` change or remove rows. After you save a wine price in `/admin`, refresh `/` — `useMenu` calls `GET /api/menu` again and the new price appears.

**Seed**  
[`server/prisma/seed.js`](server/prisma/seed.js) creates the admin user and the first wines/cocktails if the menu table is empty. Run `npm run server:seed` from the repo root if you wipe the database.

To look at the raw tables:

```bash
cd server
npx prisma studio
```

---

## API map

Public (no login):

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/health` | `{ ok: true }` |
| `GET` | `/api/menu` | `{ wines, cocktails }` |
| `POST` | `/api/reservations` | create booking |
| `POST` | `/api/newsletter` | `{ email }` |

Admin (JWT cookie):

| Method | Path | Result |
| --- | --- | --- |
| `POST` | `/api/admin/login` | set cookie |
| `POST` | `/api/admin/logout` | clear cookie |
| `GET` | `/api/admin/me` | current staff session |
| `GET` | `/api/admin/reservations` | all bookings |
| `PATCH` | `/api/admin/reservations/:id` | change status |
| `GET` | `/api/admin/subscribers` | mailing list |
| `GET` `POST` | `/api/admin/menu` | list / create items |
| `PATCH` `DELETE` | `/api/admin/menu/:id` | edit / remove |

Errors always look like `{ "error": { "message": "...", "status": 400 } }`. That is why the React client can show the server’s sentence in the form.

---

## Frontend linking

- `/` — GSAP landing ([`src/app/App.jsx`](src/app/App.jsx))
- `/admin` — staff desk ([`src/pages/Admin/AdminPage.jsx`](src/pages/Admin/AdminPage.jsx))
- Router is mounted in [`src/index.js`](src/index.js)
- [`src/setupProxy.js`](src/setupProxy.js) only proxies `/api` → `http://localhost:4000`. `/admin` stays a React route (it is not sent to Express)

Awards, gallery, chef copy stay in frontend constants. They are not in the database on purpose — smaller backend, easier to explain.

---

## How to test the loop

1. Open the public site. Submit a reservation and a newsletter email.
2. Open `/admin`, sign in, confirm the booking, change a menu price.
3. Refresh `/`. Today’s Special should show the new price.

---

## Folder map (backend)

```
server/src/
  index.js                 listen on PORT
  app.js                   middleware + mount /api routers
  lib/prisma.js            one Prisma client
  middleware/              errors, Zod validate, requireAdmin
  modules/menu/
  modules/reservations/
  modules/newsletter/
  modules/admin/
```

Each feature folder is `*.routes.js` → `*.controller.js` → `*.service.js`. If you add “gift cards” later, copy that pattern.

---

## Will this work on Vercel?

**Frontend: yes. Backend: no, not on Vercel.** Deploy the API on **Render** (below), then point Vercel at that URL.

If you only rebuild the React app on Vercel with no API URL:

- The landing page still works
- `/api/menu` and bookings fail (no Express there)
- The menu falls back to hardcoded constants

---

## Deploy the backend on Render

You cannot paste the React app to Render and expect `/api` to appear. Render needs the **`server/`** folder as its own **Web Service**, plus a **PostgreSQL** database. SQLite (`dev.db`) will not survive Render restarts.

### 1. Push this repo to GitHub

Render deploys from GitHub. Commit the latest `server/` code first.

### 2. Create a PostgreSQL database

1. [Render Dashboard](https://dashboard.render.com/) → **New** → **PostgreSQL**
2. Name it `fiesta-la-blanc-db` (any name is fine)
3. Pick the cheapest region close to you
4. Create. Wait until it is **Available**
5. Copy **Internal Database URL** (use this on Render). It looks like `postgresql://...`

Do not use SQLite on Render. The disk is wiped when the instance restarts.

### 3. Create the Web Service

1. **New** → **Web Service** → connect this GitHub repo
2. Fill in:

| Field | Value |
| --- | --- |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install && npm run build:render` |
| Start Command | `npm start` |
| Instance | Free is fine for a demo (it sleeps after idle; first request is slow) |

`build:render` generates the Prisma client for Postgres, creates tables (`db push`), then seeds the admin user and menu if they are empty.

### 4. Environment variables (Web Service)

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Internal Database URL from the Postgres instance |
| `JWT_SECRET` | a long random string |
| `CLIENT_ORIGIN` | `https://restaurant-react-app-rust.vercel.app` (your real Vercel URL, no trailing slash). Add more origins with commas if you also test locally. |
| `CROSS_SITE_COOKIES` | `true` (Vercel and Render are different sites, so the admin cookie must be `SameSite=None; Secure`) |
| `ADMIN_EMAIL` | `admin@fiestalablanc.com` |
| `ADMIN_PASSWORD` | pick a strong password for production |

Render injects `PORT` for you. Do not hardcode `4000` on Render.

### 5. Deploy

Click **Create Web Service**. When it is live you get a URL like:

`https://fiesta-la-blanc-api.onrender.com`

Check `https://YOUR-SERVICE.onrender.com/api/health` → `{ "ok": true }`.

### 6. Point the Vercel frontend at Render

The React app calls `/api/...` locally (proxy). In production it needs the full Render URL.

1. Vercel project → **Settings** → **Environment Variables**
2. Add `REACT_APP_API_URL` = `https://YOUR-SERVICE.onrender.com` (no trailing slash, no `/api` at the end)
3. **Redeploy** the frontend (CRA bakes this in at **build** time; changing the env var without a rebuild does nothing)

Then:

- Public site on Vercel loads `GET https://YOUR-SERVICE.onrender.com/api/menu`
- Book Table / newsletter POST to Render
- `/admin` on Vercel still talks to Render with cookies

### 7. Test the live loop

1. Vercel site → book a table and subscribe
2. `https://your-vercel-app.vercel.app/admin` → sign in
3. Confirm the booking, change a wine price
4. Refresh the public page — menu should update

If admin login fails in the browser: `CLIENT_ORIGIN` must match the Vercel origin exactly (`https://...`, no slash). `CROSS_SITE_COOKIES` must be `true`.

Optional: instead of clicking through the dashboard, you can use the Blueprint file [`render.yaml`](render.yaml) (**New** → **Blueprint**). You still type `CLIENT_ORIGIN` and `ADMIN_PASSWORD` yourself.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | React app |
| `npm run build` | Production frontend bundle |
| `npm run server` | Express API |
| `npm run server:seed` | Re-seed admin + menu if the menu is empty |
