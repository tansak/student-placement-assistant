# Building a Full-Stack AI Web Application: A Complete Guide

## Student Placement Assistant -- From Zero to Deployed

**A hands-on guide for students learning modern web development with AI tools**

---

## Table of Contents

1. [What We Built](#1-what-we-built)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Project Structure](#4-project-structure)
5. [Activity 1: Project Setup](#5-activity-1-project-setup)
6. [Activity 2: Database Design with MongoDB](#6-activity-2-database-design-with-mongodb)
7. [Activity 3: Backend API with Express](#7-activity-3-backend-api-with-express)
8. [Activity 4: Authentication System](#8-activity-4-authentication-system)
9. [Activity 5: AI Integration with Claude](#9-activity-5-ai-integration-with-claude)
10. [Activity 6: Frontend with React](#10-activity-6-frontend-with-react)
11. [Activity 7: Connecting Frontend to Backend](#11-activity-7-connecting-frontend-to-backend)
12. [Activity 8: Styling with Tailwind CSS](#12-activity-8-styling-with-tailwind-css)
13. [Activity 9: Deployment to Render](#13-activity-9-deployment-to-render)
14. [How Claude Code Was Used](#14-how-claude-code-was-used)
15. [Key Concepts Summary](#15-key-concepts-summary)
16. [Exercises for Students](#16-exercises-for-students)

---

## 1. What We Built

The **Student Placement Assistant** is a full-stack web application that helps college students prepare for job placements. Here's what it does:

1. **Students create an account** with email and password
2. **They build a profile** with their education, skills, projects, experience, and certifications
3. **They select a target job role** (e.g., "Frontend Developer", "Data Scientist")
4. **AI analyzes the gap** between their current profile and the job requirements
5. **They receive personalized recommendations**: skill gaps to fill, certifications to pursue, projects to build, resume tips, and interview preparation advice
6. **They track their progress** by marking recommendations as completed

### User Flow Diagram

```
Sign Up/Login
    |
    v
Dashboard (see all assessments + stats)
    |
    +---> Edit Profile (5-step wizard)
    |       Step 1: Education
    |       Step 2: Skills
    |       Step 3: Experience
    |       Step 4: Projects
    |       Step 5: Certifications
    |
    +---> New Assessment
    |       Select job role -> AI analyzes -> Results page
    |
    +---> View Assessment Result
            - Skill gaps (with priority: high/medium/low)
            - Recommended certifications
            - Project suggestions
            - Resume tips
            - Interview preparation tips
            - Check off completed items
```

---

## 2. Technology Stack

### What is the MERN Stack?

MERN stands for **MongoDB, Express, React, Node.js** -- four technologies that together let you build a complete web application using only JavaScript.

| Layer      | Technology   | Role                            |
|------------|-------------|----------------------------------|
| Database   | MongoDB      | Stores user data, profiles, assessments |
| Backend    | Express.js   | HTTP server, API routes, business logic |
| Frontend   | React        | User interface, client-side routing |
| Runtime    | Node.js      | Runs JavaScript on the server   |

### Additional Technologies Used

| Technology       | Purpose                                    |
|-----------------|---------------------------------------------|
| **Vite**        | Frontend build tool (fast dev server + production bundling) |
| **Tailwind CSS**| Utility-first CSS framework for styling    |
| **Mongoose**    | MongoDB object modeling for Node.js        |
| **JWT**         | JSON Web Tokens for authentication         |
| **bcryptjs**    | Password hashing                           |
| **Axios**       | HTTP client for API requests from React    |
| **Claude AI**   | Anthropic's AI for profile analysis        |
| **Render**      | Cloud platform for deployment              |

### Why These Technologies?

- **JavaScript everywhere**: One language for frontend, backend, and database queries
- **React**: The most popular frontend library -- large ecosystem, huge job market
- **MongoDB**: Flexible document-based database -- perfect for varied profile data
- **Vite**: Instant dev server startup, fast hot module replacement (HMR)
- **Tailwind**: Write CSS directly in your HTML -- no separate CSS files to manage
- **Claude AI**: Powerful language model for generating personalized career advice

---

## 3. Architecture Overview

### How the Pieces Fit Together

```
                    DEVELOPMENT MODE
                    ================

Browser (localhost:5173)                 Backend (localhost:5000)
+-------------------------+             +-------------------------+
|                         |   /api/*    |                         |
|   React App (Vite)      |------------>|   Express Server        |
|                         |  (proxied)  |                         |
|   - Pages               |             |   - Routes              |
|   - Components          |<------------|   - Middleware           |
|   - Context (Auth)      |  JSON data  |   - Models              |
|   - Services (Axios)    |             |   - Services            |
+-------------------------+             +-----------|-------------+
                                                    |
                                                    v
                                        +-------------------------+
                                        |   MongoDB (local)       |
                                        |   localhost:27017        |
                                        +-------------------------+


                    PRODUCTION MODE (Render)
                    ========================

Browser (your-app.onrender.com)
        |
        v
+-------------------------------------------+
|   Express Server (single process)         |
|                                           |
|   /api/*  --> API route handlers          |
|   /*      --> Serves React build files    |
|              (client/dist/index.html)     |
+-------------------|----------------------+
                    |
                    v
+-------------------------------------------+
|   MongoDB Atlas (cloud)                   |
|   mongodb+srv://cluster.mongodb.net       |
+-------------------------------------------+
```

### Key Architectural Decisions

1. **Monorepo structure**: Client and server live in the same repository. This simplifies deployment and version management.

2. **API-first design**: The backend exposes a clean REST API. The frontend communicates exclusively through API calls, never directly touching the database.

3. **JWT stateless authentication**: No server-side sessions. The token contains the user ID, and the server verifies it on each request. This scales better than session-based auth.

4. **Single-service deployment**: In production, one Express server handles both the API and serves the frontend static files. This keeps costs at zero on Render's free tier.

---

## 4. Project Structure

```
student-placement-assistant/
|
+-- package.json              # Root: scripts to run both client & server
+-- render.yaml               # Render deployment configuration
+-- .gitignore                # Files excluded from git
|
+-- server/                   # BACKEND
|   +-- server.js             # Entry point: Express app setup
|   +-- package.json          # Backend dependencies
|   +-- .env                  # Environment variables (NOT committed)
|   +-- .env.example          # Template for .env
|   |
|   +-- config/
|   |   +-- db.js             # MongoDB connection
|   |
|   +-- middleware/
|   |   +-- auth.js           # JWT verification middleware
|   |
|   +-- models/
|   |   +-- User.js           # User schema (profile, credentials)
|   |   +-- Assessment.js     # Assessment schema (AI results)
|   |
|   +-- routes/
|   |   +-- auth.js           # Signup, login, profile endpoints
|   |   +-- assessment.js     # CRUD + AI assessment endpoints
|   |
|   +-- services/
|       +-- claude.js         # Claude AI integration
|
+-- client/                   # FRONTEND
    +-- index.html            # HTML shell
    +-- package.json          # Frontend dependencies
    +-- vite.config.js        # Vite configuration + dev proxy
    +-- tailwind.config.js    # Tailwind CSS configuration
    +-- postcss.config.js     # PostCSS plugins
    |
    +-- src/
        +-- main.jsx          # App entry point (React root)
        +-- App.jsx           # Route definitions
        +-- index.css         # Tailwind imports
        |
        +-- context/
        |   +-- AuthContext.jsx  # Global auth state
        |
        +-- services/
        |   +-- api.js          # Axios instance + API functions
        |
        +-- pages/
        |   +-- Home.jsx             # Landing page
        |   +-- Dashboard.jsx        # User dashboard
        |   +-- Profile.jsx          # Profile editor (5-step wizard)
        |   +-- NewAssessment.jsx    # Job role selection
        |   +-- AssessmentResult.jsx # AI results display
        |
        +-- components/
            +-- Auth/
            |   +-- Login.jsx          # Login form
            |   +-- Signup.jsx         # Signup form
            |   +-- ProtectedRoute.jsx # Auth guard
            |
            +-- Layout/
            |   +-- Navbar.jsx         # Top navigation bar
            |   +-- Footer.jsx         # Page footer
            |
            +-- ProfileBuilder/
            |   +-- StepIndicator.jsx      # Progress steps UI
            |   +-- EducationStep.jsx      # Education form
            |   +-- SkillsStep.jsx         # Skills tag input
            |   +-- ExperienceStep.jsx     # Work experience form
            |   +-- ProjectsStep.jsx       # Projects form
            |   +-- CertificationsStep.jsx # Certifications form
            |
            +-- UI/
                +-- Button.jsx    # Reusable button component
                +-- Input.jsx     # Reusable input component
```

---

## 5. Activity 1: Project Setup

### What You'll Learn
- Initializing a Node.js project
- Setting up a monorepo with client and server
- Installing dependencies
- Configuring environment variables

### Step 1: Initialize the Root Project

```bash
mkdir student-placement-assistant
cd student-placement-assistant
npm init -y
npm install concurrently
```

**`concurrently`** lets us run both the frontend and backend dev servers with a single command.

### Step 2: Create the Backend

```bash
mkdir server
cd server
npm init -y
```

Edit `server/package.json` to add `"type": "module"` (enables ES module `import`/`export` syntax):

```json
{
  "name": "spa-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Install backend dependencies:

```bash
npm install express cors dotenv mongoose jsonwebtoken bcryptjs express-validator @anthropic-ai/sdk
npm install -D nodemon
```

| Package              | Purpose                                |
|---------------------|----------------------------------------|
| `express`           | Web server framework                   |
| `cors`              | Cross-Origin Resource Sharing          |
| `dotenv`            | Load .env file variables               |
| `mongoose`          | MongoDB ODM (Object Document Mapper)   |
| `jsonwebtoken`      | Create and verify JWT tokens           |
| `bcryptjs`          | Hash passwords securely                |
| `express-validator` | Validate request body data             |
| `@anthropic-ai/sdk` | Anthropic Claude AI SDK                |
| `nodemon`           | Auto-restart server on file changes    |

### Step 3: Create the Frontend

```bash
cd ..
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-placement-assistant
JWT_SECRET=dev_secret_change_in_production_abc123
ANTHROPIC_API_KEY=your_api_key_here
NODE_ENV=development
```

> **Security Rule**: Never commit `.env` files. Always add `.env` to `.gitignore`.

### Step 5: Root Scripts

Edit the root `package.json`:

```json
{
  "scripts": {
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install"
  }
}
```

Now `npm run dev` starts both servers simultaneously.

---

## 6. Activity 2: Database Design with MongoDB

### What You'll Learn
- Document-based database design
- Mongoose schemas and models
- Relationships between documents
- Pre-save hooks for data transformation

### Understanding MongoDB vs SQL

| Concept    | SQL (MySQL/PostgreSQL) | MongoDB              |
|------------|----------------------|----------------------|
| Table      | Table                | Collection           |
| Row        | Row                  | Document             |
| Column     | Column               | Field                |
| Join       | JOIN query           | Reference + populate |
| Schema     | Strict (defined upfront) | Flexible (defined in app code) |

### Database Connection (`server/config/db.js`)

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

**Key concepts:**
- `mongoose.connect()` establishes a connection pool to MongoDB
- If the connection fails, `process.exit(1)` stops the server (can't run without a database)
- The connection string comes from `.env` so it works with both local MongoDB and cloud Atlas

### User Model (`server/models/User.js`)

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,           // <-- IMPORTANT: password excluded from queries by default
    },
    profile: {
      education: {
        degree: { type: String, default: '' },
        branch: { type: String, default: '' },
        college: { type: String, default: '' },
        graduationYear: { type: Number, default: null },
        cgpa: { type: Number, default: null },
      },
      skills: [{ type: String }],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String,
      }],
      projects: [{
        name: String,
        description: String,
        techStack: [String],
        link: String,
      }],
      certifications: [{
        name: String,
        issuer: String,
        year: Number,
      }],
    },
  },
  { timestamps: true }     // <-- Adds createdAt and updatedAt automatically
);

// Pre-save hook: hash password before storing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
```

**Key concepts explained:**

1. **`select: false` on password**: When you do `User.findById(id)`, the password field is NOT included. You must explicitly request it: `User.findOne({ email }).select('+password')`.

2. **`pre('save')` hook**: Runs automatically before every `save()` call. If the password was modified, it hashes it with bcrypt (12 salt rounds). This means we never store plaintext passwords.

3. **`isModified('password')`**: Prevents re-hashing the password when updating other fields (like the profile).

4. **`timestamps: true`**: Mongoose automatically manages `createdAt` and `updatedAt` fields.

5. **Embedded documents**: The `profile` field contains nested objects (education, skills, etc.) directly inside the User document. This is a MongoDB pattern -- instead of separate tables with JOINs, we embed related data.

### Assessment Model (`server/models/Assessment.js`)

```javascript
import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Target job role is required'],
    },
    profileSnapshot: {
      education: Object,
      skills: [String],
      experience: Array,
      projects: Array,
      certifications: Array,
    },
    result: {
      summary: String,
      skillGaps: [{
        skill: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        description: String,
      }],
      recommendedCertifications: [{
        name: String,
        reason: String,
      }],
      projectSuggestions: [{
        name: String,
        description: String,
        skills: [String],
      }],
      resumeTips: [String],
      interviewTips: [String],
    },
    completedItems: [{
      category: String,
      item: String,
      completedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);
```

**Design decisions:**

1. **`user` reference**: Uses `ObjectId` to link to the User model. This is how MongoDB does relationships. Each assessment belongs to one user.

2. **`profileSnapshot`**: Stores a copy of the user's profile at assessment time. Why? Because the user might update their profile later, but the assessment should reflect what their profile looked like when they ran it.

3. **`enum: ['high', 'medium', 'low']`**: Restricts the `priority` field to only these three values. Mongoose will reject any other value.

4. **`completedItems`**: Tracks which recommendations the user has marked as done. Each entry records the category (e.g., "skill", "cert"), the item index, and when it was completed.

### Database Relationship Diagram

```
+-------------------+          +-------------------+
|      Users        |          |   Assessments     |
+-------------------+          +-------------------+
| _id (ObjectId)    |<---------| user (ObjectId)   |
| name              |    1:N   | jobRole           |
| email             |          | profileSnapshot   |
| password (hashed) |          | result            |
| profile           |          |   - summary       |
|   - education     |          |   - skillGaps[]   |
|   - skills[]      |          |   - certifications|
|   - experience[]  |          |   - projects[]    |
|   - projects[]    |          |   - resumeTips[]  |
|   - certifications|          |   - interviewTips |
| createdAt         |          | completedItems[]  |
| updatedAt         |          | createdAt         |
+-------------------+          | updatedAt         |
                               +-------------------+
```

One user can have many assessments (1:N relationship).

---

## 7. Activity 3: Backend API with Express

### What You'll Learn
- Express server setup
- REST API design
- Route handlers and middleware
- Request validation
- Error handling

### Server Entry Point (`server/server.js`)

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOrigin = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL || false    // In production: same origin, no CORS needed
  : 'http://localhost:5173';           // In development: allow Vite dev server

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());               // Parse JSON request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));

  // All non-API routes serve the React app (SPA client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
});
```

**Line-by-line explanation:**

1. **`dotenv.config()`** -- Loads variables from `.env` into `process.env`
2. **`__dirname` setup** -- In ES modules, `__dirname` isn't available. We reconstruct it from `import.meta.url`
3. **CORS middleware** -- Controls which origins can make requests to our API. In development, the React dev server (port 5173) is a different origin than Express (port 5000), so we need CORS. In production, both are served from the same origin, so CORS isn't needed
4. **`express.json()`** -- Parses incoming JSON request bodies into `req.body`
5. **Route mounting** -- All auth routes live under `/api/auth/*`, assessments under `/api/assessments/*`
6. **Static serving** -- In production, serves the built React files. The catch-all `*` route returns `index.html` for any non-API path, enabling React Router's client-side navigation
7. **Startup sequence** -- Database connects first, then the server starts listening

### REST API Design

| Method | Endpoint                              | Auth | Description                    |
|--------|---------------------------------------|------|--------------------------------|
| POST   | `/api/auth/signup`                    | No   | Create new user account        |
| POST   | `/api/auth/login`                     | No   | Login, receive JWT token       |
| GET    | `/api/auth/me`                        | Yes  | Get current user data          |
| PUT    | `/api/auth/profile`                   | Yes  | Update user profile            |
| POST   | `/api/assessments`                    | Yes  | Create new AI assessment       |
| GET    | `/api/assessments`                    | Yes  | List user's assessments        |
| GET    | `/api/assessments/:id`                | Yes  | Get single assessment          |
| PATCH  | `/api/assessments/:id/complete-item`  | Yes  | Mark item as completed         |
| PATCH  | `/api/assessments/:id/uncomplete-item`| Yes  | Unmark item                    |
| DELETE | `/api/assessments/:id`                | Yes  | Delete assessment              |
| GET    | `/api/health`                         | No   | Health check                   |

### Assessment Routes (server/routes/assessment.js) -- Detailed Walkthrough

```javascript
// POST /api/assessments - create new assessment via AI
router.post(
  '/',
  auth,                    // 1. Verify JWT token (middleware)
  [body('jobRole').trim().notEmpty().withMessage('Job role is required')],  // 2. Validate input
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      // 3. Load user profile from database
      const user = await User.findById(req.user._id);
      const profile = user.profile || {};

      // 4. Check profile completeness
      if (!profile.skills || profile.skills.length === 0) {
        return res.status(400)
          .json({ message: 'Please complete your profile before running an assessment' });
      }

      const { jobRole } = req.body;

      // 5. Create a snapshot of current profile
      const profileSnapshot = {
        education: profile.education,
        skills: profile.skills,
        experience: profile.experience,
        projects: profile.projects,
        certifications: profile.certifications,
      };

      // 6. Call Claude AI to analyze the gap
      const result = await analyzeProfile(profileSnapshot, jobRole);

      // 7. Save assessment to database
      const assessment = await Assessment.create({
        user: user._id,
        jobRole,
        profileSnapshot,
        result,
      });

      res.status(201).json(assessment);
    } catch (error) {
      // 8. Handle AI-specific errors differently
      if (error.message.includes('API') || error.message.includes('parse')) {
        return res.status(502)
          .json({ message: 'AI service temporarily unavailable. Please try again.' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);
```

**The request lifecycle:**
1. Request arrives -> CORS check -> JSON parsing
2. `auth` middleware verifies JWT -> attaches `req.user`
3. `express-validator` checks that `jobRole` is not empty
4. Route handler loads user profile
5. Profile completeness check (must have at least some skills)
6. Sends profile + job role to Claude AI
7. Stores the AI result in MongoDB
8. Returns the assessment to the client

---

## 8. Activity 4: Authentication System

### What You'll Learn
- JWT (JSON Web Token) authentication
- Password hashing with bcrypt
- Protected routes (server and client)
- Token storage and auto-refresh

### How JWT Authentication Works

```
1. SIGNUP/LOGIN
   Client                    Server                    Database
   |-- POST /api/auth/login -->|                          |
   |   { email, password }    |-- Find user by email ---->|
   |                          |<-- User document ---------|
   |                          |                           |
   |                          |  bcrypt.compare(password, hash)
   |                          |  jwt.sign({ id: user._id })
   |                          |                           |
   |<-- { token, user } ------|                           |

2. SUBSEQUENT REQUESTS
   Client                    Server                    Database
   |-- GET /api/assessments ->|                          |
   |   Authorization: Bearer  |                          |
   |   <token>                |  jwt.verify(token)       |
   |                          |  -> { id: "abc123" }     |
   |                          |-- Find user by id ------->|
   |                          |<-- User document ---------|
   |                          |                           |
   |                          |  req.user = user          |
   |                          |  -> Continue to route     |
   |<-- [assessments] --------|                           |
```

### Auth Middleware (`server/middleware/auth.js`)

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // 1. Extract token from "Bearer <token>" header
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    // 2. Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user (confirm they still exist)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach user to the request object
    req.user = user;
    next();        // Continue to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

**Why check the database?** The token might be valid (not expired, correct signature), but the user could have been deleted. Checking the database ensures the user still exists.

### Signup Route

```javascript
router.post('/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user (password is auto-hashed by the pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT token (valid for 7 days)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  }
);
```

### Login Route

```javascript
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // select('+password') overrides the schema's `select: false`
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare plaintext password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  }
);
```

**Security note**: The error message says "Invalid credentials" for both wrong email and wrong password. This is intentional -- it prevents attackers from knowing whether an email exists in your system.

---

## 9. Activity 5: AI Integration with Claude

### What You'll Learn
- Calling an AI API from a backend service
- Prompt engineering for structured JSON output
- Parsing and validating AI responses
- Error handling for external API calls

### The Claude Service (`server/services/claude.js`)

This is where the AI magic happens. The service:
1. Takes a student profile and target job role
2. Constructs a detailed prompt
3. Sends it to Claude AI
4. Parses the JSON response
5. Validates the response structure

```javascript
import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization -- only creates the client when first needed
let client;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
```

### Prompt Engineering

The prompt is the most critical part. It must:
- Give the AI a clear role ("expert career counselor")
- Provide all relevant student data
- Specify the exact output format (JSON)
- Set minimum requirements (at least 3 skill gaps, etc.)

```javascript
function buildPrompt(profile, jobRole) {
  const edu = profile.education || {};
  const skills = (profile.skills || []).join(', ') || 'None listed';

  // Format experience, projects, certifications as readable text
  const experience = (profile.experience || [])
    .map((e) => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`)
    .join('\n') || 'None';

  // ... similar formatting for projects and certifications ...

  return `You are an expert career counselor and placement advisor for college students in tech.

A student wants to prepare for the role of **${jobRole}**.

Here is their current profile:

**Education:**
- Degree: ${edu.degree || 'N/A'}
- Branch: ${edu.branch || 'N/A'}
- College: ${edu.college || 'N/A'}
- Graduation Year: ${edu.graduationYear || 'N/A'}
- CGPA: ${edu.cgpa || 'N/A'}

**Skills:** ${skills}

**Experience:**
${experience}

**Projects:**
${projects}

**Certifications:**
${certs}

Analyze the gap between this student's current profile and what is typically required
for the role of "${jobRole}". Provide a comprehensive, actionable assessment.

You MUST respond in EXACTLY this JSON format with no extra text:
{
  "summary": "A 2-3 sentence overall assessment",
  "skillGaps": [
    { "skill": "...", "priority": "high | medium | low", "description": "..." }
  ],
  "recommendedCertifications": [
    { "name": "...", "reason": "..." }
  ],
  "projectSuggestions": [
    { "name": "...", "description": "...", "skills": ["..."] }
  ],
  "resumeTips": ["..."],
  "interviewTips": ["..."]
}

Provide at least 3 items for skillGaps, 2 for recommendedCertifications,
2 for projectSuggestions, 3 for resumeTips, and 3 for interviewTips.`;
}
```

### Calling the AI and Parsing the Response

```javascript
export async function analyzeProfile(profile, jobRole) {
  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: buildPrompt(profile, jobRole) },
    ],
  });

  const text = message.content[0].text;

  // Extract JSON from response (handles potential markdown code fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  const result = JSON.parse(jsonMatch[0]);

  // Validate all required fields exist
  const required = ['summary', 'skillGaps', 'recommendedCertifications',
                    'projectSuggestions', 'resumeTips', 'interviewTips'];
  for (const key of required) {
    if (!result[key]) {
      throw new Error(`AI response missing field: ${key}`);
    }
  }

  return result;
}
```

**Key design decisions:**

1. **Regex JSON extraction**: `text.match(/\{[\s\S]*\}/)` finds the JSON object even if Claude wraps it in markdown code fences or adds extra text.

2. **Validation**: Even though we told Claude to include certain fields, we verify they exist. AI outputs can be unpredictable -- always validate.

3. **Error propagation**: If parsing fails, the error bubbles up to the route handler, which returns a 502 "AI service temporarily unavailable" message.

---

## 10. Activity 6: Frontend with React

### What You'll Learn
- React component architecture
- Client-side routing with React Router
- Global state management with Context API
- Protected (authenticated) routes
- Multi-step forms

### Application Entry Point (`client/src/main.jsx`)

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

**The component tree (order matters):**
1. **StrictMode** -- Development helper that highlights potential problems
2. **BrowserRouter** -- Enables client-side routing (URL changes without page reload)
3. **AuthProvider** -- Makes auth state available to all components
4. **App** -- The actual application

### Auth Context (`client/src/context/AuthContext.jsx`)

The Context API provides global state that any component can access without passing props through every level.

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, signup as signupApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // Current user data
  const [loading, setLoading] = useState(true); // True until initial auth check completes

  // On app load: check if we have a saved token and it's still valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()                                    // Call GET /api/auth/me
        .then((res) => setUser(res.data.user))   // Token valid -> set user
        .catch(() => localStorage.removeItem('token'))  // Token invalid -> clear it
        .finally(() => setLoading(false));
    } else {
      setLoading(false);                         // No token -> not logged in
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('token', res.data.token);  // Save token
    setUser(res.data.user);                         // Update global state
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await signupApi({ name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');    // Clear token
    setUser(null);                       // Clear user state
  };

  const refreshUser = async () => {
    const res = await getMe();
    setUser(res.data.user);              // Re-fetch user data
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**How any component uses auth:**
```jsx
function AnyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) return <p>Not logged in</p>;
  return <p>Hello, {user.name}</p>;
}
```

### Route Definitions (`client/src/App.jsx`)

```jsx
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes -- require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/new-assessment" element={
            <ProtectedRoute><NewAssessment /></ProtectedRoute>
          } />
          <Route path="/assessment/:id" element={
            <ProtectedRoute><AssessmentResult /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

### Protected Route Component

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4
          border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;    // Redirect to login
  }

  return children;                               // Render the protected page
}
```

**Three states:**
1. **Loading** -- Auth check in progress -> show spinner
2. **Not authenticated** -- No user -> redirect to login
3. **Authenticated** -- User exists -> render the child page

### Multi-Step Profile Form

The Profile page implements a 5-step wizard pattern:

```jsx
export default function Profile() {
  const [step, setStep] = useState(0);  // Current step (0-4)

  // State for each step
  const [education, setEducation] = useState({...});
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Load existing profile data on mount
  useEffect(() => {
    if (user?.profile) { /* populate state from user.profile */ }
  }, [user]);

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 0: return <EducationStep data={education} onChange={setEducation} />;
      case 1: return <SkillsStep data={skills} onChange={setSkills} />;
      case 2: return <ExperienceStep data={experience} onChange={setExperience} />;
      case 3: return <ProjectsStep data={projects} onChange={setProjects} />;
      case 4: return <CertificationsStep data={certifications} onChange={setCertifications} />;
    }
  };

  // Navigation
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Save all data on final step
  const handleSave = async () => {
    await updateProfile({ education, skills, experience, projects, certifications });
    await refreshUser();
    navigate('/dashboard');
  };
}
```

**Pattern**: Each step component receives `data` (current values) and `onChange` (setter function). The parent holds all state and sends it to the API in one request when the user clicks "Save Profile".

---

## 11. Activity 7: Connecting Frontend to Backend

### What You'll Learn
- HTTP client setup with Axios
- API service layer pattern
- Request/response interceptors
- Development proxy configuration

### API Service (`client/src/services/api.js`)

```javascript
import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: '/api',           // All requests go to /api/...
});

// REQUEST INTERCEPTOR: Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,     // Success: pass through
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');       // Clear invalid token
      window.location.href = '/login';        // Force redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Assessment API functions
export const createAssessment = (data) => api.post('/assessments', data);
export const getAssessments = () => api.get('/assessments');
export const getAssessment = (id) => api.get(`/assessments/${id}`);
export const completeItem = (id, data) => api.patch(`/assessments/${id}/complete-item`, data);
export const uncompleteItem = (id, data) => api.patch(`/assessments/${id}/uncomplete-item`, data);
export const deleteAssessment = (id) => api.delete(`/assessments/${id}`);
```

**Why interceptors?**
- **Request interceptor**: Without this, every API call would need to manually read the token and set the header. The interceptor does it automatically.
- **Response interceptor**: If any API call returns 401 (unauthorized), the user is logged out and redirected. This handles token expiration globally.

### Development Proxy (`client/vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**The proxy problem and solution:**

In development, React runs on `localhost:5173` and Express on `localhost:5000`. These are different origins, so browsers block requests between them (CORS).

The Vite proxy solves this:
- Frontend code calls `/api/auth/login` (relative URL)
- Vite dev server intercepts `/api/*` requests
- Forwards them to `http://localhost:5000/api/auth/login`
- Returns the response to the browser

The browser thinks it's talking to `localhost:5173` the whole time -- no CORS issues.

**In production**, this proxy doesn't exist. Instead, Express serves both the API and the frontend from the same origin, so no proxy is needed.

### Data Flow Example: Creating an Assessment

```
1. User clicks "Run AI Assessment" on NewAssessment page
   |
2. handleSubmit() calls createAssessment({ jobRole: "Frontend Developer" })
   |
3. api.js sends POST /api/assessments with { jobRole: "Frontend Developer" }
   |  (interceptor automatically adds Authorization header)
   |
4. Vite proxy forwards to http://localhost:5000/api/assessments
   |
5. Express receives request:
   |  a. auth middleware verifies JWT -> attaches req.user
   |  b. express-validator checks jobRole is not empty
   |  c. Route handler loads user profile from MongoDB
   |  d. Calls Claude AI with profile + job role
   |  e. Saves assessment to MongoDB
   |  f. Returns assessment JSON
   |
6. Axios receives response
   |
7. React navigates to /assessment/:id to show results
```

---

## 12. Activity 8: Styling with Tailwind CSS

### What You'll Learn
- Utility-first CSS approach
- Custom color themes
- Responsive design
- Reusable component patterns

### Why Tailwind?

Traditional CSS:
```css
/* styles.css */
.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
```

```html
<button class="btn-primary">Click me</button>
```

Tailwind approach:
```html
<button class="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white
  font-medium hover:bg-primary-700">
  Click me
</button>
```

**Advantages:**
- No switching between HTML and CSS files
- No inventing class names
- Dead CSS is impossible (classes are only in the HTML that uses them)
- Consistent spacing/colors from a design system

### Custom Theme (`client/tailwind.config.js`)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',    // Main brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

This creates a custom `primary` color palette. You can then use classes like `bg-primary-600`, `text-primary-700`, `border-primary-300` throughout the app.

### Reusable Button Component Pattern

```jsx
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
};

export default function Button({ children, variant = 'primary', loading, disabled, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg
        font-medium text-sm transition-colors focus:outline-none focus:ring-2
        focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
```

**Usage:**
```jsx
<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger" loading>Deleting...</Button>
```

### Responsive Design

Tailwind uses mobile-first breakpoints:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

| Prefix | Min Width | Meaning          |
|--------|-----------|------------------|
| (none) | 0px       | Mobile (default) |
| `sm:`  | 640px     | Small tablets     |
| `md:`  | 768px     | Tablets          |
| `lg:`  | 1024px    | Desktops         |
| `xl:`  | 1280px    | Large screens    |

---

## 13. Activity 9: Deployment to Render

### What You'll Learn
- Preparing a MERN app for production
- Infrastructure-as-code with `render.yaml`
- Cloud database setup (MongoDB Atlas)
- Environment variable management

### Production vs Development: Key Differences

| Aspect          | Development                     | Production                     |
|-----------------|--------------------------------|--------------------------------|
| Frontend server | Vite dev server (port 5173)    | Static files served by Express |
| Backend server  | Nodemon with auto-reload       | Plain Node.js                  |
| Database        | Local MongoDB                  | MongoDB Atlas (cloud)          |
| API proxy       | Vite proxy (`/api -> :5000`)   | Same-origin (no proxy needed)  |
| CORS            | Allow localhost:5173           | Same-origin (disabled)         |
| NODE_ENV        | `development`                  | `production`                   |
| Secrets         | `.env` file                    | Render environment variables   |

### The `render.yaml` Blueprint

```yaml
services:
  - type: web
    name: student-placement-assistant
    runtime: node
    plan: free
    buildCommand: npm run render-build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false              # Set manually in dashboard
      - key: JWT_SECRET
        generateValue: true      # Render auto-generates a secure value
      - key: ANTHROPIC_API_KEY
        sync: false              # Set manually in dashboard
```

### Build Process on Render

When Render deploys, it runs:

```
npm run render-build
  |
  +-- cd server && npm install          # Install backend dependencies
  +-- cd ../client && npm install --include=dev   # Install frontend deps (including vite)
  +-- npm run build                     # Vite builds React -> client/dist/
```

Then starts the app with:

```
npm run start
  |
  +-- cd server && node server.js       # Express serves API + static files
```

### How Express Serves the Frontend in Production

```javascript
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');

  // Serve static assets (JS, CSS, images)
  app.use(express.static(clientDist));

  // Catch-all: serve index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
```

**Why the catch-all route?** React Router handles navigation client-side. When a user navigates to `/dashboard`, React Router shows the Dashboard component. But if they refresh the page on `/dashboard`, the browser sends a GET request for `/dashboard` to the server. Without the catch-all, Express would return 404. The catch-all returns `index.html`, which loads React, which reads the URL and renders the correct page.

**Important**: The catch-all must come AFTER API routes. Otherwise, `/api/health` would also return `index.html`.

### MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with a password
3. Allow network access from all IPs (`0.0.0.0/0`)
4. Get the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-placement-assistant
   ```
5. Set this as the `MONGODB_URI` environment variable in Render

### Free Tier Limitations

- **Cold starts**: Render free tier spins down after 15 minutes of inactivity. First request after idle takes 30-60 seconds.
- **512 MB RAM**: Sufficient for this app but watch for memory leaks.
- **MongoDB Atlas M0**: 512 MB storage, shared cluster. Fine for development and small apps.

---

## 14. How Claude Code Was Used

### What is Claude Code?

Claude Code is an AI-powered CLI (command-line interface) tool by Anthropic. You describe what you want to build in natural language, and it writes the code, creates files, runs commands, and iterates on errors -- all in your terminal or VS Code.

### How This Application Was Built with Claude Code

The entire application was built through a conversation with Claude Code. Here's the process that was followed:

#### Step 1: Describe the Application

```
"Build a MERN stack application called Student Placement Assistant.
It should help students prepare for job placements using AI.
Students create a profile, select a target job role, and get
AI-powered gap analysis with personalized recommendations."
```

Claude Code then:
- Created the project structure
- Set up both frontend and backend
- Wrote all the database models, routes, and React components

#### Step 2: Iterate and Refine

```
"Add a progress tracking feature where students can mark
recommendations as completed."
```

Claude Code:
- Added `completedItems` to the Assessment schema
- Created the PATCH routes for complete/uncomplete
- Updated the frontend to show checkboxes

#### Step 3: Prepare for Deployment

```
"Prepare this application for deployment to Render (free tier).
Create all necessary configuration files and update the code
for production."
```

Claude Code:
- Updated `server.js` to serve static files in production
- Fixed CORS for production
- Created `render.yaml`
- Added build/start scripts
- Created deployment documentation

#### Step 4: Deploy

```
"Deploy it please"
```

Claude Code:
- Initialized git repository
- Created the initial commit
- Pushed to GitHub
- Fixed the build error (`vite: not found` -- devDependencies not installed)
- Pushed the fix

### Tips for Using Claude Code Effectively

1. **Start with the big picture**: Describe the full app before diving into details
2. **Be specific about technology choices**: "Use React with Vite" instead of just "build a frontend"
3. **Iterate incrementally**: Add features one at a time rather than everything at once
4. **Describe behavior, not implementation**: "Users should be able to track their progress" rather than "Add a PATCH endpoint"
5. **Let it handle errors**: When something breaks, paste the error and Claude Code will fix it
6. **Review the generated code**: Always understand what was written -- this is how you learn

### What Claude Code Does Well

- Setting up project structures and boilerplate
- Writing CRUD API routes
- Creating React components with proper patterns
- Configuring build tools and deployment
- Debugging errors (paste the error, get the fix)
- Writing prompts for AI integration

### What You Should Still Learn Yourself

- **Understand the patterns**: Don't just accept the code -- read and understand each file
- **Database design**: Think about your data relationships before asking Claude Code to build
- **Security fundamentals**: Understand why passwords are hashed, why JWT works, what CORS does
- **Debugging skills**: Learn to read error messages and stack traces
- **Architecture decisions**: Know when to use embedded vs referenced documents, when to split services

---

## 15. Key Concepts Summary

### Backend Concepts

| Concept            | What It Is                                           | Where It's Used          |
|-------------------|------------------------------------------------------|--------------------------|
| REST API          | Standard way to structure web APIs using HTTP methods | All routes               |
| Middleware        | Functions that run between request and response      | `auth.js`, `cors`, `express.json` |
| JWT               | Stateless token-based authentication                 | Login, signup, auth middleware |
| Password Hashing  | One-way encryption of passwords                      | User model (bcrypt)      |
| Mongoose Schema   | Defines document structure and validation            | User.js, Assessment.js   |
| Pre-save Hook     | Code that runs before saving a document              | Password hashing         |
| Environment Vars  | Configuration stored outside code                    | `.env` file              |

### Frontend Concepts

| Concept           | What It Is                                           | Where It's Used          |
|-------------------|------------------------------------------------------|--------------------------|
| Component         | Reusable UI building block                           | Every `.jsx` file        |
| Props             | Data passed from parent to child component           | Button, Input, Steps     |
| State (useState)  | Component-level reactive data                        | Forms, loading states    |
| Effect (useEffect)| Side effects (API calls, subscriptions)              | Data fetching on mount   |
| Context           | Global state shared across components                | AuthContext              |
| Client-side Routing | URL changes without page reload                    | React Router             |
| Protected Route   | Route that requires authentication                   | Dashboard, Profile, etc. |
| Interceptor       | Function that modifies requests/responses            | Token attachment, 401 handling |

### Deployment Concepts

| Concept           | What It Is                                           | Where It's Used          |
|-------------------|------------------------------------------------------|--------------------------|
| Build Step        | Compile/bundle code for production                   | Vite build               |
| Static Serving    | Serve pre-built files (HTML, CSS, JS)                | Express in production    |
| Environment Vars  | Secrets and config set in the hosting platform       | Render dashboard         |
| Blueprint (IaC)   | Infrastructure defined as a config file              | `render.yaml`            |
| SPA Catch-all     | Return index.html for all non-API routes             | Express `*` route        |

---

## 16. Exercises for Students

### Beginner

1. **Add a field to the profile**: Add a "LinkedIn URL" field to the education step. You'll need to:
   - Update the User schema in `server/models/User.js`
   - Add an input field in `client/src/components/ProfileBuilder/EducationStep.jsx`
   - Update the profile save logic in `server/routes/auth.js`

2. **Change the color theme**: Modify `tailwind.config.js` to use a green or purple primary color palette instead of blue.

3. **Add a "last login" field**: Record when users last logged in. Update the User model and the login route.

### Intermediate

4. **Add assessment deletion confirmation**: Replace `window.confirm()` in Dashboard.jsx with a proper modal dialog component.

5. **Add pagination**: The assessments list currently loads all assessments. Add pagination to show 5 at a time with "Load more" or page numbers.

6. **Add input validation on the frontend**: Add form validation to the profile steps (e.g., require graduation year to be a 4-digit number, CGPA between 0-10).

7. **Add rate limiting**: Prevent users from creating too many assessments. Add a rate limit of 5 assessments per day using a simple check in the route handler.

### Advanced

8. **Add a "Compare Assessments" feature**: Let users compare two assessments side by side to see their progress over time.

9. **Add email verification**: After signup, send a verification email before allowing users to create assessments. Use a service like Resend or SendGrid.

10. **Add real-time updates**: Use Server-Sent Events (SSE) or WebSockets to stream the AI assessment results as they're generated, instead of waiting for the complete response.

11. **Add an admin dashboard**: Create an admin role that can see all users and their assessments, with analytics like "most common target roles" and "average skill gaps".

12. **Deploy with a custom domain**: Register a domain and configure it to point to your Render deployment. Set up SSL.

---

## Repository

**GitHub**: https://github.com/tansak/student-placement-assistant

**Live Application**: https://student-placement-assistant.onrender.com

---

## Quick Reference: Running the Project

### Local Development

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- Anthropic API key (from https://console.anthropic.com)

---

*This guide and application were built using Claude Code, Anthropic's AI-powered development tool.*
