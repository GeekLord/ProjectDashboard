# Project Dashboard Web App

## Overview
A modern, responsive web application for project management, data collection, and reporting. Features robust user management, dynamic form building, role-based access, and PWA capabilities. Ideal for organizations coordinating project managers, collecting field data, and generating actionable insights.

---

## Key Features
- Sidebar navigation with active highlighting
- Dashboard overview: summary cards, animated chart, search/filter bar
- Users management: table, search/filter, add/edit/delete user modals
- Projects management: table, search/filter, add/edit/delete, assign/unassign managers
- Forms: list per project, drag-and-drop form builder, save/load schema
- Entries: data entry UI for PMs, list/search/edit/delete own entries
- Dropdown filters and search bars for all tables/lists
- All UI modern, interactive, creative, colorful, and supports dark mode (toggle in dashboard sidebar)
- User authentication & role management (Admin, Project Manager)
- Secure login/logout, password hashing, session security
- Admin: Manage users/projects, assign project managers, build forms
- Project Manager: View assigned projects, enter data, manage entries
- Dynamic drag-and-drop form builder (JSON schema)
- Data collection with audit trail (IP, GPS, user agent)
- Responsive dashboard with charts, filters, and AI-generated reports (planned)
- Excel upload & processing
- PWA: Installable, offline support
- Default forms are seeded for all projects as per the instructions (see db/seed.sql)
- Forms builder UI is complete and supports all required field types

---

## Tech Stack (Updated)
- **Frontend:** React (Vite, TypeScript), TailwindCSS, Chart.js, PWA
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Other:** JWT, bcrypt, OpenAI API (planned)

---

## API Endpoints (Backend)
- `POST /api/auth/login` — User login (JWT)
- `GET /api/users` — List users (admin)
- `POST /api/users` — Add user (admin)
- `PUT /api/users/:id` — Edit user (admin)
- `DELETE /api/users/:id` — Delete user (admin)
- `GET /api/projects` — List all projects (admin) or assigned projects (project manager)
- `POST /api/projects` — Create project (admin)
- `PUT /api/projects/:id` — Update project (admin)
- `DELETE /api/projects/:id` — Delete project (admin)
- `POST /api/projects/:id/assign` — Assign/unassign project manager (admin)
- `GET /api/forms/:project_id` — Get form schema for a project
- `POST /api/forms/:project_id` — Create form schema (admin)
- `PUT /api/forms/:project_id` — Update form schema (admin)
- `DELETE /api/forms/:project_id` — Delete form schema (admin)
- `GET /api/entries` — List entries (admin: all, pm: own)
- `POST /api/entries` — Submit entry (pm only)
- `PUT /api/entries/:id` — Edit own entry (pm only)
- `DELETE /api/entries/:id` — Delete own entry (pm only)
- `POST /api/openai/report` — Generate project report using o4-mini OpenAI model

---

## Directory Structure
- `/client` — React (Vite) frontend
- `/server` — Node.js backend
- `/db` — SQL scripts

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MySQL
- Git

### 1. Clone the repository
```bash
git clone <repo-url>
cd Dashboard
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env # Edit DB credentials, JWT secret, etc.
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Setup Database
- Create a MySQL database
- Run scripts in `/db/schema.sql` and `/db/seed.sql`

---

## Usage
- Admin: Manage users, projects, forms, view all data, download reports
- Project Manager: View assigned projects, enter/manage data
- Dashboard: Use sidebar for navigation, search/filter for quick access, and dark mode toggle for theme
- Login: JWT is stored in localStorage after successful login; used for authenticated API requests

---

## Other Features
- AI-generated project reports (OpenAI API)
- Excel import (one sheet per project)
- PDF Export

---

## License
MIT 