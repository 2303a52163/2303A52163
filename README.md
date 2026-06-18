# Campus Notification App — Frontend

A React-based campus notification platform built for the **AffordMed Campus Hiring Evaluation (Frontend Track)**.

---

## Tech Stack

- **React 19** — UI library
- **Vite** — Build tool & dev server
- **Material UI (MUI v9)** — Component library (only styling library used)
- **JavaScript (ES Modules)** — No TypeScript

---

## Project Structure

```
notification-app-fe/
├── src/
│   ├── api/
│   │   └── notifications.js       # API layer — fetch notifications
│   ├── components/
│   │   ├── NotificationCard.jsx   # Single notification card with expandable details
│   │   └── NotificationFilter.jsx # Type filter toggle buttons
│   ├── hooks/
│   │   └── useNotifications.js    # Custom hook — fetching, pagination, state
│   ├── pages/
│   │   ├── NotificationsPage.jsx  # All Notifications page
│   │   └── PriorityPage.jsx       # Priority Inbox page
│   ├── utils/
│   │   └── logger.js              # Logging middleware (INFO / WARN / ERROR)
│   ├── App.jsx                    # Root component with tab navigation
│   ├── App.css                    # Base styles
│   └── main.jsx                   # React DOM entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- npm

### Installation & Run

```bash
# Step 1 — Navigate to the frontend folder
cd notification-app-fe

# Step 2 — Install dependencies
npm install

# Step 3 — Start the development server
npm run dev
```

Open your browser and go to: **http://localhost:3000**

### Build for Production

```bash
npm run build
```

---

## Features

### All Notifications Page

- Displays all campus notifications sorted by newest first
- **Filter by type:** All | Placement | Result | Event
- **Paginated** — 10 notifications per page (20 per type, 60 total)
- **New vs Viewed** — new notifications are highlighted with a colored left border; viewed state persists in sessionStorage
- **Expandable Result cards** — click "View details" on Result notifications to see SGPA/CGPA or subject-wise pass/fail breakdown

### Priority Inbox Page

- Shows top N most important notifications
- **Configurable N:** Top 5 / 10 / 15 / 20 (dropdown selector)
- **Priority score formula:**

```
score = typeWeight + recencyScore

typeWeight:   Placement = 3 | Result = 2 | Event = 1
recencyScore: 0–1 based on age (newer = higher, max 30 days)
```

- Displays rank number and score for each notification
- Summary chips show type breakdown of the top N

### Logging Middleware (`src/utils/logger.js`)

Structured logging used throughout the app — no raw `console.log` calls anywhere.

```js
logger.info("context", "message", data)
logger.warn("context", "message", data)
logger.error("context", "message", data)
```

Each log entry includes: `timestamp`, `level`, `context`, `message`, `data`.

---

## Notification Types

| Type | Examples |
|------|---------|
| **Placement** | Company drives, selection rounds, offer letters, interview schedules |
| **Result** | Semester results (SGPA/CGPA), mid-sem marks, re-mid exams, lab results |
| **Event** | Science Fair, RoboWars, Sparkil Fest, hackathons, guest lectures |

---

## Constraints Met

- Material UI **only** — no ShadCN, no Tailwind, no other CSS libraries
- Runs exclusively on **localhost:3000**
- No user login or registration required
- Logging middleware used at every API call, hook load, and user interaction
- Responsive — works on both desktop and mobile viewports

---

## Author

Submitted as part of AffordMed Campus Hiring Evaluation — Frontend Track (Stage 2).
