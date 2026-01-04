import { ENV } from "../config/env.js"

const config = ENV

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const currentLevel = levels[config.logLevel] || levels.info

const log = (level, message, data = null) => {
  if (levels[level] <= currentLevel) {
    const timestamp = new Date().toISOString()
    const logData = data ? ` ${JSON.stringify(data)}` : ""
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`)
  }
}

export default {
  error: (message, data) => log("error", message, data),
  warn: (message, data) => log("warn", message, data),
  info: (message, data) => log("info", message, data),
  debug: (message, data) => log("debug", message, data),
}
