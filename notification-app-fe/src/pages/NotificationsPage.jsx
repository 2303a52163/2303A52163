import { useState, useMemo } from "react";
import {
  Alert, Badge, Box, CircularProgress, Divider,
  Pagination, Stack, Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import logger from "../utils/logger";

function getViewedIds() {
  try { return new Set(JSON.parse(sessionStorage.getItem("viewedIds") ?? "[]")); }
  catch { return new Set(); }
}
function markViewed(ids) {
  const existing = getViewedIds();
  ids.forEach((id) => existing.add(id));
  sessionStorage.setItem("viewedIds", JSON.stringify([...existing]));
}

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage]     = useState(1);

  const { notifications, total, totalPages, loading, error } = useNotifications({
    page,
    filter: filter === "All" ? null : filter,
  });

  const viewedIds = getViewedIds();
  useMemo(() => { markViewed(notifications.map((n) => n.ID)); }, [notifications]);

  const newCount = notifications.filter((n) => !viewedIds.has(n.ID)).length;

  const handleFilterChange = (f) => {
    logger.info("NotificationsPage", "filter", f);
    setFilter(f);
    setPage(1);
  };
  const handlePageChange = (_, p) => {
    logger.info("NotificationsPage", "page", p);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <Badge badgeContent={newCount || null} color="error" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>Notifications</Typography>
        {!loading && total > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
            {total} notification{total !== 1 ? "s" : ""}
          </Typography>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      )}
      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications for "{filter}".</Alert>
      )}
      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((n) => (
            <NotificationCard key={n.ID} notification={n} isNew={!viewedIds.has(n.ID)} />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange}
            color="primary" shape="rounded" showFirstButton showLastButton />
        </Box>
      )}
    </Box>
  );
}
