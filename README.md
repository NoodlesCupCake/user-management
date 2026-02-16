# UserHub — User Management Dashboard

A full-stack user management application for learning **Next.js App Router**, **TanStack Query**, **PocketBase**, **Tailwind CSS**, and **hello-csv**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query (React Query) |
| Backend / DB | PocketBase |
| CSV Import | hello-csv |
| Containerization | Docker Compose |

## Key Concepts

- **TanStack Query** — `useQuery` for fetching, `useMutation` + `invalidateQueries` for mutations
- **Slug Routing** — Dynamic `[slug]` routes in Next.js for user detail pages
- **PocketBase Migrations** — JS-based database schema & seed via `pb_migrations/`
- **hello-csv** — Frontend CSV import with column mapping and validation

## Quick Start (Local Development)

### 1. Start PocketBase

```bash
cd pocketbase
# Download PocketBase if not already present (Windows):
# Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.25.9/pocketbase_0.25.9_windows_amd64.zip" -OutFile "pocketbase.zip"
# Expand-Archive pocketbase.zip -DestinationPath . -Force

./pocketbase serve
```

Migrations in `pb_migrations/` will apply automatically. Admin UI at http://127.0.0.1:8090/_/

**Default superuser:** `admin@example.com` / `admin12345678`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- PocketBase API: http://localhost:8090
- PocketBase Admin: http://localhost:8090/_/

## Project Structure

```
├── docker-compose.yml
├── pocketbase/
│   ├── Dockerfile
│   └── pb_migrations/
│       ├── 1_create_people.js      # Creates "people" collection
│       ├── 2_seed_people.js        # Seeds 5 sample users
│       └── 3_create_superuser.js   # Creates admin account
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          # Root layout + providers
│       │   ├── users/
│       │   │   ├── page.tsx        # User list (TanStack useQuery)
│       │   │   ├── new/page.tsx    # Create user (useMutation)
│       │   │   ├── import/page.tsx # CSV import (hello-csv)
│       │   │   └── [slug]/
│       │   │       ├── page.tsx    # User detail (slug route)
│       │   │       └── edit/page.tsx
│       ├── hooks/useUsers.ts       # TanStack Query hooks
│       ├── lib/
│       │   ├── pocketbase.ts       # PB client
│       │   └── types.ts            # TypeScript interfaces
│       └── components/
│           ├── Navbar.tsx
│           ├── UserCard.tsx
│           └── UserForm.tsx
```

## CSV Import Format

```csv
name,email,role,phone,slug,status
John Doe,john@example.com,member,+1-555-0100,john-doe,active
```

Only **name** and **email** are required. Other fields use defaults.
