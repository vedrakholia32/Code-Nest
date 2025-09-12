import { ProjectTemplate } from "@/types/framework";

export const EXPRESS_TEMPLATE: ProjectTemplate = {
  id: 'express-template',
  name: 'Express.js API Starter',
  framework: 'express',
  description: 'A RESTful API server built with Express.js and TypeScript',
  packageJson: {
    name: 'express-api',
    version: '1.0.0',
    description: 'Express.js API with TypeScript',
    main: 'dist/server.js',
    scripts: {
      dev: 'nodemon src/server.ts',
      build: 'tsc',
      start: 'node dist/server.js',
      test: 'jest',
      'test:watch': 'jest --watch'
    },
    dependencies: {
      express: '^4.18.0',
      cors: '^2.8.5',
      helmet: '^7.0.0',
      morgan: '^1.10.0',
      dotenv: '^16.0.0'
    },
    devDependencies: {
      '@types/express': '^4.17.0',
      '@types/cors': '^2.8.0',
      '@types/morgan': '^1.9.0',
      '@types/node': '^20.0.0',
      nodemon: '^3.0.0',
      'ts-node': '^10.9.0',
      typescript: '^5.0.0',
      jest: '^29.0.0',
      '@types/jest': '^29.0.0',
      'ts-jest': '^29.0.0'
    }
  },
  files: [
    {
      path: 'src/server.ts',
      content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import apiRoutes from './routes/api';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.js API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api/docs'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server is running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
  console.log(\`🔗 API endpoints: http://localhost:\${PORT}/api\`);
});

export default app;`,
      type: 'config',
      language: 'typescript',
      isEntry: true
    },
    {
      path: 'src/routes/api.ts',
      content: `import { Router } from 'express';
import usersRouter from './users';
import postsRouter from './posts';

const router = Router();

// API Documentation
router.get('/', (req, res) => {
  res.json({
    message: 'Express.js API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts'
    },
    documentation: 'Visit /api/docs for detailed API documentation'
  });
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    title: 'Express.js API Documentation',
    version: '1.0.0',
    baseUrl: \`\${req.protocol}://\${req.get('host')}/api\`,
    endpoints: [
      {
        path: '/users',
        methods: ['GET', 'POST'],
        description: 'User management endpoints'
      },
      {
        path: '/users/:id',
        methods: ['GET', 'PUT', 'DELETE'],
        description: 'Individual user operations'
      },
      {
        path: '/posts',
        methods: ['GET', 'POST'],
        description: 'Post management endpoints'
      },
      {
        path: '/posts/:id',
        methods: ['GET', 'PUT', 'DELETE'],
        description: 'Individual post operations'
      }
    ]
  });
});

// Mount route handlers
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

export default router;`,
      type: 'api',
      language: 'typescript'
    },
    {
      path: 'src/routes/users.ts',
      content: `import { Router, Request, Response } from 'express';

const router = Router();

// Mock data (in a real app, this would come from a database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', createdAt: new Date() }
];

// GET /api/users - Get all users
router.get('/', (req: Request, res: Response) => {
  res.json({
    data: users,
    count: users.length,
    message: 'Users retrieved successfully'
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: \`User with ID \${id} does not exist\`
    });
  }

  res.json({
    data: user,
    message: 'User retrieved successfully'
  });
});

// POST /api/users - Create new user
router.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Name and email are required'
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({
    data: newUser,
    message: 'User created successfully'
  });
});

// PUT /api/users/:id - Update user
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: \`User with ID \${id} does not exist\`
    });
  }

  const { name, email } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  res.json({
    data: users[userIndex],
    message: 'User updated successfully'
  });
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      message: \`User with ID \${id} does not exist\`
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    data: deletedUser,
    message: 'User deleted successfully'
  });
});

export default router;`,
      type: 'api',
      language: 'typescript'
    },
    {
      path: 'src/routes/posts.ts',
      content: `import { Router, Request, Response } from 'express';

const router = Router();

// Mock data
let posts = [
  {
    id: 1,
    title: 'Getting Started with Express.js',
    content: 'Express.js is a minimal and flexible Node.js web application framework...',
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Building RESTful APIs',
    content: 'REST is an architectural style for designing networked applications...',
    authorId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// GET /api/posts - Get all posts
router.get('/', (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  let result = posts;

  if (offset) {
    result = result.slice(Number(offset));
  }

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  res.json({
    data: result,
    total: posts.length,
    count: result.length,
    message: 'Posts retrieved successfully'
  });
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({
      error: 'Post not found',
      message: \`Post with ID \${id} does not exist\`
    });
  }

  res.json({
    data: post,
    message: 'Post retrieved successfully'
  });
});

// POST /api/posts - Create new post
router.post('/', (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Title, content, and authorId are required'
    });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    authorId: Number(authorId),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  posts.push(newPost);

  res.status(201).json({
    data: newPost,
    message: 'Post created successfully'
  });
});

// PUT /api/posts/:id - Update post
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: 'Post not found',
      message: \`Post with ID \${id} does not exist\`
    });
  }

  const { title, content } = req.body;
  
  if (title) posts[postIndex].title = title;
  if (content) posts[postIndex].content = content;
  posts[postIndex].updatedAt = new Date();

  res.json({
    data: posts[postIndex],
    message: 'Post updated successfully'
  });
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: 'Post not found',
      message: \`Post with ID \${id} does not exist\`
    });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  res.json({
    data: deletedPost,
    message: 'Post deleted successfully'
  });
});

export default router;`,
      type: 'api',
      language: 'typescript'
    },
    {
      path: 'src/middleware/errorHandler.ts',
      content: `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};`,
      type: 'middleware',
      language: 'typescript'
    },
    {
      path: 'src/middleware/notFound.ts',
      content: `import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: {
      message: \`Route \${req.originalUrl} not found\`,
      status: 404
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};`,
      type: 'middleware',
      language: 'typescript'
    },
    {
      path: 'tsconfig.json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`,
      type: 'config',
      language: 'json'
    },
    {
      path: '.env.example',
      content: `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (if using a database)
# DATABASE_URL=mongodb://localhost:27017/express-app
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=express_app
# DB_USER=your_username
# DB_PASSWORD=your_password

# JWT Configuration (if using authentication)
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRES_IN=24h

# API Keys (if using external services)
# API_KEY=your-api-key
# EXTERNAL_SERVICE_URL=https://api.example.com

# CORS Configuration
# CORS_ORIGIN=http://localhost:3000,http://localhost:3001`,
      type: 'config',
      language: 'text'
    },
    {
      path: 'nodemon.json',
      content: `{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}`,
      type: 'config',
      language: 'json'
    }
  ],
  readme: `# Express.js API Starter

A robust RESTful API server built with Express.js, TypeScript, and modern best practices.

## Features

- ✅ **TypeScript** for type safety
- ✅ **Express.js** web framework
- ✅ **RESTful API** design patterns
- ✅ **CORS** enabled
- ✅ **Security** headers with Helmet
- ✅ **Request logging** with Morgan
- ✅ **Error handling** middleware
- ✅ **Environment variables** support
- ✅ **Hot reload** with Nodemon
- ✅ **API documentation** endpoints

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Visit [http://localhost:3000](http://localhost:3000) to see the API

## Available Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm test\` - Run tests
- \`npm run test:watch\` - Run tests in watch mode

## API Endpoints

### Health Check
- \`GET /health\` - Server health status

### Users API
- \`GET /api/users\` - Get all users
- \`GET /api/users/:id\` - Get user by ID
- \`POST /api/users\` - Create new user
- \`PUT /api/users/:id\` - Update user
- \`DELETE /api/users/:id\` - Delete user

### Posts API
- \`GET /api/posts\` - Get all posts
- \`GET /api/posts/:id\` - Get post by ID
- \`POST /api/posts\` - Create new post
- \`PUT /api/posts/:id\` - Update post
- \`DELETE /api/posts/:id\` - Delete post

### Documentation
- \`GET /api\` - API overview
- \`GET /api/docs\` - Detailed API documentation

## Project Structure

\`\`\`
src/
├── middleware/
│   ├── errorHandler.ts     # Global error handling
│   └── notFound.ts         # 404 handler
├── routes/
│   ├── api.ts              # Main API router
│   ├── users.ts            # User routes
│   └── posts.ts            # Post routes
└── server.ts               # Application entry point
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and configure:

- \`PORT\` - Server port (default: 3000)
- \`NODE_ENV\` - Environment (development/production)

## Learn More

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
`
};
