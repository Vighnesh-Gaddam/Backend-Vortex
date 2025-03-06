// import { createLogger, format, transports } from "winston";
// const { combine, timestamp, json, colorize } = format;

// // Custom format for console logging with colors
// const consoleLogFormat = format.combine(
//   format.colorize(),
//   format.printf(({ level, message, timestamp }) => {
//     return `${level}: ${message}`;
//   })
// );

// // Create a Winston logger
// const logger = createLogger({
//   level: "info",
//   format: combine(colorize(), timestamp(), json()),
//   transports: [
//     new transports.Console({
//       format: consoleLogFormat,
//     }),
//     new transports.File({ filename: "app.log" }),
//   ],
// });

// export default logger;

import { createLogger, format, transports } from "winston";
import chalk from "chalk";

const { combine, timestamp, printf } = format;

// Define colors for different log fields
const colors = {
  time: chalk.blue.italic,           // Timestamp: Blue
  method: chalk.cyan.bold,         // Method: Cyan
  url: chalk.green.bold,           // URL: Green
  status: chalk.yellow.bold,       // Status: Yellow
  responseTime: chalk.magenta.bold // Response Time: Magenta
};

// Custom format for colorful JSON logs with timestamp first
const logFormat = printf(({ timestamp, message }) => {
  try {
    const logObject = JSON.parse(message);
    return `info: { ` +
           `"${colors.time("time")}": "${colors.time(timestamp)}", ` +  // Timestamp first
           `"${chalk.white("method")}": "${colors.method(logObject.method)}", ` +
           `"${chalk.white("url")}": "${colors.url(logObject.url)}", ` +
           `"${chalk.white("status")}": "${colors.status(logObject.status)}", ` +
           `"${chalk.white("responseTime")}": "${colors.responseTime(logObject.responseTime)} ms"` +
           ` }`;
  } catch (e) {
    return message; // If the log is not in JSON format, return as-is
  }
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format:  combine(
    timestamp({ format: () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) }), // Set IST
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;
