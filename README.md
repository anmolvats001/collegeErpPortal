# College ERP Portal (`collegeErpPortal`)

A production-grade, multi-tenant enterprise ERP platform designed for higher-education colleges and universities. The platform enables multi-college governance, automated tenant switching, departmental and academic course management, student admissions, fee scheduling, event-driven Kafka notifications, and secure asset storage.

---

## 🏗️ Architecture & Services Topology

The platform is architected as a distributed microservices ecosystem behind a unified API Gateway with a modern React Single-Page Application (SPA):

```
                                +---------------------------+
                                |  React Vite SPA (:5173)   |
                                +-------------+-------------+
                                              |
                                              v
                                +---------------------------+
                                |   API Gateway (:8080)     |
                                +-------------+-------------+
                                              |
        +------------------+------------------+------------------+------------------+
        |                  |                  |                  |                  |
        v                  v                  v                  v                  v
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
|  CoreService  |  |  ClassService |  |AdmissionServ. |  |   FeeService  |  | CloudinaryServ|
|    (:8082)    |  |    (:8083)    |  |    (:8084)    |  |    (:8085)    |  |    (:8087)    |
+-------+-------+  +---------------+  +---------------+  +---------------+  +---------------+
        |                                                                           
        +=== (Kafka: notification-events) ===> +-----------------------+             
                                               | Notification Service  |             
                                               |        (:8086)        |             
                                               +-----------+-----------+             
                                                           |                         
                                                           v                         
                                                   [ Gmail SMTP / SSL ]              
```

### Microservices Summary

| Service | Port | Database | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Frontend** | `:5173` | Browser Storage | React 18 SPA, Tailwind/Lucide-react, multi-tenant context switcher |
| **ApiGateway** | `:8080` | None | Unified entrypoint, CORS filter, JWT validation, service routing |
| **CoreService** | `:8082` | MySQL (`coredb`:4406) | Multi-tenant college provisioning, RBAC, users, auth, Kafka producer |
| **ClassService** | `:8083` | MySQL (`classdb`:4407) | Courses, academic branches, classes, sections, subjects, attendance |
| **AdmissionService**| `:8084` | MySQL (`admissiondb`:4408) | Public applicant dossiers, document tracking, application status workflow |
| **FeeService** | `:8085` | MySQL (`feedb`:4409) | Fee window scheduling, student payment accounts, ledger tracking |
| **NotificationService** | `:8086` | In-memory / Kafka | Kafka consumer group `notification-service`, SMTP email dispatch |
| **CloudinaryService** | `:8087` | MySQL (`clouddb`:4410) | Document upload metadata and cloud file storage proxy |

### Infrastructure (Docker)
- **MySQL 8.0**: Dedicated containerized instances per domain database (`4406`-`4410`).
- **Redis 7.2**: Session token cache and permission resolution (`:6379`).
- **Apache Kafka & Zookeeper**: Distributed event bus for async notifications (`:9092`, `:2181`).

---

## 🚀 Quick Start

### 1. Prerequisites
- **Java 21** JDK
- **Node.js 18+** & `npm`
- **Docker & Docker Compose**
- **Git**

### 2. Start Infrastructure
Ensure Docker Desktop is running, then verify containers:
```powershell
docker ps
```

### 3. Start All Services
Launch all microservices and frontend concurrently:
```powershell
.\start_all.ps1
```

Or check status anytime:
```powershell
.\check_status.ps1
```

### 4. Run End-to-End Business Integration Suite
Execute the automated verification suite covering all 17 multi-tenant steps:
```powershell
.\test_full_suite.ps1
```

---

## 🔐 Multi-Tenant Security & Isolation
- **College Scoping**: Multi-tenancy is enforced using the `X-College-Id` header and college-scoped JWT claims.
- **Main Admin vs College Admin**: Main Admins can switch between colleges seamlessly using the dynamic Campus Switcher or manage global tenants.
- **Event-Driven Alerts**: Core account activations and admission state changes automatically dispatch email alerts via Kafka.

---

## 📄 License
This repository is licensed under the MIT License.
