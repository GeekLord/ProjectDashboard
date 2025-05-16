# Project Dashboard Web App

## Overview

Create a Project Management Dashboard which is a modern, responsive web application designed to streamline the management, data collection, and reporting of multiple projects by different Project Managers and managed by admin users (Full CRUD access), it features robust user management, dynamic form building (drag and drop), role-based access, and PWA capabilities for offline use. The app is ideal for organizations needing to coordinate project managers, collect field data, and generate actionable insights. Dashboard shows Graphs and Charts with filters for project, dates, states, client etc and project reports generated with AI on the selected project and other filters (Using OpenAI API keys).

---

## Modern Dashboard Features (Frontend)
- Sidebar navigation with active highlighting
- Dashboard overview: summary cards, animated chart, search/filter bar
- Users management: table, search/filter, add/edit/delete user modals
- Projects management: table, search/filter, add/edit/delete, assign/unassign managers
- Forms: list per project, drag-and-drop form builder, save/load schema
- Entries: data entry UI for PMs, list/search/edit/delete own entries
- Dropdown filters and search bars for all tables/lists
- All UI modern, interactive, colorful, and supports dark mode (toggle in sidebar)

---

## Tech Stack (Updated)
- **Frontend:** React (Vite, TypeScript), TailwindCSS, Chart.js, PWA
- **Backend:** Node.js (Express)
- **Database:** MySQL
- **Other:** JWT, bcrypt, OpenAI API (planned)

---

## Key Features

- **User Authentication & Role Management**
  - Secure login/logout with session management
  - Role-based access: Admins (full control), Project Managers (limited to assigned projects)
  - Password hashing and session security
  - Tracks last login IP and timestamp
  - MySQL database on localhost

- **Admin Capabilities**
  - Manage users (CRUD: add, edit, delete, list)
  - Manage projects (CRUD: add, edit, delete, list)
  - Assign/unassign project managers to projects
  - Build and customize project-specific data entry forms using a drag-and-drop form builder
  - Create the default admin with these credentials: User: Bishnu Password: thakurabhiram@2.

- **Project Manager Capabilities**
  - View assigned projects
  - Enter data using dynamic forms tailored to each project
  - View, edit, and delete their own past entries
  - Audit trail: see submission IP, GPS (if available), and browser user agent

- **Dynamic Form Builder**
  - Admins can create and modify forms for each project (fields: text, number, date, textarea, dropdown, required flags, etc.)
  - Forms are stored as JSON schemas in the database
  - Drag-and-drop UI for easy form design

- **Data Collection & Validation**
  - Project Managers submit data via dynamic forms
  - Captures IP address, browser user agent, and (optionally) GPS location
  - Server-side validation and sanitization
  - Data stored as JSON payloads for flexibility

- **Dashboard & Insights**
  - Modern, responsive dashboard UI (TailwindCSS-based)
  - Data tables and interactive charts/graphs (e.g., Chart.js)
  - Color Gradients and Animations
  - Role-based data visibility and filters (project, state, date range)
  - (Planned) OpenAI API integration for automated insights and trend analysis
  - (Planned) Excel export for admins (one sheet per project)

- **PWA (Progressive Web App) Support**
  - Installable on mobile devices
  - Offline access via service worker caching
  - Manifest for home screen icon and theming

- **Excel Upload & Processing**
  - Upload Excel/CSV files, validate, and import data into the system

## Current Projects

The following projects are currently set up in the system (as per the sample data):

| Project Name         | Description                              |
|---------------------|-------------------------------------------|
| Brick Kiln          | Brick Kiln worker Survey                  |
| Kris_MLA            | Indian politicians views on democracy     |
| Vignesh_MLA         | Vignesh MLA Survey                        |
| Adam                | Adam Survey                               |
| Nikhitha_Academic   | Nikhitha Academic Survey                  |
| ECD                 | ECD Survey in Odisha                      |
| Kompal              | IndiQoL Survey for Kompal                 |
| Rubina              | Rubina Survey                             |
---

## Data Entry Form Fields

The following fields are currently used in the default data entry form for all projects (can be CRUD by admin):

| Field Name         | Label              | Type      | Required |
|--------------------|--------------------|-----------|----------|
| Date               | Date               | date      | Yes      |
| State              | State              | Select One| Yes      |
| Project_Manager    | Project Manager    | text      | No       |
| School             | School             | text      | No       |
| Total_Sample       | Total Sample       | number    | No       |
| Total_Enumerator   | Total Enumerator   | number    | No       |
| Productivity       | Productivity       | number    | No       |
| Remaining_Sample   | Remaining Sample   | number    | No       |
| Total_WTP          | Total WTP          | number    | No       |
| Total_Lottey       | Total Lottey       | number    | No       |
| Total_Completed    | Total Completed    | number    | No       |
| Remark             | Remark             | textarea  | No       |

---

## Database Design

- **users**: Admins and Project Managers, with login info, roles, and tracking fields
- **projects**: Project metadata, linked to creator (admin)
- **project_manager_assignments**: Which PMs are assigned to which projects
- **project_data_entries**: All submitted data, with audit fields (IP, GPS, user agent, etc.)


## Usage

- **Admins**
  - Log in and access the dashboard
  - Manage users and projects
  - Assign project managers
  - Build and update project forms
  - View all data and download reports (planned)
  - View Graphs and Charts and project reports made with AI

- **Project Managers**
  - Log in to see assigned projects
  - Enter data via dynamic forms
  - View and manage their own entries

## Entries (Data Entry & Listing) UI for Project Managers

### Overview
Project managers can fill out dynamic forms for their assigned projects and view, edit, or delete their own entries. The UI is modern, accessible, and uses TailwindCSS for styling.

### Backend/API Endpoints
- `GET /api/projects/:projectId/forms` — Fetch form schema for a project
- `GET /api/projects/:projectId/entries` — List entries for the current user and project
- `POST /api/projects/:projectId/entries` — Create a new entry
- `PUT /api/projects/:projectId/entries/:entryId` — Edit an entry
- `DELETE /api/projects/:projectId/entries/:entryId` — Delete an entry
- `GET /api/projects` — List assigned projects for the current user

### Frontend UI Structure
- **Sidebar:** List of assigned projects
- **Main Area:**
  - Tabs or section switcher: "New Entry" | "My Entries"
  - **New Entry:** Dynamic form (fields from schema, validation, submit)
  - **My Entries:** Table of user's entries (edit/delete actions)
  - **Edit Entry:** Modal or inline form, pre-filled with entry data

### Components
- `EntriesPage` (per project)
  - `DynamicForm` (renders fields from schema)
  - `EntriesTable` (lists entries, edit/delete)
  - `EntryEditModal` (for editing)
- **Routing:** `/projects/:projectId/entries`

### UX & UI Notes
- All styling with TailwindCSS
- Accessible forms and tables
- Show success/error toasts
- Confirm before delete
- Dark mode support

### Flow
1. Project manager selects a project from the sidebar
2. Can switch between creating a new entry and viewing their entries
3. Dynamic form is rendered based on project schema
4. Entries table lists only the current user's entries for the project
5. Edit and delete actions are available for each entry