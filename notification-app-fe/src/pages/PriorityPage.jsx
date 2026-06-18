import { useState, useMemo } from "react";
import {
  Alert, Box, CircularProgress, Divider, FormControl,
  InputLabel, MenuItem, Select, Stack, Typography, Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import logger from "../utils/logger";

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const MAX_AGE_MS  = 30 * 24 * 60 * 60 * 1000;
const TOP_OPTIONS = [5, 10, 15, 20];

function score(n) {
  const w = TYPE_WEIGHT[n.Type] ?? 0;
  const age = Date.now() - new Date(n.Timestamp).getTime();
  const recency = Math.max(0, 1 - age / MAX_AGE_MS);
  return w + recency;
}

export function PriorityPage() {
  const [topN, setTopN] = useState(5);

  // Fetch all 60 at once (page=1, large limit simulated by 3 pages)
  const { notifications: p1, loading: l1, error: e1 } = useNotifications({ page: 1, filter: null });
  const { notifications: p2, loading: l2 } = useNotifications({ page: 2, filter: null });
  const { notifications: p3, loading: l3 } = useNotifications({ page: 3, filter: null });

  const loading = l1 || l2 || l3;
  const error   = e1;

  const prioritised = useMemo(() => {
    const all = [...p1, ...p2, ...p3];
    return all.sort((a, b) => score(b) - score(a)).slice(0, topN);
  }, [p1, p2, p3, topN]);

  logger.info("PriorityPage", "Rendered", { topN, total: prioritised.length });

  const typeCount = prioritised.reduce((acc, n) => {
    acc[n.Type] = (acc[n.Type] ?? 0) + 1; return acc;
  }, {});

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <StarIcon sx={{ fontSize: 28, color: "warning.main" }} />
        <Typography variant="h5" fontWeight={700}>Priority Inbox</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Ranked by type weight <strong>(Placement &gt; Result &gt; Event)</strong> and recency.
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Show top</InputLabel>
          <Select value={topN} label="Show top"
            onChange={(e) => { logger.info("PriorityPage", "topN", e.target.value); setTopN(e.target.value); }}>
            {TOP_OPTIONS.map((n) => <MenuItem key={n} value={n}>Top {n}</MenuItem>)}
          </Select>
        </FormControl>
        {!loading && Object.entries(typeCount).map(([type, count]) => (
          <Chip key={type} label={`${type}: ${count}`} size="small"
            color={type === "Placement" ? "success" : type === "Result" ? "primary" : "warning"}
            variant="outlined" />
        ))}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {loading && <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>}
      {!loading && error && <Alert severity="error">Failed to load: {error}</Alert>}
      {!loading && !error && prioritised.length === 0 && <Alert severity="info">No notifications available.</Alert>}

      {!loading && !error && prioritised.length > 0 && (
        <Stack spacing={1.5}>
          {prioritised.map((n, idx) => (
            <Box key={n.ID}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, pl: 0.5 }}>
                #{idx + 1} — Score: {score(n).toFixed(2)}
              </Typography>
              <NotificationCard notification={n} isNew={false} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
