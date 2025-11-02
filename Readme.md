# Sweet Shop Management System

A full-stack application for managing a sweet shop with customer registration, browsing, purchasing, and admin management features.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB with Prisma ORM
- **Frontend**: React, Vite, React Router
- **Testing**: Jest, Supertest
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Features

### Customer Features
- User registration and login
- Browse sweets with pagination
- Search and filter sweets by category and price
- Add items to cart
- Place orders
- View order history
- Real-time data validation

### Admin Features
- Separate admin login
- Add, update, and delete sweets
- Manage inventory
- View all products

## Prerequisites

- Node.js 16+ installed
- MongoDB instance (cloud or local)
- npm or yarn package manager

## Installation & Setup

### Using Command Prompt (Windows)

#### Step 1: Clone the repository
```cmd
git clone https://github.com/saitamaOwO/Incubyte_sweet_shop_management
cd sweet-shop-management
```

#### Step 2: Setup Backend
```cmd
cd backend
npm install
```

#### Step 3: Setup Frontend
```cmd
cd ../frontend
npm install
```

#### Step 4: Configure Environment Variables

**Backend (.env file in backend folder):**
```
DATABASE_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
ADMIN_PASSWORD=your-admin-password
PORT=5000
```

**Example MongoDB connection string:**
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/sweetshop?retryWrites=true&w=majority"
```

**Frontend (.env file in frontend folder):**
```
VITE_API_URL=http://localhost:5000/api
```

#### Step 5: Initialize Prisma and Database

```cmd
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

This will:
- Generate Prisma Client
- Push the schema to your MongoDB database
- Seed the database with an admin user and sample sweets

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```cmd
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```cmd
cd frontend
npm run dev
```

**Terminal 3 - Run Tests (Optional):**
```cmd
cd tests
npm test
```

### Production Build

**Backend:**
```cmd
cd backend
npm start
```

**Frontend:**
```cmd
cd frontend
npm run build
npm run preview
```

## API Documentation

### Authentication Endpoints

#### Register (Customer)
- **POST** `/api/auth/register`
- Body: `{ name, email, password }`
- Response: User object + JWT token

#### Login (Customer)
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Response: User object + JWT token

#### Login (Admin)
- **POST** `/api/auth/admin-login`
- Body: `{ email, password }`
- Response: Admin user object + JWT token
- Default credentials: `admin@sweetshop.com` / `admin123` (or your ADMIN_PASSWORD)

### Sweets Endpoints

#### Get All Sweets
- **GET** `/api/sweets?page=1&limit=10`
- Response: Paginated sweets data with pagination info

#### Get Sweet by ID
- **GET** `/api/sweets/:id`
- Response: Single sweet object

#### Search Sweets
- **GET** `/api/sweets/search?query=chocolate&category=Chocolate&minPrice=0&maxPrice=100`
- Response: Matching sweets array

#### Admin Routes (Require Admin Authentication)
- **POST** `/api/sweets` - Create sweet
  - Body: `{ name, description, price, stock, category, imageUrl }`
- **PUT** `/api/sweets/:id` - Update sweet
  - Body: Any sweet fields to update
- **DELETE** `/api/sweets/:id` - Delete sweet

### Cart Endpoints (Require Authentication)

#### Get Cart
- **GET** `/api/cart`
- Response: Cart with items and sweet details

#### Add to Cart
- **POST** `/api/cart/add`
- Body: `{ sweetId, quantity }`
- Response: Added cart item

#### Update Cart Item
- **PUT** `/api/cart/update/:itemId`
- Body: `{ quantity }`
- Response: Updated cart item

#### Remove from Cart
- **DELETE** `/api/cart/remove/:itemId`
- Response: Success message

#### Clear Cart
- **DELETE** `/api/cart/clear`
- Response: Success message

### Order Endpoints (Require Authentication)

#### Create Order
- **POST** `/api/orders`
- Creates order from current cart items
- Response: Order object with items

#### Get Orders
- **GET** `/api/orders?page=1&limit=10`
- Response: Paginated user orders

#### Get Order by ID
- **GET** `/api/orders/:id`
- Response: Single order object

## Database Schema (Prisma)

### Models

**User**
- id (ObjectId)
- email (unique)
- password (hashed)
- name
- role (CUSTOMER/ADMIN)
- cart (one-to-one)
- orders (one-to-many)

**Sweet**
- id (ObjectId)
- name (unique)
- description
- price (Float)
- stock (Int)
- category
- imageUrl

**Cart**
- id (ObjectId)
- userId (unique)
- items (one-to-many CartItem)

**CartItem**
- id (ObjectId)
- cartId
- sweetId
- quantity
- Unique constraint on (cartId, sweetId)

**Order**
- id (ObjectId)
- userId
- items (one-to-many OrderItem)
- total (Float)
- status (PENDING by default)

**OrderItem**
- id (ObjectId)
- orderId
- sweetId
- quantity
- price (captured at order time)

## Prisma Commands

### Generate Prisma Client
```cmd
npx prisma generate
```

### Push Schema to Database
```cmd
npx prisma db push
```

### Open Prisma Studio (Database GUI)
```cmd
npx prisma studio
```

### Reset Database
```cmd
npx prisma db push --force-reset
npm run seed
```

## Testing

### Run All Tests
```cmd
npm test
```

### Run Specific Test Suite
```cmd
npm test -- auth.test.js
```

### Generate Coverage Report
```cmd
npm test -- --coverage
```

## My AI Usage

### AI Tools Used
- v0 (Vercel AI): Used for generating project structure, component boilerplate and generating a general layout
- ChatGPT: Used for debugging JWT implementation, Prisma schema design, and middleware patterns

### How AI Was Used
1. **Project Scaffolding**: Used v0 to generate the complete project structure and initial file organization
2. **Component Generation**: Generated React components with proper hooks and state management
3. **API Development**: Created Express route handlers and controller logic with error handling
4. **Database Schema**: Designed Prisma schema with proper relations and constraints
5. **Testing**: Generated Jest test cases with various scenarios
6. **Styling**: Created responsive CSS with animations and modern design patterns
7. **Documentation**: Comprehensive setup guides and API documentation

### Impact on Workflow
- **Productivity**: Reduced setup time from hours to minutes
- **Code Quality**: Consistent patterns and best practices across the codebase
- **Learning**: Served as reference for modern full-stack development patterns
- **Iteration**: Rapid prototyping and refinement of features

## Deployment

### Deploy to Vercel

#### Backend Deployment
1. Create account on Vercel
2. Connect GitHub repository
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `ADMIN_PASSWORD`
4. Run build command: `npx prisma generate && npm run build`
5. Deploy

#### Frontend Deployment
1. Build project: `npm run build`
2. Deploy build folder to Vercel
3. Update `VITE_API_URL` to production backend URL

### Environment Variables for Production
- `DATABASE_URL`: Production MongoDB connection string (MongoDB Atlas recommended)
- `JWT_SECRET`: Strong random secret for JWT signing
- `JWT_EXPIRE`: Token expiration time (e.g., "7d")
- `ADMIN_PASSWORD`: Secure admin password
- `PORT`: Server port (default 5000)

## Project Structure

```
sweet-shop-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Prisma database schema
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, validation, error handling
│   ├── seed.ts              # Database seeding script
│   └── index.ts             # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── styles/          # CSS styles
│   └── package.json
├── tests/
│   ├── backend/             # Jest tests
│   └── jest.config.js
└── README.md
```

## Git Commit Commands with AI Co-author

### Example Commits
```bash
git commit -m "feat: Initialize project structure with Prisma ORM

