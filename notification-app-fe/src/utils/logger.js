// Logging Middleware
const LOG_LEVELS = { INFO: "INFO", WARN: "WARN", ERROR: "ERROR" };

function formatLog(level, context, message, data = null) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...(data !== null ? { data } : {}),
  };
  const prefix = `[${entry.timestamp}] [${level}] [${context}]`;
  if (level === LOG_LEVELS.ERROR) {
    console.error(prefix, message, data ?? "");
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(prefix, message, data ?? "");
  } else {
    console.info(prefix, message, data ?? "");
  }
  return entry;
}

const logger = {
  info: (context, message, data) => formatLog(LOG_LEVELS.INFO, context, message, data),
  warn: (context, message, data) => formatLog(LOG_LEVELS.WARN, context, message, data),
  error: (context, message, data) => formatLog(LOG_LEVELS.ERROR, context, message, data),
};

export default logger;
