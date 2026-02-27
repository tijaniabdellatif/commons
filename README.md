# @tijaniabdellatif/commons

> Shared TypeScript library for a microservices-based Ecommerce platform — providing common interfaces, services, utilities, and infrastructure abstractions used across all services.

[![Build & Publish](https://github.com/tijaniabdellatif/commons/actions/workflows/publish.yml/badge.svg)](https://github.com/tijaniabdellatif/commons/actions/workflows/publish.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-98.9%25-blue)
![Node](https://img.shields.io/badge/Node-%3E%3D20-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Modules](#modules)
  - [Configuration](#configuration---configservice)
  - [Database](#database---databasefactory)
  - [ElasticSearch](#elasticsearch---elasticsearchfactory)
  - [Message Queues](#message-queues---queueconnection)
  - [HTTP Client](#http-client---axiosservice--strategy-pattern)
  - [Routing](#routing---routerinitializer)
  - [Repository](#repository---baserepository)
  - [Error Handling](#error-handling)
  - [Logging](#logging)
  - [Cloud Storage](#cloud-storage---cloudinaryservice)
  - [Utilities](#utilities)
  - [Console](#console---prettyconsole)
- [Domain Interfaces](#domain-interfaces)
- [Build System](#build-system)
- [CI/CD Pipeline](#cicd-pipeline)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This library centralizes shared logic for a **microservices ecommerce application** composed of multiple domain services (Auth, Buyer, Seller, Gig, Order, Chat, Review, Search, Notification). Instead of duplicating types, error handling, database connections, and utility functions across services, they are all maintained here and distributed as a scoped npm package via **GitHub Packages**.

### Key Design Principles

- **Singleton patterns** for shared resources (Config, Database, Axios)
- **Factory pattern** for database and ElasticSearch connections
- **Strategy pattern** for HTTP client configuration
- **Chain of Responsibility** for route handling
- **Event-driven** repository with built-in validation
- **Dual module output** — both ESM and CommonJS builds

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Microservices Layer                          │
│  ┌──────┐ ┌───────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌──────────┐  │
│  │ Auth │ │ Buyer │ │ Gig  │ │ Order │ │ Chat │ │ Review   │  │
│  └──┬───┘ └──┬────┘ └──┬───┘ └──┬────┘ └──┬───┘ └──┬───────┘  │
│     └────────┴─────────┴────────┴─────────┴────────┘            │
│                          │                                      │
│              ┌───────────▼──────────────┐                       │
│              │   @tijaniabdellatif/     │                       │
│              │        commons           │                       │
│              └───────────┬──────────────┘                       │
│                          │                                      │
│  ┌───────────────────────┼───────────────────────────────────┐  │
│  │                Shared Infrastructure                       │  │
│  │  ┌──────────┐ ┌──────────────┐ ┌────────────┐            │  │
│  │  │ TypeORM  │ │ ElasticSearch│ │  RabbitMQ  │            │  │
│  │  │ Database │ │   Client     │ │   Queues   │            │  │
│  │  └──────────┘ └──────────────┘ └────────────┘            │  │
│  │  ┌──────────┐ ┌──────────────┐ ┌────────────┐            │  │
│  │  │ Winston  │ │  Cloudinary  │ │   Axios    │            │  │
│  │  │ Logger   │ │   Uploads    │ │   HTTP     │            │  │
│  │  └──────────┘ └──────────────┘ └────────────┘            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
commons/
├── .github/
│   └── workflows/
│       └── publish.yml              # CI/CD — auto-publish to GitHub Packages
├── scripts/
│   ├── build-package.js             # Copies package.json into build/
│   └── babel-preset.js              # Babel config for CJS/ESM dual builds
├── src/
│   ├── Config/
│   │   └── ConfigService.ts         # Singleton env config with schema validation
│   ├── Connection/
│   │   └── DatabaseFactory.ts       # TypeORM multi-database connection manager
│   ├── Console/
│   │   └── PrettyConsole.ts         # Colorized terminal logger with icons
│   ├── Elastic/
│   │   ├── ElasticInterface.ts      # ElasticSearch config interface
│   │   ├── ElasticSearch.ts         # ES client with exponential backoff retry
│   │   └── ElasticSearchFactory.ts  # Factory to create ES instances
│   ├── Error/
│   │   └── ErrorHandler.ts          # Custom error hierarchy with serialization
│   ├── Interfaces/
│   │   ├── auth.interface.ts        # Auth, JWT payload, signup/signin types
│   │   ├── buyer.interface.ts       # Buyer document types
│   │   ├── seller.interface.ts      # Seller profile, experience, education
│   │   ├── gig.interface.ts         # Gig creation and listing types
│   │   ├── order.interface.ts       # Order, offer, delivery, review types
│   │   ├── chat.interface.ts        # Conversation & message types
│   │   ├── review.interface.ts      # Review and rating category types
│   │   ├── search.interface.ts      # ElasticSearch query types
│   │   ├── email.interface.ts       # Email template locals
│   │   ├── Enums.ts                 # Gateway service identifiers
│   │   ├── logger.ts                # Winston + ElasticSearch transport logger
│   │   ├── error-handler.ts         # Legacy error handler (CustomError)
│   │   └── gateway-middleware.ts     # Gateway JWT verification (commented)
│   ├── Queues/
│   │   ├── QueueConnection.ts       # RabbitMQ connection with graceful shutdown
│   │   └── createConnection.ts      # Factory function for queue connections
│   ├── Repositories/
│   │   └── BaseRepository.ts        # Generic CRUD + pagination + events + validation
│   ├── Routers/
│   │   ├── RouteInterface.ts        # Route & Controller interfaces
│   │   ├── AbstractRouteHandler.ts  # Abstract handler with chain-of-responsibility
│   │   ├── Router.ts                # Concrete Express router implementation
│   │   └── RouterInitializer.ts     # Registers controllers with Express app
│   ├── Services/
│   │   ├── AxiosService.ts          # Singleton HTTP client with strategy pattern
│   │   ├── CloudinaryService.ts     # Image/video upload to Cloudinary
│   │   ├── LoggerService.ts         # Winston + ElasticSearch logger factory
│   │   └── http/
│   │       ├── IApiStrategy.ts      # HTTP strategy interface
│   │       └── BasicApiStrategy.ts  # Default Axios strategy
│   ├── Utils/
│   │   └── helper.ts               # String helpers, email regex, async error wrapper
│   ├── types/
│   │   └── types.d.ts               # HTTP method type definitions
│   └── index.ts                     # Public API — barrel exports
├── .editorconfig
├── .gitignore
├── .npmrc                           # GitHub Packages registry config
├── package.json
└── tsconfig.json
```

---

## Installation

This package is published to **GitHub Packages**. Configure your `.npmrc` to use the GitHub registry for the `@tijaniabdellatif` scope:

```bash
# .npmrc in your service project
@tijaniabdellatif:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @tijaniabdellatif/commons
```

> **Requires Node.js >= 20**

---

## Modules

### Configuration — `ConfigService`

Singleton configuration manager that validates required environment variables at startup.

```typescript
import { ConfigService, ConfigSchema } from '@tijaniabdellatif/commons';

const schema: ConfigSchema = {
  DATABASE_URL: { required: true },
  PORT: { required: false, defaultValue: '3000' },
  JWT_SECRET: { required: true },
};

const config = ConfigService.getInstance(schema);
const dbUrl = config.get('DATABASE_URL');
```

**Features:** Schema validation on startup, singleton guarantee, fail-fast on missing required vars.

---

### Database — `DatabaseFactory`

Manages multiple TypeORM `DataSource` connections with a named connection pool.

```typescript
import { DatabaseFactory } from '@tijaniabdellatif/commons';

const dataSource = await DatabaseFactory.createConnection('auth-db', {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'auth',
  entities: [UserEntity],
  synchronize: true,
}, 'http://localhost:9200');

// Retrieve existing connection
const db = DatabaseFactory.getConnection('auth-db');

// Cleanup
await DatabaseFactory.closeAll();
```

**Features:** Named connection pool, automatic reconnect detection, integrated Winston/ES logging, graceful shutdown.

---

### ElasticSearch — `ElasticSearchFactory`

Creates ElasticSearch client instances with exponential backoff retry logic.

```typescript
import { ElasticSearchFactory } from '@tijaniabdellatif/commons';

const elastic = ElasticSearchFactory.create({
  node: 'http://localhost:9200',
  serviceName: 'gig-service',
  maxRetries: 5,
  retryDelay: 1000,
});

await elastic.checkConnection();
const client = elastic.getClient();
```

**Features:** Configurable retries with exponential backoff, health check, restart tolerance.

---

### Message Queues — `QueueConnection`

RabbitMQ connection manager with graceful shutdown on process signals.

```typescript
import { createQueueConnection, winstonLogger } from '@tijaniabdellatif/commons';

const logger = winstonLogger('http://localhost:9200', 'order-service', 'debug');
const queue = createQueueConnection('amqp://localhost', logger);
await queue.createConnection();

const channel = queue.getChannel();
// publish / consume messages...
```

**Features:** Auto-cleanup on SIGINT/SIGTERM, channel/connection accessors, integrated logging.

---

### HTTP Client — `AxiosService` & Strategy Pattern

Singleton Axios client that supports swappable strategies for different authentication/configuration needs.

```typescript
import { AxiosService, BasicApiStrategy } from '@tijaniabdellatif/commons';

const http = AxiosService.getInstance();
http.setStrategy(new BasicApiStrategy(), 'https://api.example.com', 'auth-service');

const users = await http.request<User[]>({ url: '/users', method: 'GET' });

// With URL params
const user = await http.request<User>(
  { url: '/users/:id', method: 'GET' },
  { id: '42' }
);
```

**Extend with custom strategies:**

```typescript
import { IApiStrategy } from '@tijaniabdellatif/commons';

class BearerApiStrategy implements IApiStrategy {
  createInstance(baseUrl: string, serviceName?: string) {
    return axios.create({
      baseURL: baseUrl,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  }
}
```

---

### Routing — `RouterInitializer`

Express route registration using a controller-based approach with Chain of Responsibility pattern.

```typescript
import { RouterInitializer, ControllerInterface } from '@tijaniabdellatif/commons';

const authController: ControllerInterface = {
  routes: [
    { path: '/auth/signup', method: 'post', handler: signupHandler, middlewares: [validateBody] },
    { path: '/auth/login', method: 'post', handler: loginHandler, middlewares: [] },
  ],
};

const router = new RouterInitializer([authController], [cors(), json()]);
router.initialize(app);
```

---

### Repository — `BaseRepository`

Generic repository with CRUD, pagination, validation, transactions, and event emission.

```typescript
import { BaseRepository } from '@tijaniabdellatif/commons';

class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(User), dataSource.manager);
  }
}

const repo = new UserRepository(dataSource);

// Create with DTO validation
const user = await repo.create({ name: 'John', email: 'john@example.com' }, CreateUserDTO);

// Paginated search with sorting
const results = await repo.findWithPagination(1, 10, {}, 'name', 'John', 'createdAt', 'DESC');

// Listen to entity events
repo.on('User.created', (data) => console.log('New user:', data));

// Transactions
await repo.transaction(async (manager) => {
  // ... transactional operations
});
```

**Features:** Generic CRUD, soft delete, pagination with filters/search/sort, DTO validation via `class-validator`, EventEmitter integration, transaction support.

---

### Error Handling

A custom error hierarchy with HTTP status codes and serialization for consistent API error responses.

| Error Class | Status Code | Description |
|---|---|---|
| `BadRequestError` | 400 | Invalid request data |
| `NotAuthorized` | 401 | Authentication failure |
| `NotFound` | 404 | Resource not found |
| `FileToLarge` | 413 | Upload size exceeded |
| `ServerError` | 500 | Internal server error |
| `ValidationProccessError` | 422 | Validation failure |

```typescript
import { BadRequestError, NotAuthorized } from '@tijaniabdellatif/commons';

throw new BadRequestError('Invalid email format', 'AuthController.signup()');

// In error middleware
app.use((err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json(err.serializer());
  }
});
```

---

### Logging

Dual-transport Winston logger — Console + ElasticSearch for centralized log aggregation.

```typescript
import { winstonLogger } from '@tijaniabdellatif/commons';

const logger = winstonLogger('http://localhost:9200', 'auth-service', 'debug');

logger.info('User created successfully');
logger.error('Database connection failed', { error: err.message });
```

---

### Cloud Storage — `CloudinaryService`

Static service for uploading images and videos to Cloudinary.

```typescript
import { CloudinaryService } from '@tijaniabdellatif/commons';

CloudinaryService.initialize({
  cloud_name: 'your-cloud',
  api_key: 'your-key',
  api_secret: 'your-secret',
});

const result = await CloudinaryService.uploads(base64Image, 'user-avatar', true, true);
const video = await CloudinaryService.videoUpload(videoFile, 'gig-preview');
```

---

### Utilities

String manipulation and Express async error handling helpers.

```typescript
import {
  firstLetterUppercase,
  lowerCase,
  toUpperCase,
  isEmail,
  isDataURL,
  catchAsynError,
} from '@tijaniabdellatif/commons';

firstLetterUppercase('john doe');  // "John Doe"
isEmail('user@example.com');       // true
isDataURL('data:image/png;...');   // true

// Wrap async route handlers
app.get('/users', catchAsynError(async (req, res) => {
  const users = await getUsers();
  res.json(users);
}));
```

---

### Console — `PrettyConsole`

Colorized terminal output with log levels and icon support for development.

```typescript
import { PrettyConsole } from '@tijaniabdellatif/commons';

const console = new PrettyConsole();
console.success('Server started on port 3000');
console.error('Failed to connect to database');
console.info('Processing 42 records...');
console.warn('Deprecation: use v2 endpoint');
console.debug('Query result:', { rows: 5 });
```

---

## Domain Interfaces

The library exports TypeScript interfaces for all microservice domains, ensuring type consistency across the platform:

| Domain | Key Interfaces | Description |
|---|---|---|
| **Auth** | `IAuthPayload`, `IAuthDocument`, `ISignUpPayload`, `ISignInPayload` | JWT payloads, user documents, auth flows |
| **Buyer** | `IBuyerDocument`, `IReduxBuyer` | Buyer profiles and Redux state |
| **Seller** | `ISellerDocument`, `IExperience`, `IEducation`, `ICertificate` | Seller profiles with nested types |
| **Gig** | `ISellerGig`, `ICreateGig`, `IGigCardItems` | Gig CRUD and UI component props |
| **Order** | `IOrderDocument`, `IOffer`, `IDeliveredWork`, `IOrderEvents` | Full order lifecycle |
| **Chat** | `IMessageDocument`, `IConversationDocument`, `IChatBoxProps` | Real-time messaging |
| **Review** | `IReviewDocument`, `IRatingCategories` | Review system with rating breakdowns |
| **Search** | `ISearchResult`, `IQueryList`, `IPaginateProps` | ElasticSearch query/result types |
| **Email** | `IEmailLocals` | Email template variables |

---

## Build System

The library outputs three build artifacts for maximum compatibility:

```bash
npm run build
```

This runs:

1. **CJS build** (`build/cjs/`) — CommonJS via Babel for `require()` consumers
2. **ESM build** (`build/esm/`) — ES Modules via Babel for `import` consumers
3. **Type declarations** (`build/src/`) — TypeScript `.d.ts` files via `tsc`
4. **Package copy** — `package.json` copied into `build/` for publishing

Module resolution is configured in `package.json` via the `exports` field:

```json
{
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js"
    }
  },
  "types": "./src/index.d.ts"
}
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/publish.yml`) automatically builds and publishes to **GitHub Packages** on every push or PR to `master`:

```
Push to master → Install → Build (CJS + ESM + Types) → Configure .npmrc → Publish to GitHub Packages
```

The pipeline uses `GITHUB_TOKEN` for authentication — no additional secrets required.

---

## Usage Examples

### Bootstrap a New Microservice

```typescript
import {
  ConfigService,
  DatabaseFactory,
  ElasticSearchFactory,
  createQueueConnection,
  RouterInitializer,
  winstonLogger,
  CloudinaryService,
} from '@tijaniabdellatif/commons';

// 1. Load config
const config = ConfigService.getInstance({
  DATABASE_URL: { required: true },
  RABBITMQ_URL: { required: true },
  ELASTIC_URL: { required: true },
  CLOUDINARY_NAME: { required: true },
  CLOUDINARY_KEY: { required: true },
  CLOUDINARY_SECRET: { required: true },
});

// 2. Initialize logger
const logger = winstonLogger(config.get('ELASTIC_URL'), 'gig-service', 'debug');

// 3. Connect to database
const db = await DatabaseFactory.createConnection('gig-db', {
  type: 'postgres',
  url: config.get('DATABASE_URL'),
  entities: [GigEntity],
}, config.get('ELASTIC_URL'));

// 4. Connect to ElasticSearch
const elastic = ElasticSearchFactory.create({
  node: config.get('ELASTIC_URL'),
  serviceName: 'gig-service',
});
await elastic.checkConnection();

// 5. Connect to RabbitMQ
const queue = createQueueConnection(config.get('RABBITMQ_URL'), logger);
await queue.createConnection();

// 6. Initialize Cloudinary
CloudinaryService.initialize({
  cloud_name: config.get('CLOUDINARY_NAME'),
  api_key: config.get('CLOUDINARY_KEY'),
  api_secret: config.get('CLOUDINARY_SECRET'),
});

// 7. Register routes
const router = new RouterInitializer([gigController, healthController]);
router.initialize(app);
```

---

## Tech Stack

| Dependency | Purpose |
|---|---|
| `typescript` | Language & type declarations |
| `typeorm` | Database ORM (PostgreSQL, MySQL, etc.) |
| `mongoose` | MongoDB ODM (interface types) |
| `@elastic/elasticsearch` | ElasticSearch client |
| `amqplib` | RabbitMQ client |
| `express` | HTTP routing abstractions |
| `axios` | HTTP client |
| `winston` + `winston-elasticsearch` | Structured logging |
| `cloudinary` | Image/video uploads |
| `class-validator` + `class-transformer` | DTO validation |
| `http-status-codes` | Standard HTTP status constants |
| `@babel/cli` + `cross-env` | Dual CJS/ESM builds |

---

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes in `src/`
4. Build: `npm run build`
5. Push to `master` — the CI pipeline publishes automatically

---

## License

MIT © [Tijani Abdellatif](https://github.com/tijaniabdellatif)
