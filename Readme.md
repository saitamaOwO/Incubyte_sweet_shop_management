# Sweet Shop Management System

A full-stack application for managing a sweet shop with customer registration, browsing, purchasing, and admin management features.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React, Vite, React Router
- **Testing**: Jest, Supertest
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Features

### Customer Features
- User registration and login
- Browse sweets with pagination
- Search and filter sweets by category
- Purchase sweets
- Real-time data validation

### Admin Features
- Add, update, and delete sweets
- Manage inventory
- Restock items
- View customer purchases

## Prerequisites

- Node.js 16+ installed
- MongoDB instance (cloud)
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
MONGODB_URI=your-mongodb-api
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env file in frontend folder):**
```
VITE_API_URL=http://localhost:5000/api
```

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

#### Register
- **POST** `/api/auth/register`
- Body: `{ name, email, phoneNumber, password }`
- Response: User object + JWT tokens

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }` or `{ phoneNumber, password }`
- Response: User object + JWT tokens

### Sweets Endpoints

#### Get All Sweets
- **GET** `/api/sweets?page=1&pageSize=12&category=Chocolate`
- Response: Paginated sweets data

#### Search Sweets
- **GET** `/api/sweets/search?query=chocolate&minPrice=0&maxPrice=100`
- Response: Matching sweets

#### Purchase Sweet
- **POST** `/api/sweets/:id/purchase`
- Auth: Required
- Body: `{ quantity }`
- Response: Purchase confirmation

#### Admin Routes
- **POST** `/api/sweets` - Create sweet (Admin only)
- **PUT** `/api/sweets/:id` - Update sweet (Admin only)
- **DELETE** `/api/sweets/:id` - Delete sweet (Admin only)
- **POST** `/api/sweets/:id/restock` - Restock sweet (Admin only)

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
- ChatGPT: Used for debugging JWT implementation, MongoDB schema design, and middleware patterns

### How AI Was Used
1. **Project Scaffolding**: Used v0 to generate the complete project structure and initial file organization
2. **Component Generation**: Generated React components with proper hooks and state management
3. **API Development**: Created Express route handlers and controller logic with error handling
4. **Database Schema**: Designed MongoDB models with proper validation
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
3. Set environment variables in Vercel dashboard
4. Deploy

#### Frontend Deployment
1. Build project: `npm run build`
2. Deploy build folder to Vercel
3. Update `VITE_API_URL` to production backend URL

### Environment Variables for Production
- `MONGODB_URI`: Production MongoDB connection string
- `NODE_ENV=production`
- `FRONTEND_URL`: Production frontend URL
- JWT secrets (use strong, random values)

## Project Structure

```
sweet-shop-management/
├── backend/
│   ├── config/          # Database & constants config
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── utils/           # Helper functions
│   └── server.js        # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── styles/      # CSS styles
│   └── package.json
├── tests/
│   ├── backend/         # Jest tests
│   └── jest.config.js
└── README.md
```

## Git Commit Commands with AI Co-author

### Example Commits
```bash
git commit -m "feat: Initialize project structure with backend and frontend

Used v0 to scaffold project structure and generate initial configuration files.

Co-authored-by: v0 <v0@users.noreply.github.com>"
```

```bash
git commit -m "feat: Implement JWT authentication system

- Added token generation and verification
- Implemented refresh token rotation
- Created auth middleware for protected routes

Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>"
```

```bash
git commit -m "test: Add comprehensive test suite for API endpoints

- 5 test cases for authentication
- 4 test cases for sweets operations
- Included edge cases and error scenarios

Co-authored-by: v0 <v0@users.noreply.github.com>"
```

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS configuration
- HTTP-only cookies for token storage
- Admin-only protected routes

## Performance Optimizations

- Database indexing on search fields
- Pagination for large datasets
- Connection pooling for MongoDB
- Request rate limiting
- Error recovery with automatic reconnection
- Caching strategies

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGODB_URI` to valid MongoDB Atlas connection

### CORS Issues
- Update `FRONTEND_URL` in backend .env
- Ensure credentials: 'include' in fetch requests

### JWT Token Expired
- Refresh token automatically refreshes access token
- Check if refresh token is stored in cookies

### Port Already in Use
- Backend: Change PORT in .env (default 5000)
- Frontend: Use `npm run dev -- --port 3001`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes with AI co-author attribution
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request