Used v0 to scaffold project structure and integrate Prisma for type-safe database access.

Co-authored-by: v0 <v0@users.noreply.github.com>"
```

```bash
git commit -m "feat: Implement JWT authentication with Prisma

- Added token generation and verification
- Implemented auth middleware for protected routes
- Created separate admin login endpoint

Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>"
```

```bash
git commit -m "feat: Add cart and order management system

- Cart with item management (add, update, remove)
- Order creation from cart items
- Stock reduction on order placement

Co-authored-by: v0 <v0@users.noreply.github.com>"
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (CUSTOMER/ADMIN)
- Input validation
- Protected admin routes
- Cascade deletion for related records
- Unique constraints to prevent duplicates

## Performance Optimizations

- Prisma query optimization with includes
- Pagination for large datasets
- Efficient relation queries
- Connection pooling
- Index on unique fields (email, name)
- Compound unique constraints

## Troubleshooting

### MongoDB Connection Error
- Verify `DATABASE_URL` format is correct
- Ensure MongoDB cluster allows connections from your IP
- Check network connectivity to MongoDB Atlas

### Prisma Client Not Generated
```cmd
npx prisma generate
```

### Database Schema Out of Sync
```cmd
npx prisma db push
```

### Port Already in Use
- Backend: Change PORT in .env (default 5000)
- Frontend: Use `npm run dev -- --port 3001`

### JWT Token Issues
- Verify `JWT_SECRET` is set in .env
- Check token format in Authorization header: `Bearer <token>`

### Seed Script Fails
- Ensure database connection is working
- Check if admin user already exists
- Verify `ADMIN_PASSWORD` is set

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes with AI co-author attribution
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request