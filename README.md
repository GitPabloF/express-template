# Express API Template

A Express.js API template with best practices for quick development.

## Features

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **MongoDB/Mongoose** - Database integration with schemas
- **Request Validation** - Express-validator for input validation
- **Error Handling** - Centralized error handling
- **Rate Limiting** - Protect against abuse
- **Logging** - Winston logger with file transports
- **Security** - Helmet, CORS, bcrypt password hashing
- **Docker Ready** - Docker Compose setup included
- **Testing** - Jest configuration included

## Quick Start

### With Docker (Recommended)

```bash
npm install
npm run docker:up
```

The API will be available at `http://localhost:3000`

### Without Docker

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env` file** in root:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/express-template
JWT_SECRET=your_jwt_secret_change_this
JWT_REFRESH_SECRET=your_refresh_secret_change_this
```

3. **Start MongoDB** (make sure it's running on port 27017)

4. **Run the server**

```bash
npm run dev
```

## Project Structure

```
src/
├── config/          # Configuration (database, app settings)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, validation, errors)
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── validators/      # Input validation rules
├── app.js           # Express app setup
└── server.js        # Entry point
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `POST /api/v1/auth/logout` - Logout user (protected)

### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (protected)
- `PUT /api/v1/users/:id` - Update user (protected)
- `DELETE /api/v1/users/:id` - Delete user (admin only)
- `PUT /api/v1/users/:id/password` - Update password (protected)

### Products

- `GET /api/v1/products` - Get all products (public)
- `GET /api/v1/products/:id` - Get product by ID (public)
- `POST /api/v1/products` - Create product (protected)
- `PUT /api/v1/products/:id` - Update product (protected)
- `DELETE /api/v1/products/:id` - Delete product (protected)

## Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Use Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "electronics",
    "stock": 10
  }'
```

### Query Products

```bash
curl "http://localhost:3000/api/v1/products?category=electronics&minPrice=500&page=1&limit=10"
```

## Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm test               # Run tests with Jest
npm run test:watch     # Run tests in watch mode
npm run docker:up      # Start with Docker Compose
npm run docker:down    # Stop Docker Compose
npm run docker:logs    # View Docker logs
```

## Environment Variables

| Variable           | Description               | Default                                    |
| ------------------ | ------------------------- | ------------------------------------------ |
| NODE_ENV           | Environment               | development                                |
| PORT               | Server port               | 3000                                       |
| MONGODB_URI        | MongoDB connection string | mongodb://localhost:27017/express-template |
| JWT_SECRET         | JWT secret key            | (required in production)                   |
| JWT_EXPIRE         | JWT expiration            | 7d                                         |
| JWT_REFRESH_SECRET | Refresh token secret      | (required in production)                   |
| JWT_REFRESH_EXPIRE | Refresh token expiration  | 30d                                        |
| CORS_ORIGIN        | Allowed CORS origin       | http://localhost:3000                      |
| LOG_LEVEL          | Logging level             | info                                       |

## Authentication Flow

1. **Register/Login** → Receive `token` and `refreshToken`
2. **Use Token** → Add to `Authorization: Bearer <token>` header
3. **Refresh Token** → When token expires, use refresh endpoint

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## Adding New Features

### 1. Create Model

```javascript
// src/models/YourModel.js
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  name: { type: String, required: true },
})

module.exports = mongoose.model("YourModel", schema)
```

### 2. Create Service

```javascript
// src/services/your.service.js
const YourModel = require("../models/YourModel")

const create = async (data) => {
  return await YourModel.create(data)
}

module.exports = { create }
```

### 3. Create Controller

```javascript
// src/controllers/your.controller.js
const yourService = require("../services/your.service")
const asyncHandler = require("../utils/asyncHandler")
const { successResponse } = require("../utils/response")

const create = asyncHandler(async (req, res) => {
  const result = await yourService.create(req.body)
  successResponse(res, result, "Created successfully", 201)
})

module.exports = { create }
```

### 4. Create Routes

```javascript
// src/routes/your.routes.js
const express = require("express")
const controller = require("../controllers/your.controller")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/", protect, controller.create)

module.exports = router
```

### 5. Register Routes

```javascript
// src/routes/index.js
const yourRoutes = require("./your.routes")
router.use("/yours", yourRoutes)
```

## Security Features

- **Helmet** - Security HTTP headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Request throttling
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Input Validation** - Express-validator
- **Error Handling** - No sensitive info leaks

## Production Checklist

- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB with authentication
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS
- [ ] Enable rate limiting
- [ ] Set up log rotation
- [ ] Configure monitoring/alerting
- [ ] Review security settings

## License

MIT

---

**Built for rapid API development with Express.js** 🚀
