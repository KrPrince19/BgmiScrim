# 🎮 BgmiScrim — Scrim & Tournament Management System

This repository contains the complete codebase for the BgmiScrim management system, including the Client App (Player-facing), Admin Panel, and a shared Backend Server.

## 🏗️ Architecture & Data Flow
The system is built as a **decoupled multi-app architecture** to ensure security and clear separation of concerns:

1.  **Strict Separation**: The `/client` and `/admin` are independent Next.js applications with their own unique authentication flows.
2.  **Shared Source of Truth**: Both applications connect to the same `/server` (Express/MongoDB).
3.  **Data Sync**:
    *   **Admin Panel**: Used by managers to create/edit scrims and approve player payments.
    *   **Database**: Stores all match details, user profiles, and transaction records.
    *   **Client App**: Fetches and displays those exact scrims from the shared database in real-time.

## 📁 Project Structure
- `/client`: **Player-facing App** (Next.js, Tailwind, JWT)
- `/admin`: **Management Dashboard** (Next.js, Tailwind, Admin Auth)
- `/server`: **Shared API** (Node.js, Express, MongoDB)

---

## 📅 Progress Tracker (10-Day Plan)

### **Part 1 — Client App**
- [x] **Day 1: Setup** (Next.js, Tailwind, Layout) <!-- id: day1_client -->
- [x] **Day 2: Auth** (Login UI, JWT handling) <!-- id: day2_client -->
- [x] **Day 3: Scrim Listing** (API integration, Scrim cards) <!-- id: day3_client -->
- [x] **Day 4: Join Flow** (Join button, Payment redirect) <!-- id: day4_client -->
- [x] **Day 5: Payment UI** (QR + UPI display, WhatsApp button) <!-- id: day5_client -->
- [x] **Day 6: Payment API** (Create pending payment, Save TXID) <!-- id: day6_client -->
- [x] **Day 7: Status Page** (Pending/Approved, Auto-refresh) <!-- id: day7_client -->
- [x] **Day 8: Room Page** (Fetch room data, reveal if approved) <!-- id: day8_client -->
- [x] **Day 9: Error Handling** (Duplicate joins, API errors) <!-- id: day9_client -->
- [x] **Day 10: UI Polish** (Loaders, Toasts, Responsive adjustments) <!-- id: day10_client -->

### **Part 2 — Admin Panel**
- [x] **Day 1: Setup** (Next.js, Admin layout) <!-- id: day1_admin -->
- [ ] **Day 2: Auth** (Admin login, Protected routes) <!-- id: day2_admin -->
- [ ] **Day 3: Dashboard** (Stats, Pending payments overview) <!-- id: day3_admin -->
- [ ] **Day 4: Scrim CRUD** (Create, Edit, Delete matches) <!-- id: day4_admin -->
- [ ] **Day 5: Payment Table** (View all payments, Filters) <!-- id: day5_admin -->
- [ ] **Day 6: Approve/Reject** (Verification actions, DB updates) <!-- id: day6_admin -->
- [ ] **Day 7: Room System** (Add room ID/Password) <!-- id: day7_admin -->
- [ ] **Day 8: Player Management** (Add/Remove players) <!-- id: day8_admin -->
- [ ] **Day 9: Security** (Admin middleware, Role validation) <!-- id: day9_admin -->
- [ ] **Day 10: UI Polish** (Tables, Tables, Alerts, Professional UX) <!-- id: day10_admin -->

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Other:** JWT for Auth, `wa.me` for WhatsApp integration
