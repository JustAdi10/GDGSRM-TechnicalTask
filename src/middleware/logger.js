const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const createLogsDir = () => {
  const dir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Logger middleware
const logger = (req, res, next) => {
  const logsDir = createLogsDir();
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const logFilePath = path.join(logsDir, `${date}.log`);
  
  const logData = {
    timestamp: now.toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user ? req.user.id : 'unauthenticated'
  };
  
  // Append log to file
  fs.appendFile(
    logFilePath,
    JSON.stringify(logData) + '\n',
    (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    }
  );
  
  next();
};

module.exports = logger;
