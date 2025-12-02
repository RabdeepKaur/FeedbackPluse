Feedbackpluse

A lightweight feedback collection system featuring a cross-site embeddable widget, Firebase authentication, a Next.js dashboard, and PostgreSQL storage.


https://github.com/user-attachments/assets/9ec4d486-2739-46c2-b5a9-7a9ef108d4e1


Features

Authentication
Email/password login via Firebase + Google Sign-in.

Projects Management
Create and manage multiple projects.
Each project includes:

Auto-generated project key

Embeddable script snippet

Feedback Widget
Small JS file served by backend, opens popup to collect feedback and POSTs to the API.
Designed to work across domains with correct CORS configuration.

Admin Dashboard

List all projects

View and filter feedback by type: All / Bug / Feature / Other

Feedback Listing
All feedback entries appear in the dashboard.

Database
PostgreSQL + Prisma ORM.

Tech Stack

Frontend: Next.js

Backend: Next.js API Routes

Database: PostgreSQL

ORM: Prisma

Auth: Firebase Auth (email/password + Google Sign-in)

Optional AI: Google Gemini API

Prerequisites

Node.js (v18+ recommended)

PostgreSQL database (local / Docker / hosted)

Firebase project (for authentication)

API key for external AI (optional)

Environment Variables

Create a .env file in the project root.

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=some-very-secret

# Firebase (client-side public keys should use NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:yyyy

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# AI provider
GOOGLE_GEMINI_API_KEY=xxxxx

# Widget
NEXT_PUBLIC_WIDGET_BASE_URL=https://your-domain.com/widget.js

Local Setup

Clone the repo

git clone <repo-url>
cd repo


Install dependencies

npm install
# or
pnpm install


Add .env values (from the previous section)

Initialize Prisma and run migrations

npx prisma generate
npx prisma migrate dev --name init


Start the development server

npm run dev
# or
pnpm dev


The app will be available at:
👉 http://localhost:3000

Development Workflow
Authentication

Firebase handles:

Email/password signup

Google Sign-in

The admin dashboard validates users by exchanging Firebase ID tokens with the backend (verified via Firebase Admin SDK or Firebase session cookies).

Projects

When a project is created:

Generate a unique project key (UUID)

Show an embed script snippet:

<!-- Copy this to client websites -->
<Script
  src="/widget.js"
  data-project={projectId}
  data-api-url={process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
  data-position="bottom-right"
  async
></Script>

<!-- Example external script usage -->
<script async src="https://your-backend.com/widget.js"></script>

Widget

Served from /widget.js

Accepts projectKey via:

window.FEEDBACK_WIDGET.projectKey, or

data-project HTML attribute

Widget Testing & Usage

Visit:
👉 http://localhost:3000/test
(This loads the widget locally.)

Widget Responsibilities

Opens popup/modal

Collects:

Type: Bug / Feature / Other

Description

Optional email

Client-side validation

Sends POST payload like:

{
  "projectKey": "project-key-123",
  "type": "bug",
  "content": "The submit button is broken",
  "email": "optional@user.com"
}

CORS

Backend must allow cross-origin requests using:
Access-Control-Allow-Origin and Access-Control-Allow-Credentials (if needed).

API Endpoints (Summary)
Method	Endpoint	Description
GET	/Auth/login	Login page
GET	/Auth/signup	Signup page
POST	/dashboard/projects	Create a project
GET	/dashboard/projects/createform	Form page to create a project
Future Improvements

Add rate limiting

Add load balancer (Nginx)

Improve widget performance and caching
