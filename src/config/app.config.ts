import dotenv from "dotenv"

dotenv.config()

interface AppConfig {
  env: string
  port: number
  apiVersion: string
  database: {
    uri: string
    name: string
    options: {
      useNewUrlParser: boolean
      useUnifiedTopology: boolean
    }
  }
  jwt: {
    secret: string
    expiresIn: string
    refreshSecret: string
    refreshExpiresIn: string
  }
  cors: {
    origin: string
    credentials: boolean
  }
  rateLimit: {
    windowMs: number
    max: number
  }
  logging: {
    level: string
  }
  security: {
    bcryptSaltRounds: number
  }
}

const config: AppConfig = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  apiVersion: process.env.API_VERSION || "v1",

  database: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/express-template",
    name: process.env.DB_NAME || "express_template",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || "change_this_secret_key",
    expiresIn: process.env.JWT_EXPIRE || "7d",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "change_this_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
  },

  security: {
    bcryptSaltRounds: 10,
  },
}

const validateConfig = (): void => {
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

export default config

