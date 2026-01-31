# JobHub

> Discover Your Next Career Move

## Overview

JobHub is a modern full-stack job platform connecting professionals with curated career opportunities. Built with **Angular 17** frontend and **Spring Boot 3** backend, it supports three user roles—**Admin**, **Recruiter**, and **Seeker**—with tailored dashboards and workflows for each.

## Features

- **Job Board**: Browse, filter, and apply for jobs. Applications support attachments and profile links.
- **Authentication**: JWT-based authentication with role-based access control.
- **Role-based Dashboards**:
  - **Admin**: Approve/deny job offers, supervise platform health, manage users.
  - **Recruiter**: Post jobs, track applications, manage candidate pipelines.
  - **Seeker**: Track applications, save jobs, receive recommendations.
- **Notifications**: Real-time alerts for applications, approvals, and status changes.
- **Contact/About**: Support channels and company values.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17 | Frontend framework |
| TypeScript | 5.2 | Type-safe JavaScript |
| RxJS | 7.8 | Reactive programming |
| Bootstrap | 5 | UI styling |
| SCSS | - | Styling preprocessor |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.0 | Backend framework |
| Java | 17 | Programming language |
| Spring Security | 6 | Authentication & authorization |
| Spring Data JPA | 3.2 | Database ORM |
| PostgreSQL | 15+ | Database (Supabase) |
| JWT (jjwt) | 0.12.3 | Token-based authentication |
| Lombok | - | Boilerplate reduction |
| Maven | 3.9+ | Build tool |

### Database
- **Supabase PostgreSQL** - Cloud-hosted PostgreSQL database with connection pooling

---

## Project Structure

```
jobhub/
├── frontend/                    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── job/         # Job card, details modal
│   │   │   │   └── layout/      # Header, footer
│   │   │   ├── guards/          # Auth & role guards
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   ├── pages/           # Main pages
│   │   │   │   ├── home/
│   │   │   │   ├── job-board/
│   │   │   │   ├── dashboard/   # Role-specific dashboards
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── services/        # API services
│   │   └── assets/              # Static assets
│   ├── angular.json
│   └── package.json
│
├── backend/
│   └── jobhub/                  # Spring Boot backend
│       ├── src/main/java/com/backend/jobhub/
│       │   ├── config/          # Security, CORS, data init
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/             # Data transfer objects
│       │   ├── entity/          # JPA entities
│       │   ├── repository/      # Data repositories
│       │   ├── security/        # JWT & auth components
│       │   └── service/         # Business logic
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
│
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Get approved jobs | No |
| GET | `/api/jobs/all` | Get all jobs | Yes |
| GET | `/api/jobs/{id}` | Get job by ID | No |
| POST | `/api/jobs` | Create job | Recruiter |
| PUT | `/api/jobs/{id}` | Update job | Recruiter |
| DELETE | `/api/jobs/{id}` | Delete job | Recruiter |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications` | Submit application | Seeker |
| GET | `/api/applications/job/{jobId}` | Get applications for job | Recruiter |
| GET | `/api/applications/user/{userId}` | Get user's applications | Seeker |
| PUT | `/api/applications/{id}/status` | Update application status | Recruiter |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | `/api/admin/jobs/{id}/approve` | Approve job | Admin |
| PUT | `/api/admin/jobs/{id}/deny` | Deny job | Admin |
| GET | `/api/admin/jobs/pending` | Get pending jobs | Admin |
| GET | `/api/admin/stats` | Get platform statistics | Admin |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.9+
- **Supabase** account (or local PostgreSQL)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/jobhub
   ```

2. **Configure database** in `src/main/resources/application.properties`:
   ```properties
   # Supabase PostgreSQL (Session Pooler)
   spring.datasource.url=jdbc:postgresql://aws-1-eu-central-1.pooler.supabase.com:5432/postgres
   spring.datasource.username=postgres.YOUR_PROJECT_ID
   spring.datasource.password=YOUR_PASSWORD
   ```

3. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend runs on [http://localhost:8081](http://localhost:8081)

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm start
   ```
   Frontend runs on [http://localhost:4200](http://localhost:4200)

---

## Demo Accounts

The application seeds demo users on first startup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobhub.com | DemoAdmin123 |
| Recruiter | recruiter@jobhub.com | DemoRecruiter123 |
| Seeker | seeker@jobhub.com | DemoSeeker123 |

---

## Environment Configuration

### Backend (`application.properties`)

```properties
# Server
server.port=8081

# Database (Supabase)
spring.datasource.url=jdbc:postgresql://aws-1-eu-central-1.pooler.supabase.com:5432/postgres
spring.datasource.username=postgres.YOUR_PROJECT_ID
spring.datasource.password=YOUR_PASSWORD

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:4200
```

### Frontend

API base URL is configured in the services (default: `http://localhost:8081/api`)

---

## Database Schema

### Tables
- **users** - User accounts with roles (admin, recruiter, seeker)
- **jobs** - Job postings with status (pending, approved, denied, draft)
- **job_applications** - Applications linking seekers to jobs
- **notifications** - User notifications
- **job_requirements** - Job requirements (one-to-many)
- **job_responsibilities** - Job responsibilities (one-to-many)
- **job_tags** - Job tags (one-to-many)

---

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend/jobhub
./mvnw test
```

---

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Build output: `dist/frontend/`

### Backend
```bash
cd backend/jobhub
./mvnw clean package -DskipTests
```
JAR output: `target/jobhub-0.0.1-SNAPSHOT.jar`

Run production JAR:
```bash
java -jar target/jobhub-0.0.1-SNAPSHOT.jar
```

---

## License

This project is for educational purposes.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
