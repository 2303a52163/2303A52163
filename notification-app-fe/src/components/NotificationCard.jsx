import { Box, Chip, Collapse, Divider, Paper, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const TYPE_CONFIG = {
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
  Result:    { color: "primary", icon: <AssessmentIcon fontSize="small" /> },
  Event:     { color: "warning", icon: <EventIcon fontSize="small" /> },
};

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch { return ts; }
}

function ExtraDetail({ extra }) {
  if (!extra) return null;
  if (extra.sgpa !== undefined) {
    return (
      <Box mt={1} display="flex" gap={2}>
        <Chip label={`SGPA: ${extra.sgpa}`} size="small" color="primary" variant="outlined" />
        <Chip label={`CGPA: ${extra.cgpa}`} size="small" color="secondary" variant="outlined" />
      </Box>
    );
  }
  if (extra.subjects) {
    return (
      <Table size="small" sx={{ mt: 1, maxWidth: 340 }}>
        <TableBody>
          {Object.entries(extra.subjects).map(([sub, val]) => {
            const pass = val.startsWith("Pass");
            return (
              <TableRow key={sub}>
                <TableCell sx={{ py: 0.5, pl: 0, border: 0 }}><Typography variant="caption">{sub}</Typography></TableCell>
                <TableCell sx={{ py: 0.5, border: 0 }}>
                  <Chip label={val} size="small" color={pass ? "success" : "error"} variant="outlined" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
  return null;
}

export function NotificationCard({ notification, isNew = false }) {
  const { Type, Message, Timestamp, extra } = notification;
  const config = TYPE_CONFIG[Type] ?? { color: "default", icon: null };
  const [expanded, setExpanded] = useState(false);
  const hasExtra = !!extra;

  return (
    <Paper
      elevation={isNew ? 3 : 1}
      sx={{
        p: 2,
        borderLeft: isNew ? 4 : 2,
        borderColor: isNew ? `${config.color}.main` : "grey.200",
        borderStyle: "solid",
        backgroundColor: isNew ? "action.hover" : "background.paper",
        cursor: hasExtra ? "pointer" : "default",
      }}
      onClick={() => hasExtra && setExpanded((e) => !e)}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
            <Chip icon={config.icon} label={Type} color={config.color} size="small" sx={{ fontWeight: 600 }} />
            {isNew && <Chip label="New" size="small" color="secondary" variant="outlined" />}
            {hasExtra && (
              <Chip
                icon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                label={expanded ? "Hide details" : "View details"}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{Message}</Typography>
          {hasExtra && (
            <Collapse in={expanded}>
              <Divider sx={{ my: 1 }} />
              <ExtraDetail extra={extra} />
            </Collapse>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 1 }}>
          {formatTime(Timestamp)}
        </Typography>
      </Box>
    </Paper>
  );
}
