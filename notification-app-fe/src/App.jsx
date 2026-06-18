import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityPage } from "./pages/PriorityPage";
import logger from "./utils/logger";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
  },
});

export default function App() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_, newTab) => {
    logger.info("App", "Tab changed", { tab: newTab });
    setTab(newTab);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ bgcolor: "primary.dark", px: 2 }}
        >
          <Tab icon={<NotificationsIcon />} iconPosition="start" label="All Notifications" />
          <Tab icon={<StarIcon />} iconPosition="start" label="Priority Inbox" />
        </Tabs>
      </AppBar>

      <Box component="main" sx={{ minHeight: "calc(100vh - 112px)", bgcolor: "grey.50" }}>
        {tab === 0 && <NotificationsPage />}
        {tab === 1 && <PriorityPage />}
      </Box>
    </ThemeProvider>
  );
}
