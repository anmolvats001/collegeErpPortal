# 🎓 Multi-Tenant College ERP System

A scalable, enterprise-level **Multi-Tenant College ERP System** built using **Spring Boot Microservices Architecture**.

The system is designed to manage multiple colleges from a single platform while maintaining tenant isolation. Each college can manage its users, students, teachers, courses, classes, admissions, attendance, fees, notifications, and files independently.

The project follows modern backend architecture principles including microservices, API Gateway, JWT authentication, Kafka-based event-driven communication, Redis caching, and Dockerized infrastructure.

---

# 🚀 Features

## 🏫 Multi-Tenant Architecture

* Support for multiple colleges on a single platform
* Tenant isolation using `CollegeId`
* College-specific users and resources
* Module-based feature access
* Independent data management for each college

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Refresh token support
* Role-Based Access Control (RBAC)
* Permission-based authorization
* User management
* Secure API communication
* College-based request isolation

---

## 👨‍🎓 Academic Management

* Course Management
* Branch Management
* Class Management
* Subject Management
* Teacher Management
* Student Management
* Teacher-Subject mapping
* Student-Class mapping

---

## 📊 Attendance Management

* Create attendance sessions
* Mark individual attendance
* Bulk attendance marking
* Subject-wise attendance
* Student attendance history
* Attendance summaries
* Teacher session management

---

## 📝 Examination Management

* Create and manage exams
* Exam types
* Exam status tracking
* Academic assessment management

---

## 📥 Admission Management

* Public college admission forms
* College-specific admission links
* Application submission without authentication
* Application review
* Application approval
* Application rejection
* Admission dashboard
* Application status tracking

Example public admission endpoints:

```text
POST /api/v1/admission/public/code/{collegeCode}/apply

POST /api/v1/admission/public/id/{collegeId}/apply
```

---

## 💰 Fee Management

* Student fee accounts
* Fee form windows
* Fee payment submissions
* Payment approval workflow
* Payment tracking
* Transaction ID management
* Payment proof storage references

---

## 📢 Notification System

Event-driven notification architecture using Apache Kafka.

Features include:

* Kafka event consumption
* Email notifications
* Asynchronous communication between services
* Notification event processing

Example Kafka topic:

```text
notification-events
```

---

## 📁 File Management

Dedicated Cloudinary microservice for file storage.

Features:

* Upload files to Cloudinary
* Store file metadata in MySQL
* Retrieve uploaded files
* List files by entity
* List files by owner
* Delete files
* Publish file events to Kafka

Example Kafka topic:

```text
file-events
```

---

## 💬 Real-Time Communication

The Class Service includes infrastructure for real-time features such as:

* Conversations
* Conversation members
* Messages
* Chat settings
* WebSocket communication
* STOMP messaging

---

# 🏗️ System Architecture

```text
                              ┌─────────────────────┐
                              │       CLIENT        │
                              │ React / Web / Mobile│
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │     API GATEWAY     │
                              │       :8080         │
                              └──────────┬──────────┘
                                         │
       ┌─────────────────────┬───────────┼───────────┬─────────────────────┐
       │                     │           │           │                     │
       ▼                     ▼           ▼           ▼                     ▼
┌─────────────┐      ┌─────────────┐ ┌───────────┐ ┌──────────────┐ ┌──────────────┐
│ Core Service│      │Class Service│ │ Admission │ │ Fee Service  │ │Notification  │
│    :8082    │      │    :8083    │ │  Service  │ │    :8085     │ │   Service    │
└──────┬──────┘      └──────┬──────┘ │   :8084   │ └──────┬───────┘ │    :8086     │
       │                    │        └─────┬─────┘        │         └──────┬───────┘
       │                    │              │              │                │
       └──────────────┬─────┴──────────────┴──────────────┴────────────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Kafka / Redis    │
             │ Event Processing │
             └──────────────────┘

                      │
                      ▼

             ┌──────────────────┐
             │ Cloudinary       │
             │ File Service     │
             │     :8087        │
             └──────────────────┘
```

---

# 🧩 Microservices

