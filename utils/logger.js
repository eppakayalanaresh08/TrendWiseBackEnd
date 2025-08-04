// const winston = require('winston');
// const { combine, timestamp, printf, colorize, json, errors } = winston.format;
// const path = require('path');
// const fs = require('fs');

// // Create logs directory if it doesn't exist
// const logDir = path.join(__dirname, '../logs');
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir, { recursive: true });
// }

// // Custom log format for console
// const consoleFormat = printf(({ level, message, timestamp, stack }) => {
//   const log = `${timestamp} [${level}]: ${stack || message}`;
//   return log;
// });

// // Custom log format for files
// const fileFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
//   let log = {
//     timestamp,
//     level,
//     message: stack || message,
//     ...metadata
//   };
//   return JSON.stringify(log);
// });

// // Create logger instance
// const logger = winston.createLogger({
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   format: combine(
//     errors({ stack: true }), // Capture stack traces
//     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
//   ),
//   transports: [
//     // Console transport (colorized for development)
//     new winston.transports.Console({
//       format: combine(
//         colorize(),
//         consoleFormat
//       ),
//       handleExceptions: true
//     }),
    
//     // File transport for all logs
//     new winston.transports.File({
//       filename: path.join(logDir, 'combined.log'),
//       format: fileFormat,
//       maxsize: 5 * 1024 * 1024, // 5MB
//       maxFiles: 5,
//       tailable: true
//     }),
    
//     // Error-only file transport
//     new winston.transports.File({
//       filename: path.join(logDir, 'errors.log'),
//       level: 'error',
//       format: fileFormat,
//       maxsize: 5 * 1024 * 1024,
//       maxFiles: 3,
//       tailable: true
//     })
//   ],
//   exitOnError: false
// });

// // Add Morgan-like HTTP request logging
// logger.requests = winston.createLogger({
//   level: 'http',
//   format: combine(
//     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     json()
//   ),
//   transports: [
//     new winston.transports.File({
//       filename: path.join(logDir, 'requests.log'),
//       maxsize: 10 * 1024 * 1024, // 10MB
//       maxFiles: 5
//     })
//   ]
// });

// // Add database query logging
// logger.queries = winston.createLogger({
//   level: 'debug',
//   format: combine(
//     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     json()
//   ),
//   transports: [
//     new winston.transports.File({
//       filename: path.join(logDir, 'queries.log'),
//       maxsize: 5 * 1024 * 1024,
//       maxFiles: 3
//     })
//   ]
// });

// // Middleware for Express
// logger.middleware = (req, res, next) => {
//   const start = Date.now();
  
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     const logData = {
//       method: req.method,
//       url: req.originalUrl,
//       status: res.statusCode,
//       responseTime: `${duration}ms`,
//       ip: req.ip,
//       userAgent: req.headers['user-agent']
//     };
    
//     if (res.statusCode >= 400) {
//       logger.error('HTTP Error', logData);
//     } else {
//       logger.http('HTTP Request', logData);
//     }
    
//     logger.requests.info('Request', logData);
//   });
  
//   next();
// };

// // Mongoose query logging
// logger.mongoosePlugin = (schema) => {
//   schema.post(/find|update|delete|insert|save/, function(model, next) {
//     const collection = this.collection.name;
//     const operation = this.op || 'unknown';
//     const duration = this._executionTime;
//     const query = this.getQuery ? this.getQuery() : {};
    
//     logger.queries.debug('Database Query', {
//       collection,
//       operation,
//       duration: `${duration}ms`,
//       query
//     });
    
//     next();
//   });
// };

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   logger.error('Uncaught Exception', error);
//   process.exit(1);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection', { reason, promise });
// });

// module.exports = logger;



const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/scraper.log' })
  ]
});

module.exports = logger;