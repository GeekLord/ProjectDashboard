# Project Dashboard Web App — TODO List

## 1. Project Setup & Boilerplate
- [x] Choose tech stack (React (Vite, TypeScript) + Node.js/Express + MySQL + TailwindCSS + Chart.js + PWA support)
- [x] Initialize frontend with Vite (React + TypeScript)
- [x] Initialize backend project (Node.js/Express)
- [x] Install backend dependencies (express, mysql2, cors, dotenv, bcrypt, jsonwebtoken)
- [x] Set up version control (Git)
- [x] Configure environment variables (DB, OpenAI API, etc.)
- [x] Set up MySQL database and initial schema
- [x] Seed database with default admin, sample projects, and default forms for all projects

---

## 2. User Authentication & Role Management
- [x] Implement secure login/logout (JWT or session-based)
- [x] Password hashing (bcrypt)
- [x] Session management and security
- [x] Role-based access (Admin, Project Manager)
- [x] Track last login IP and timestamp
- [x] Create default admin user (Bishnu / thakurabhiram@2)
- [ ] User registration (admin only)
- [x] Middleware for role-based route protection

---

## 3. Frontend Dashboard Features
- [x] Sidebar navigation with NavLink and active styling
- [x] Dashboard overview: summary cards, animated chart, search/filter bar
- [x] Users management: table, search/filter, add/edit/delete user modals
- [x] Projects management: table, search/filter, add/edit/delete, assign/unassign managers
- [x] Forms: list per project, drag-and-drop form builder, save/load schema (default forms seeded for all projects)
- [ ] Entries: data entry UI for PMs, list/search/edit/delete own entries
- [x] Dropdown filters and search bars for all tables/lists
- [x] All UI modern, interactive, colorful, and supports dark mode

---

## 4. Backend Features
- [x] User CRUD and role assignment
- [x] Project CRUD and manager assignment
- [x] Dynamic form schema CRUD (default forms seeded)
- [x] Data entry endpoints with audit trail
- [x] OpenAI integration for reports

---

## 5. PWA Support
- [ ] Add manifest.json for installability
- [ ] Implement service worker for offline caching
- [ ] Test install on mobile devices

---

## 6. Security & Validation
- [ ] Server-side validation and sanitization
- [ ] Secure API endpoints
- [ ] Input validation on all forms

---

## 7. Testing & QA
- [ ] Unit and integration tests (backend & frontend)
- [ ] Manual QA for all user flows
- [ ] Test on multiple devices and browsers

---

## 8. Documentation & Deployment
- [x] Keep documentation updated with all progress and changes
- [ ] Write setup and usage documentation
- [ ] Deployment scripts/config (Docker, cloud, etc.)
- [ ] Final code review and cleanup 