| Service              | Port | Responsibility                                                 |
| -------------------- | ---: | -------------------------------------------------------------- |
| API Gateway          | 8080 | Single entry point for client requests                         |
| Core Service         | 8082 | Users, Roles, Permissions, Colleges, Modules                   |
| Class Service        | 8083 | Students, Teachers, Classes, Subjects, Attendance, Exams, Chat |
| Admission Service    | 8084 | Public admission applications and workflows                    |
| Fee Service          | 8085 | Fees, payments, and fee windows                                |
| Notification Service | 8086 | Kafka-based email notifications                                |
| Cloudinary Service   | 8087 | File upload and Cloudinary integration                         |

---

# 🛠️ Tech Stack

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* Spring Cloud Gateway

## Database

* MySQL
* Redis

## Messaging

* Apache Kafka
* Apache Zookeeper

## File Storage

* Cloudinary

## Infrastructure

* Docker
* Docker Compose

## Security

* JWT Authentication
* Refresh Tokens
* Role-Based Access Control
* Permission-Based Authorization

---

# 📂 Project Structure

```text
MultiTenantProject/
│
├── ApiGateway/
│   └── ApiGateway/
│
├── core-service/
│   ├── User/
│   ├── College/
│   ├── Role/
│   ├── Permission/
│   ├── Module/
│   └── Common/
│
├── ClassService/
│   └── ClassService/
│       ├── Student/
│       ├── Teacher/
│       ├── Course/
│       ├── Branch/
│       ├── Class/
│       ├── Subject/
│       ├── Attendance/
│       ├── Exam/
│       └── Chat/
│
├── AdmissionService/
│   └── AdmissionService/
│
├── FeeService/
│
├── NotificationService/
│
├── CloudinaryService/
│
├── compose.yaml
│
└── README.md
```

---

# 🗄️ Database Architecture

Each major microservice has its own database.

| Database    | Service            | MySQL Port |
| ----------- | ------------------ | ---------: |
| coredb      | Core Service       |       4406 |
| classdb     | Class Service      |       4407 |
| admissiondb | Admission Service  |       4408 |
| feedb       | Fee Service        |       4409 |
| clouddb     | Cloudinary Service |       4410 |

This follows the **Database per Service** microservices pattern.

---

# 🐳 Infrastructure Setup

The project uses Docker Compose to start infrastructure services.

## Included Services

* MySQL Core Database
* MySQL Class Database
* MySQL Admission Database
* MySQL Fee Database
* MySQL Cloud Database
* Kafka
* Zookeeper
* Redis

---

## Start Infrastructure

From the root directory:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop infrastructure:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```

---

# ⚙️ Prerequisites

Before running the project, make sure you have installed:

* Java 17+
* Maven
* Docker Desktop
* MySQL (optional if using Docker)
* Git

Check versions:

```bash
java -version
mvn -version
docker --version
git --version
```

---

# ▶️ Running the Project

## Step 1: Start Infrastructure

```bash
docker compose up -d
```

---

## Step 2: Start Core Service

```bash
cd core-service
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8082
```

---

## Step 3: Start Class Service

```bash
cd ClassService/ClassService
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8083
```

---

## Step 4: Start Admission Service

```bash
cd AdmissionService/AdmissionService
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8084
```

---

## Step 5: Start Fee Service

```bash
cd FeeService
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8085
```

---

## Step 6: Start Notification Service

```bash
cd NotificationService
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8086
```

---

## Step 7: Start Cloudinary Service

Before running, configure:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Then:

```bash
cd CloudinaryService
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8087
```

---

## Step 8: Start API Gateway

```bash
cd ApiGateway/ApiGateway
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8080
```

---

# 🌐 API Gateway

All client requests should ideally go through the API Gateway.

```text
http://localhost:8080
```

Example:

```text
http://localhost:8080/api/v1/core/...
http://localhost:8080/api/v1/class/...
http://localhost:8080/api/v1/admission/...
http://localhost:8080/api/v1/fee/...
```

The API Gateway acts as the single entry point for the frontend.

---

# 🔐 Multi-Tenant Design

The system supports multiple colleges.

```text
                    ERP PLATFORM
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    College A        College B        College C
        │                │                │
    Students         Students         Students
    Teachers         Teachers         Teachers
    Classes          Classes          Classes
    Fees             Fees             Fees
```

Tenant-specific data is identified using:

```text
CollegeId
```

Each request can include:

```http
CollegeId: <COLLEGE_UUID>
```

This ensures that resources remain isolated between colleges.

---

# 🔑 Authentication Flow

```text
User Login
    │
    ▼
