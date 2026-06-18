import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import logger from "../utils/logger";

const PAGE_SIZE = 10;

export function useNotifications({ page = 1, filter = null } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    logger.info("useNotifications", "Loading", { page, filter });
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({
        page,
        limit: PAGE_SIZE,
        notification_type: filter,
      });
      setNotifications(data.notifications ?? []);
      const t = data.total ?? data.notifications?.length ?? 0;
      setTotal(t);
      setTotalPages(Math.max(1, Math.ceil(t / PAGE_SIZE)));
    } catch (err) {
      logger.error("useNotifications", "Failed", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  return { notifications, total, totalPages, loading, error, reload: load };
}
