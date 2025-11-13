# TypeScript Migration Guide

This Express template is now fully converted to TypeScript! Here's what you need to know.

## What Changed

### File Extensions
- All `.js` files → `.ts` files
- Configuration: `tsconfig.json` added
- Jest: Now uses `ts-jest`

### Type Safety
All code now has full type safety with:
- Interface definitions for models (IUser, IProduct)
- Type annotations for functions
- Express Request/Response types
- Custom type definitions in `src/types/`

### Development Workflow

**Before (JavaScript):**
```bash
npm run dev  # nodemon watched .js files
```

**Now (TypeScript):**
```bash
npm run dev  # ts-node-dev watches .ts files
npm run build  # Compile to dist/
npm start  # Run compiled code
```

## Key TypeScript Features

### 1. Model Interfaces

```typescript
export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  comparePassword(password: string): Promise<boolean>
}
```

### 2. Typed Services

```typescript
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  // Type-safe implementation
}
```

### 3. Controller Types

```typescript
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Request and Response are fully typed
  }
)
```

### 4. Custom Types

Located in `src/types/`:
- `express.d.ts` - Extends Express types
- `auth.types.ts` - Authentication types
- `pagination.types.ts` - Pagination types

## Benefits

✅ **Catch errors at compile time** instead of runtime
✅ **Better IDE autocomplete** and IntelliSense
✅ **Easier refactoring** with confidence
✅ **Self-documenting code** through types
✅ **Safer database operations** with typed models

## Common TypeScript Patterns

### Optional Parameters

```typescript
export const getUsers = async (
  page = 1,
  limit = 10,
  filter?: UserFilter
): Promise<GetUsersResult> => {
  // filter is optional
}
```

### Type Assertions

```typescript
const token = req.headers.authorization?.split(" ")[1]
```

### Mongoose with TypeScript

```typescript
import mongoose, { Document, Schema } from "mongoose"

interface IModel extends Document {
  field: string
}

const schema = new Schema<IModel>({
  field: { type: String, required: true }
})

export default mongoose.model<IModel>("Model", schema)
```

## Scripts Reference

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check without compiling
npm run typecheck

# Run tests
npm test
```

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Make sure you're importing with `.js` extensions removed:
```typescript
// ❌ Wrong
import User from "./models/User.js"

// ✅ Correct
import User from "./models/User"
```

### Issue: Type errors in tests
**Solution:** Tests now use ts-jest. Make sure test files are `.test.ts`

### Issue: Express types not working
**Solution:** Check that `src/types/express.d.ts` is included in your tsconfig.json

## Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **The compiled JavaScript will be in `dist/`**

3. **Run in production:**
   ```bash
   NODE_ENV=production npm start
   ```

4. **Docker:** The Dockerfile handles TypeScript compilation automatically

## IDE Setup

### VS Code (Recommended)
Install these extensions:
- ESLint
- TypeScript and JavaScript Language Features (built-in)

### Settings
Add to `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Next Steps

1. **Learn TypeScript basics:** https://www.typescriptlang.org/docs/
2. **Review the type definitions** in `src/types/`
3. **Experiment** by adding new features with types
4. **Use the compiler** to catch bugs: `npm run typecheck`

---

**TypeScript makes your Express API more robust and maintainable!** 🚀

