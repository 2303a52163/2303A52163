# Notification System Design

## Stage 1

### Priority Inbox Approach

The Priority Inbox surfaces the top **N** most important notifications (N configurable: 5, 10, 15, 20) from the existing API feed.

**Priority Score Formula:**

```
score = typeWeight + recencyScore

typeWeight:
  Placement → 3
  Result    → 2
  Event     → 1

recencyScore = max(0, 1 - ageMs / 30_days_in_ms)
  Range: 0–1, so newer notifications get up to +1 bonus
```

This means a recent Placement always outranks an old Placement, and a very recent Event can outrank an old Result.

**Efficient Top-N Maintenance:**

Since the API is paginated, the frontend fetches a large batch (limit=50) on the Priority page and computes scores in O(n log n) via sort. As new notifications arrive in subsequent fetches, the sort is re-run. This avoids a database query and is sufficient for the scale described.

---

## Stage 2

### Frontend Architecture

The React app (`notification-app-fe`) is a single-page app built with Vite + React 19 + Material UI.

**Pages:**
- `NotificationsPage` — displays all notifications with filter (All / Placement / Result / Event) and server-side pagination.
- `PriorityPage` — client-side priority scoring with configurable top-N selector.

**Key Components:**
- `NotificationCard` — renders a single notification with type chip, new/viewed badge, message, and timestamp.
- `NotificationFilter` — MUI ToggleButtonGroup for type filtering.

**Hook: `useNotifications`**
- Accepts `{ page, filter }` params.
- Calls `fetchNotifications` from the API layer.
- Returns `{ notifications, total, totalPages, loading, error }`.
- Dependency array is `[page, filter]` — no infinite loops.

**Viewed/New Distinction:**
- IDs of fetched notifications are stored in `sessionStorage`.
- On next fetch, any ID not yet in storage is marked "New" with a highlighted left border.
- Resets on tab/session close so returning users see "new" again.

**Logging Middleware (`src/utils/logger.js`):**
- Structured log entries: `{ timestamp, level, context, message, data }`.
- Three levels: `INFO`, `WARN`, `ERROR`.
- Used at every API call, hook load, filter change, and page change.
- No `console.log` used directly anywhere — all logging goes through the middleware.

**API Layer (`src/api/notifications.js`):**
- Single function `fetchNotifications({ page, limit, notification_type })`.
- Sends `Authorization` header for the protected route.
- Full error handling with logger on both HTTP errors and network failures.

**Constraints met:**
- Material UI only (no ShadCN, no Tailwind, no other CSS libraries).
- Runs on `localhost:3000` (via `vite --port 3000`).
- Responsive — tested on mobile viewport.
- No user registration or login required.