Authentication Service
    │
    ▼
JWT Access Token
    │
    ▼
Client Stores Token
    │
    ▼
Request with Authorization Header
    │
    ▼
API Gateway / Microservice
    │
    ▼
JWT Validation
    │
    ▼
Authorized Request
```

Authenticated requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 Event-Driven Architecture

Kafka is used for asynchronous communication between services.

Example flow:

```text
Fee Service
    │
    │ Payment Approved Event
    ▼
Kafka Topic
    │
    │ notification-events
    ▼
Notification Service
    │
    ▼
Email Notification
```

Another example:

```text
Cloudinary Service
      │
      │ FILE_UPLOADED
      ▼
Kafka Topic
      │
      │ file-events
      ▼
Future AI / Processing Service
```

---

# 📁 Cloudinary File Service API

## Health Check

```http
GET /api/files/health
```

## Upload File

```http
POST /api/files/upload
```

Content type:

```text
multipart/form-data
```

Required:

```text
file
```

Optional:

```text
folder
resourceType
ownerId
entityType
entityId
```

---

## Get File Metadata

```http
GET /api/files/{id}
```

## List Files by Entity

```http
GET /api/files?entityType=ADMISSION&entityId={id}
```

## List Files by Owner

```http
GET /api/files?ownerId={ownerId}
```

## Delete File

```http
DELETE /api/files/{id}
```

---

# 📥 Admission Workflow

```text
College Creates Admission Form
            │
            ▼
Public Admission Link
            │
            ▼
Student Submits Application
            │
            ▼
Admission Service Database
            │
            ▼
College Admin Reviews Application
            │
      ┌─────┴─────┐
      ▼           ▼
   Approved     Rejected
      │
      ▼
Student Creation
(Handled Later in Class Service)
```

Public applications do not require authentication.

College Admin operations require authentication and appropriate permissions.

---

# 📊 Core Modules

## Core Service

* Users
* Colleges
* Roles
* Permissions
* Modules
* Authentication
* Refresh Tokens

## Class Service

* Courses
* Branches
* Classes
* Subjects
* Teachers
* Students
* Attendance
* Exams
* Chat

## Admission Service

* Public Applications
* Application Review
* Approval
* Rejection
* Admission Dashboard

## Fee Service

* Student Fees
* Fee Windows
* Payments
* Payment Approvals

## Notification Service

* Kafka Consumer
* Email Notifications

## Cloudinary Service

* File Upload
* Cloudinary Storage
* File Metadata
* Kafka File Events

---

# 🧪 Future Improvements

* [ ] Service Discovery with Eureka
* [ ] Distributed Configuration Server
* [ ] Centralized Logging
* [ ] Distributed Tracing
* [ ] Prometheus Monitoring
* [ ] Grafana Dashboards
* [ ] Dockerize individual microservices
* [ ] Kubernetes Deployment
* [ ] CI/CD Pipeline
* [ ] Unit Testing
* [ ] Integration Testing
* [ ] API Documentation using Swagger/OpenAPI
* [ ] Rate Limiting at API Gateway
* [ ] Circuit Breakers with Resilience4j
* [ ] Video Calling Service
* [ ] AI-powered Student Assistant
* [ ] Analytics Service

---

# 🧠 Design Principles Used

This project follows several important software architecture principles:

* Microservices Architecture
* Database per Service
* API Gateway Pattern
* Event-Driven Architecture
* Multi-Tenant Architecture
* Role-Based Access Control
* Permission-Based Authorization
* Separation of Concerns
* Stateless JWT Authentication
* Asynchronous Service Communication

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Create a Pull Request

---

# 👨‍💻 Author

**Anmol Vats**

Computer Science Engineering Student

### Skills

* Java
* Spring Boot
* Microservices
* Spring Security
* Hibernate / JPA
* MySQL
* Redis
* Apache Kafka
* Docker
* React
* System Design

---

# 📌 Project Status

🚧 **Actively Under Development**

The project is continuously evolving with new microservices, modules, and enterprise-level features.

---

# ⭐ Support

If you found this project interesting, consider giving the repository a star ⭐.

It helps support and showcase the project.
