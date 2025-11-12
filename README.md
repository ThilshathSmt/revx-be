# 🚀 RevX Backend – Employee Performance Review System (Server)

The **RevX Backend** powers the Employee Performance Review System, managing data, authentication, and business logic for HR admins, managers, and employees.  
It provides secure RESTful APIs built using **Node.js**, **Express.js**, and **MongoDB**.

---

## 🧠 Project Overview

This backend handles:
- Role-based authentication (HR / Manager / Employee)
- Goal and task management
- Review cycles and notifications
- Self-assessment and feedback
- Data analytics and reporting APIs

---

## 🏗️ Tech Stack

| Technology | Description |
|-------------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) | JavaScript runtime for backend |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) | Web application framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) | NoSQL database |
| ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) | JSON Web Token authentication |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-0078D4?logo=gmail&logoColor=white) | Email notification system |
| ![Cron](https://img.shields.io/badge/Cron%20Jobs-2E8B57?logo=clockify&logoColor=white) | Automated review reminders |

---

## 🧬 System Architecture

```mermaid
flowchart TD
    subgraph Client[Frontend (Next.js)]
    A1[User Actions] --> A2[API Calls]
    end

    subgraph Server[Backend (Express.js)]
    A2 --> B1[Routes Layer]
    B1 --> B2[Controllers]
    B2 --> B3[Services & Middleware]
    B3 --> B4[MongoDB Database]
    end

    subgraph DB[Database]
    B4 --> C1[(revx_be_1)]
    end

    subgraph Notifications
    B3 --> D1[Email / Cron Jobs]
    end
=====================================================================================================================
| Feature         | Endpoint             | Method     | Description               |
| --------------- | -------------------- | ---------- | ------------------------- |
| Authentication  | `/api/auth/login`    | POST       | User login (JWT)          |
| User Management | `/api/users`         | POST / GET | Create & fetch users      |
| Departments     | `/api/departments`   | CRUD       | Manage departments        |
| Teams           | `/api/teams`         | CRUD       | Manage teams and members  |
| Goals           | `/api/goals`         | CRUD       | Set and track goals       |
| Tasks           | `/api/tasks`         | CRUD       | Assign and manage tasks   |
| Reviews         | `/api/reviews`       | POST / PUT | Create goal/task review   |
| Notifications   | `/api/notifications` | GET        | Send alerts and reminders |
| Reports         | `/api/reports`       | GET        | Analytics and summaries   |

=====================================================================================================================

# Clone the repository
git clone https://github.com/ThilshathSmt/revx-be.git
cd revx-be

# Install dependencies
npm install

# Configure environment variables
touch .env
# Add:
# MONGO_URI=mongodb://localhost:27017/revx_be_1
# JWT_SECRET=your-secret
# PORT=5001

# Start development server
npm run dev
=====================================================================================================================

| Member           | Role                 | Contribution                                      |
| ---------------- | -------------------- | ------------------------------------------------- |
| **Thilshath SM** | Full Stack Developer | Review Scheduling, Notifications, API Integration |
| **Faskath MHM**  | Full Stack Developer | Authentication & Role Management (JWT / RBAC)     |
| **Muadh MRM**    | Full Stack Developer | Goal & Task APIs, CRUD Operations                 |
| **Fadhil MFM**   | Full Stack Developer | Feedback & Self-assessment APIs                   |
| **Haneef MNAR**  | Full Stack Developer | Reporting & Analytics APIs                        |

=====================================================================================================================

| Command       | Description               |
| ------------- | ------------------------- |
| `npm run dev` | Start backend in dev mode |
| `npm start`   | Start in production mode  |
| `npm test`    | Run backend tests         |

=====================================================================================================================

revx-be/
│
├── config/           # MongoDB config
├── controllers/      # Business logic
├── middleware/       # JWT & auth middleware
├── models/           # Mongoose schemas
├── routes/           # API routes
├── utils/            # Utilities and helpers
├── Services/         # Email and cron services
├── uploads/          # File uploads
├── app.js
└── server.js

=====================================================================================================================

📊 Deployment

Can be hosted on Render / EC2 / Vercel

Update .env with production MongoDB URI

Configure email credentials for Nodemailer
