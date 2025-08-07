const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logData = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`;
  }

  writeToFile(filename, message) {
    try {
      fs.appendFileSync(filename, message + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  info(message, data = null) {
    const formattedMessage = this.formatMessage('info', message, data);
    console.log('\x1b[36m%s\x1b[0m', formattedMessage); // Cyan
    this.writeToFile(this.logFile, formattedMessage);
  }

  warn(message, data = null) {
    const formattedMessage = this.formatMessage('warn', message, data);
    console.warn('\x1b[33m%s\x1b[0m', formattedMessage); // Yellow
    this.writeToFile(this.logFile, formattedMessage);
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      code: error.code
    } : null;
    const formattedMessage = this.formatMessage('error', message, errorData);
    console.error('\x1b[31m%s\x1b[0m', formattedMessage); // Red
    this.writeToFile(this.errorFile, formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, data);
      console.log('\x1b[35m%s\x1b[0m', formattedMessage); // Magenta
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  success(message, data = null) {
    const formattedMessage = this.formatMessage('success', message, data);
    console.log('\x1b[32m%s\x1b[0m', formattedMessage); // Green
    this.writeToFile(this.logFile, formattedMessage);
  }

  // Clean old log files (keep last 30 days)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(logsDir);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          this.info(`Cleaned old log file: ${file}`);
        }
      });
    } catch (err) {
      this.error('Failed to clean old logs:', err);
    }
  }
}

const logger = new Logger();

// Clean old logs on startup
logger.cleanOldLogs();

module.exports = { logger };
