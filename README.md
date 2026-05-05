# Real-Time Productivity Management System

MERN + Redux mini SaaS assessment project.

## Completed Modules

- Module 1: Authentication and Core Task System
- Module 2: Smart Task Prioritization Engine
- Module 3: Real-Time Task Updates
- Module 4: Productivity Insights and Activity Tracking

## Extra Professional Features

- Welcome page with guided entry into the app
- Clickable live module panel for real-time behavior
- Recent activity timeline for created, updated, completed and deleted task events
- Task detail modal with creator, created time, deadline, priority score and priority explanation
- Kanban board view for Pending, In Progress and Completed tasks
- Due date filters: Today, This week, Overdue and Completed
- Live toast notifications for Socket.io dashboard updates
- Demo data button that creates real MongoDB tasks through the backend
- User performance area with completed task counts

## Tech Stack

- Frontend: React.js, Redux Toolkit, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB
- Auth: JWT
- Realtime: Socket.io

## Run Locally

1. Install dependencies:

```bash
npm.cmd install
npm.cmd run install:all
```

2. Create backend environment file:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Update `server\.env` with your MongoDB connection string and JWT secret.

4. Start both apps:

```bash
npm.cmd run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Module Coverage

Module 1:

- Register and login APIs are JWT based.
- Protected API routes reject requests without valid token.
- Redux manages auth state and task state.
- Users can create, view, update and delete tasks from the React dashboard.
- Each task has MongoDB task ID, title, description, category, status, created timestamp and deadline.
- Task data is stored in MongoDB, not local-only task storage.

Module 2:

- Every task receives a dynamic priority score.
- Overdue tasks get highest priority.
- Priority increases automatically as deadline approaches.
- Same-priority tasks are sorted by earlier created timestamp first.
- Frontend shows priority score, priority label and visual highlighting for high/overdue tasks.
- Sorting is calculated from task data, with no manual recalculation button.

Module 3:

- Socket.io server is connected to the Express backend.
- Authenticated users join one shared workspace room.
- Task create, status change, update and delete events broadcast immediately.
- Frontend listens without page refresh and replaces the task queue plus insights from the live event.
- Multiple logged-in users or tabs see the same task updates in real time.

Module 4:

- Activity tracking stores task created, updated, completed and deleted events.
- Insights calculate total tasks, completed tasks, pending tasks, tasks completed today, daily activity count, completed tasks per user and category distribution.
- Dashboard updates dynamically from API fetch and real-time Socket.io events.

## Hosting

Use two services so the backend and frontend stay properly connected.

Backend on Render:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

Frontend on Vercel or Netlify:

- Root directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-url/api`
- Environment variable: `VITE_SOCKET_URL=https://your-backend-url`

After frontend deployment, update backend `CLIENT_URL` to the live frontend URL.

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `POST /api/tasks/demo`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/insights`

Task priority is calculated dynamically from deadline, overdue status, and created timestamp ordering.
