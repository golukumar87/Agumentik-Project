# Submission Checklist

Use this before sending the project to the company.

## Code Checklist

- Module 1 Authentication and Core Task System: Complete
- Module 2 Smart Task Prioritization Engine: Complete
- Module 3 Real-Time Task Updates: Complete
- Module 4 Productivity Insights and Activity Tracking: Complete
- Frontend build: Passes with `npm.cmd run build` inside `client`
- Backend syntax checks: Passed

## Local Setup
 
1. Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

2. Add MongoDB connection string and JWT secret in `server\.env`.

3. Install and run:

```bash
npm.cmd install
npm.cmd run install:all
npm.cmd run dev
```

## Required Final Submission Items

- Live application URL
- GitHub repository URL
- Demo video of 2-5 minutes

## Demo Video Points

- Explain MERN architecture.
- Show register and login.
- Create a task with deadline.
- Show priority sorting and overdue/high priority highlight.
- Update task status and show real-time update in another browser tab.
- Delete a task and show real-time dashboard update.
- Show insights: total tasks, completed tasks, pending tasks, daily activity count, completed today, completed per user and category distribution.

## Hosting Reminder

Localhost links are not accepted. Deploy backend first, then frontend.

- Backend: Render
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas
