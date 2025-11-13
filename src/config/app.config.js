/**
 * Application Configuration
 * Centralizes all environment variables and app settings
 */

require("dotenv").config()

const config = {
  // Server settings
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || "v1",

  // Database settings
  database: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/express-template",
    name: process.env.DB_NAME || "express_template",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || "change_this_secret_key",
    expiresIn: process.env.JWT_EXPIRE || "7d",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "change_this_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },

  // Security
  security: {
    bcryptSaltRounds: 10,
  },
}

const validateConfig = () => {
  if (config.env === "production") {
    const required = ["JWT_SECRET", "JWT_REFRESH_SECRET", "MONGODB_URI"]
    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(
          ", "
        )}`
      )
    }
  }
}

validateConfig()

module.exports = config
